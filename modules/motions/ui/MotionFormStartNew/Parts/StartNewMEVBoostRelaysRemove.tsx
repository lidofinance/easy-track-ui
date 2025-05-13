import { utils } from 'ethers'

import { Fragment, useCallback, useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Option, Button, Input, Checkbox } from '@lidofinance/lido-ui'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  ErrorBox,
} from '../CreateMotionFormStyle'

import { ContractMEVBoostRelaysRemove } from 'modules/blockChain/contracts'

import { MotionTypeForms } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'

import { useMEVBoostRelaysList } from 'modules/motions/hooks/useMEVBoostRelaysList'
import { SelectControl } from 'modules/shared/ui/Controls/Select'

type RelayUri = {
  uri: string
}

export const formParts = createMotionFormPart({
  motionType: MotionTypeForms.MEVBoostRelaysRemove,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['string[]'],
      [formData.relayUris.map(relay => relay.uri)],
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
    relayUris: [{ uri: '' }] as RelayUri[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { watch } = useFormContext()
    const { walletAddress } = useWeb3()
    const trustedCaller = ContractMEVBoostRelaysRemove.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { data: mevBoostRelaysList, initialLoading: isRelaysListLoading } =
      useMEVBoostRelaysList()

    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    const fieldsArr = useFieldArray({ name: fieldNames.relayUris })
    const selectedUris: RelayUri[] = watch(fieldNames.relayUris)

    const getFilteredOptions = useCallback(
      (fieldIdx: number) => {
        if (!mevBoostRelaysList?.length) return []

        const selectedUrisSet = new Set(selectedUris.map(relay => relay.uri))
        selectedUrisSet.delete(selectedUris[fieldIdx].uri)

        const options: { label: string; value: string }[] = []

        for (const relay of mevBoostRelaysList) {
          if (!selectedUrisSet.has(relay.uri)) {
            options.push({
              label: relay.name,
              value: relay.uri,
            })
          }
        }

        return options
      },
      [mevBoostRelaysList, selectedUris],
    )

    const relaysDataMap = useMemo(() => {
      return new Map(
        (mevBoostRelaysList ?? []).map(relay => [relay.uri, relay]),
      )
    }, [mevBoostRelaysList])

    const handleAddRelay = () =>
      fieldsArr.append({
        uri: '',
      } as RelayUri)

    const handleRemoveRelay = (fieldIndex: number) =>
      fieldsArr.remove(fieldIndex)

    if (trustedCaller.initialLoading || isRelaysListLoading) {
      return <PageLoader />
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!Array.isArray(mevBoostRelaysList)) {
      return <ErrorBox>Cannot load MEV-Boost relays list</ErrorBox>
    }

    return (
      <>
        {fieldsArr.fields.map((item, fieldIndex) => {
          const selectedRelayInfo = relaysDataMap.get(
            selectedUris[fieldIndex].uri,
          )

          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <>
                      <FieldsHeaderDesc>
                        Deletion #{fieldIndex + 1}
                      </FieldsHeaderDesc>
                      <RemoveItemButton
                        onClick={() => handleRemoveRelay(fieldIndex)}
                      >
                        Remove deletion {fieldIndex + 1}
                      </RemoveItemButton>
                    </>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <SelectControl
                    label="MEV Boost Relay"
                    name={`${fieldNames.relayUris}.${fieldIndex}.uri`}
                    rules={{ required: 'Field is required' }}
                  >
                    {getFilteredOptions(fieldIndex).map((option, i) => (
                      <Option
                        key={i}
                        value={option.value}
                        children={option.label}
                      />
                    ))}
                  </SelectControl>
                </Fieldset>

                {selectedRelayInfo && (
                  <>
                    <Fieldset>
                      <Input
                        disabled
                        readOnly
                        value={selectedRelayInfo.uri}
                        label="Uri"
                      />
                    </Fieldset>
                    <Fieldset>
                      <Input
                        readOnly
                        disabled
                        value={selectedRelayInfo.description}
                        label="Description"
                      />
                    </Fieldset>
                    <Fieldset>
                      <Checkbox
                        disabled
                        readOnly
                        checked={selectedRelayInfo.isMandatory}
                        label="Mandatory"
                      />
                    </Fieldset>
                  </>
                )}
              </FieldsWrapper>
            </Fragment>
          )
        })}
        {fieldsArr.fields.length < mevBoostRelaysList.length && (
          <Fieldset>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddRelay}
              color="secondary"
            >
              Remove one more relay
            </Button>
          </Fieldset>
        )}

        {submitAction}
      </>
    )
  },
})
