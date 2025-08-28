import { utils } from 'ethers'

import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@lidofinance/lido-ui'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { TextareaControl } from 'modules/shared/ui/Controls/Textarea'
import {
  Fieldset,
  HashRequestBlock,
  HashRequestError,
  HashRequests,
  MessageBox,
} from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'

import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { Text } from 'modules/shared/ui/Common/Text'
import { useNodeOperatorsList } from 'modules/motions/hooks'
import {
  ParsingResultData,
  validateAndParseRequestHashes,
} from 'modules/motions/utils/validateAndParseRequestHashes'
import { useSWR } from 'modules/network/hooks/useSwr'
import { ContractSDVTExitRequestHashesSubmit } from 'modules/blockChain/contracts'

export const formParts = (stakingModuleType: 'curated' | 'sdvt') =>
  createMotionFormPart({
    motionType:
      stakingModuleType === 'curated'
        ? MotionType.CuratedExitRequestHashesSubmit
        : MotionType.SDVTExitRequestHashesSubmit,
    populateTx: async ({ evmScriptFactory, formData, contract }) => {
      const gasLimit = await estimateGasFallback(
        contract.estimateGas.createMotion(evmScriptFactory, formData.calldata),
      )

      const tx = await contract.populateTransaction.createMotion(
        evmScriptFactory,
        formData.calldata,
        { gasLimit },
      )
      return tx
    },
    getDefaultFormData: () => ({
      calldata: '',
    }),
    Component: ({ fieldNames, submitAction }) => {
      const { trigger, setError, getValues, formState } = useFormContext()

      const { walletAddress, chainId, library } = useWeb3()

      const [parsedHashData, setParsedHashData] =
        useState<ParsingResultData | null>(null)

      const {
        data: nodeOperatorsList,
        initialLoading: isNodeOperatorsListLoading,
      } = useNodeOperatorsList(stakingModuleType)

      const { data: isTrustedCaller, initialLoading: isTrustedCallerLoading } =
        useSWR(
          walletAddress && nodeOperatorsList?.length
            ? `request-hashes-submit-is-trusted-caller-${walletAddress}`
            : null,
          async () => {
            if (!nodeOperatorsList || !walletAddress) {
              return false
            }

            if (stakingModuleType === 'sdvt') {
              const factory = ContractSDVTExitRequestHashesSubmit.connect({
                chainId,
                library: library!,
              })
              const trustedCaller = await factory.trustedCaller()

              return trustedCaller.toLowerCase() === walletAddress.toLowerCase()
            }

            return (
              nodeOperatorsList.findIndex(
                o =>
                  utils.getAddress(o.rewardAddress) ===
                  utils.getAddress(walletAddress),
              ) !== -1
            )
          },
          {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          },
        )

      const currentNodeOperator = useMemo(() => {
        if (
          !walletAddress ||
          !nodeOperatorsList ||
          stakingModuleType === 'sdvt'
        ) {
          return null
        }
        return nodeOperatorsList.find(
          o =>
            utils.getAddress(o.rewardAddress) ===
            utils.getAddress(walletAddress),
        )
      }, [nodeOperatorsList, walletAddress])

      const validateAndParseCalldata = async () => {
        const isCalldataValid = await trigger(fieldNames.calldata)
        if (!isCalldataValid) {
          setError(fieldNames.calldata, { message: 'Invalid calldata' })
          return
        }
        const calldata = getValues(fieldNames.calldata).trim()
        const validationResult = validateAndParseRequestHashes({
          calldata,
          registryType: stakingModuleType,
          nodeOperatorsCount: nodeOperatorsList!.length,
          nodeOperatorId: currentNodeOperator?.id,
        })
        if (validationResult.error) {
          setError(fieldNames.calldata, { message: validationResult.error })
          setParsedHashData(null)
        }
        setParsedHashData(validationResult.data)
      }

      const handleCalldataChange = () => {
        if (parsedHashData) {
          setParsedHashData(null)
        }
      }

      if (isNodeOperatorsListLoading || isTrustedCallerLoading) {
        return <PageLoader />
      }

      if (stakingModuleType === 'sdvt' && !isTrustedCaller) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        )
      }

      if (stakingModuleType === 'curated' && !isTrustedCaller) {
        return <MessageBox>You should be connected as node operator</MessageBox>
      }

      const calldataError = formState.errors[fieldNames.calldata.split('.')[0]]
        ?.calldata as string | undefined

      const isFormValid = !calldataError && parsedHashData?.length

      return (
        <>
          {currentNodeOperator && (
            <MotionInfoBox>
              <Text size={14} weight={800}>
                Connected Node Operator
              </Text>
              <Text size={12} weight={500}>
                {currentNodeOperator.name} (id: {currentNodeOperator.id})
              </Text>
            </MotionInfoBox>
          )}
          <Fieldset>
            <TextareaControl
              rows={10}
              label="Calldata"
              placeholder="0x..."
              name={fieldNames.calldata}
              onChange={handleCalldataChange}
              rules={{
                required: 'Field is required',
                validate: value => {
                  if (value.trim() === '') {
                    return 'Calldata cannot be empty'
                  }

                  if (!utils.isHexString(value)) {
                    return 'Calldata must be a valid hex string'
                  }

                  return true
                },
              }}
            />
          </Fieldset>
          <Fieldset>
            <Button
              type="button"
              fullwidth
              disabled={!!calldataError}
              onClick={validateAndParseCalldata}
            >
              Validate & parse calldata
            </Button>
          </Fieldset>

          {isFormValid ? (
            <>
              <Fieldset>
                <MotionInfoBox>
                  Calldata parsed successfully. You can now submit the motion.
                  Scroll down to examine parsed requests.
                </MotionInfoBox>
                {submitAction}
              </Fieldset>
              <Fieldset>
                <Text size={26} weight={800}>
                  Parsed requests ({parsedHashData.length})
                </Text>
              </Fieldset>
            </>
          ) : null}

          {parsedHashData?.length ? (
            <HashRequests>
              {parsedHashData.map((item, index) => (
                <HashRequestBlock key={index} $withError={!!item.errors.length}>
                  {item.errors.length ? (
                    <HashRequestError>
                      Errors: {item.errors.join(', ')}
                    </HashRequestError>
                  ) : null}
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Module ID:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.moduleId}
                    </Text>
                  </Text>
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Node operator ID:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.nodeOpId}
                    </Text>
                  </Text>
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Validator Index:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.valIndex}
                    </Text>
                  </Text>
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Pubkey Index:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.valPubKeyIndex}
                    </Text>
                  </Text>
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Pubkey:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.valPubkey}
                    </Text>
                  </Text>
                </HashRequestBlock>
              ))}
            </HashRequests>
          ) : null}
        </>
      )
    },
  })
