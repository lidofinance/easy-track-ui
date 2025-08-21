import { utils } from 'ethers'

import { Fragment, useEffect, useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'

import { MAX_SUBMIT_HASH_COUNT } from 'modules/motions/constants'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { Text } from 'modules/shared/ui/Common/Text'
import { useNodeOperatorsList } from 'modules/motions/hooks'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'
import { useSigningKeysReducer } from 'modules/motions/hooks/useSigningKeysReducer'
import { validatePublicKey } from 'modules/motions/utils/validatePublicKey'

type SubmitHashesRequest = {
  valIndex: string
  valPubkey: string
  valPubKeyIndex: string
}

const CURATED_STAKING_MODULE_ID = 1

export const formParts = createMotionFormPart({
  motionType: MotionType.CuratedExitRequestHashesSubmit,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedRequests = formData.requests.sort(
      (a, b) => Number(a.valIndex) - Number(b.valIndex),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      [
        'tuple(uint256 moduleId, uint256 nodeOpId, uint64 valIndex, bytes valPubKey, uint256 valPubKeyIndex)[]',
      ],
      [
        sortedRequests.map(request => ({
          moduleId: CURATED_STAKING_MODULE_ID,
          nodeOpId: Number(formData.nodeOperatorId),
          valIndex: Number(request.valIndex),
          valPubKey: request.valPubkey,
          valPubKeyIndex: Number(request.valPubKeyIndex),
        })),
      ],
    )
    const gasLimit = await estimateGasFallback(
      contract.estimateGas.createMotion(evmScriptFactory, encodedCallData),
    )
    const tx = await contract.populateTransaction.createMotion(
      evmScriptFactory,
      encodedCallData,
      { gasLimit },
    )
    return tx
  },
  getDefaultFormData: () => ({
    requests: [
      {
        valIndex: '',
        valPubkey: '',
        valPubKeyIndex: '',
      },
    ] as SubmitHashesRequest[],
    nodeOperatorId: null as number | null,
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { setValue, getValues } = useFormContext()
    const { walletAddress } = useWeb3()

    const { getSigningKey } = useSigningKeysReducer('curated')

    const {
      data: nodeOperatorsList,
      initialLoading: isNodeOperatorsListLoading,
    } = useNodeOperatorsList('curated')

    const currentNodeOperator = useMemo(() => {
      if (!walletAddress || !nodeOperatorsList) {
        return null
      }
      return nodeOperatorsList.find(
        o =>
          utils.getAddress(o.rewardAddress) === utils.getAddress(walletAddress),
      )
    }, [nodeOperatorsList, walletAddress])

    const isNodeOperatorConnected = !!currentNodeOperator

    const fieldsArr = useFieldArray({ name: fieldNames.requests })

    useEffect(() => {
      if (
        getValues(fieldNames.nodeOperatorId) === null &&
        currentNodeOperator
      ) {
        setValue(fieldNames.nodeOperatorId, currentNodeOperator.id)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentNodeOperator])

    const handleAddRequest = () =>
      fieldsArr.append({
        valIndex: '',
        valPubkey: '',
        valPubKeyIndex: '',
      } as SubmitHashesRequest)

    const handleRemoveRequest = (fieldIndex: number) =>
      fieldsArr.remove(fieldIndex)

    if (isNodeOperatorsListLoading) {
      return <PageLoader />
    }

    if (!isNodeOperatorConnected) {
      return <MessageBox>You should be connected as node operator</MessageBox>
    }

    const totalSigningKeys = currentNodeOperator.totalAddedValidators.toNumber()

    return (
      <>
        <MotionInfoBox>
          <Text size={14} weight={800}>
            Connected Node Operator
          </Text>
          <Text size={12} weight={500}>
            {currentNodeOperator.name} (id: {currentNodeOperator.id})
          </Text>
        </MotionInfoBox>
        {fieldsArr.fields.map((item, fieldIndex) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                <FieldsHeaderDesc>Request #{fieldIndex + 1}</FieldsHeaderDesc>
                {fieldsArr.fields.length > 1 && (
                  <RemoveItemButton
                    onClick={() => handleRemoveRequest(fieldIndex)}
                  >
                    Remove request {fieldIndex + 1}
                  </RemoveItemButton>
                )}
              </FieldsHeader>

              <Fieldset>
                <InputNumberControl
                  name={`${fieldNames.requests}.${fieldIndex}.valIndex`}
                  label="Validator Index"
                  rules={{
                    required: 'Field is required',
                    validate: value => {
                      const uintError = validateUintValue(value)
                      if (uintError) {
                        return uintError
                      }

                      return true
                    },
                  }}
                />
              </Fieldset>

              <Fieldset>
                <InputNumberControl
                  name={`${fieldNames.requests}.${fieldIndex}.valPubKeyIndex`}
                  label={`Validator Key Index (0-${totalSigningKeys - 1})`}
                  rules={{
                    required: 'Field is required',
                    validate: async value => {
                      const uintError = validateUintValue(value)
                      if (uintError) {
                        return uintError
                      }

                      const valueNum = Number(value)

                      if (valueNum >= totalSigningKeys) {
                        return `Value must be less than ${totalSigningKeys}`
                      }

                      const pubKey = getValues(
                        `${fieldNames.requests}.${fieldIndex}.valPubkey`,
                      )
                      const pubKeyErr = validatePublicKey(pubKey)
                      if (!pubKeyErr) {
                        const signingKey = await getSigningKey(
                          currentNodeOperator.id,
                          valueNum,
                        )
                        if (
                          utils.keccak256(signingKey) !==
                          utils.keccak256(pubKey)
                        ) {
                          return 'Public key does not match the signing key for this index'
                        }
                      }

                      return true
                    },
                  }}
                />
              </Fieldset>

              <Fieldset>
                <InputControl
                  label="Validator Public Key"
                  name={`${fieldNames.requests}.${fieldIndex}.valPubkey`}
                  rules={{
                    required: 'Field is required',
                    validate: async value => {
                      const err = validatePublicKey(value)
                      if (err) {
                        return err
                      }

                      const pubKeyIndex = getValues(
                        `${fieldNames.requests}.${fieldIndex}.valPubKeyIndex`,
                      )
                      const pubKeyIndexErr = validateUintValue(pubKeyIndex)
                      if (pubKeyIndexErr) {
                        return true
                      }
                      const pubKeyIndexNum = Number(pubKeyIndex)
                      if (pubKeyIndexNum < totalSigningKeys) {
                        const signingKey = await getSigningKey(
                          currentNodeOperator.id,
                          pubKeyIndexNum,
                        )
                        if (
                          utils.keccak256(signingKey) !== utils.keccak256(value)
                        ) {
                          return 'Public key does not match the signing key for this index'
                        }
                      }
                    },
                  }}
                />
              </Fieldset>
            </FieldsWrapper>
          </Fragment>
        ))}
        {fieldsArr.fields.length < MAX_SUBMIT_HASH_COUNT && (
          <Fieldset>
            <ButtonIcon
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddRequest}
              icon={<Plus />}
              color="secondary"
            >
              One more request
            </ButtonIcon>
          </Fieldset>
        )}

        {submitAction}
      </>
    )
  },
})
