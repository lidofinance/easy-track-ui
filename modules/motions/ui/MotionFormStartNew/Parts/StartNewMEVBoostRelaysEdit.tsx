import { utils } from 'ethers'

import { Fragment, useCallback, useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Option, Button } from '@lidofinance/lido-ui'

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

import { ContractMEVBoostRelaysEdit } from 'modules/blockChain/contracts'

import { MEVBoostRelay, MotionTypeForms } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'

import { useMEVBoostRelaysList } from 'modules/motions/hooks/useMEVBoostRelaysList'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { CheckboxControl } from 'modules/shared/ui/Controls/Checkbox'
import { validateUrl } from 'modules/motions/utils/validateUrl'
import {
  MAX_MEV_BOOST_RELAY_STRING_LENGTH,
  MAX_MEV_BOOST_UPDATE_COUNT,
} from 'modules/motions/constants'

type MEVBoostRelayUpdate = MEVBoostRelay & {
  newUri: string
}

export const formParts = createMotionFormPart({
  motionType: MotionTypeForms.MEVBoostRelaysEdit,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      [
        'tuple(string uri, string operator, bool is_mandatory, string description)[]',
      ],
      [
        formData.relays.map(relay => ({
          uri: relay.newUri,
          operator: relay.name,
          is_mandatory: relay.isMandatory,
          description: relay.description,
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
    relays: [
      {
        uri: '',
        name: '',
        isMandatory: false,
        description: '',
        newUri: '',
      },
    ] as MEVBoostRelayUpdate[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { watch, setValue } = useFormContext()
    const { walletAddress } = useWeb3()
    const trustedCaller = ContractMEVBoostRelaysEdit.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { data: mevBoostRelaysList, initialLoading: isRelaysListLoading } =
      useMEVBoostRelaysList()

    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    const fieldsArr = useFieldArray({ name: fieldNames.relays })
    const selectedRelays: MEVBoostRelayUpdate[] = watch(fieldNames.relays)

    const getFilteredOptions = useCallback(
      (fieldIdx: number) => {
        if (!mevBoostRelaysList?.length) return []

        const selectedUrisSet = new Set(selectedRelays.map(relay => relay.uri))
        selectedUrisSet.delete(selectedRelays[fieldIdx].uri)

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
      [mevBoostRelaysList, selectedRelays],
    )

    const relaysDataMap = useMemo(() => {
      return new Map(
        (mevBoostRelaysList ?? []).map(relay => [relay.uri, relay]),
      )
    }, [mevBoostRelaysList])

    const handleAddRelay = () =>
      fieldsArr.append({
        uri: '',
        name: '',
        isMandatory: false,
        description: '',
        newUri: '',
      } as MEVBoostRelayUpdate)

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
          const relayInfo = relaysDataMap.get(selectedRelays[fieldIndex].uri)
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <>
                      <FieldsHeaderDesc>
                        Update #{fieldIndex + 1}
                      </FieldsHeaderDesc>
                      <RemoveItemButton
                        onClick={() => handleRemoveRelay(fieldIndex)}
                      >
                        Remove update {fieldIndex + 1}
                      </RemoveItemButton>
                    </>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <SelectControl
                    label="MEV Boost Relay"
                    name={`${fieldNames.relays}.${fieldIndex}.uri`}
                    rules={{ required: 'Field is required' }}
                    onChange={(value: string) => {
                      const relay = relaysDataMap.get(value)

                      if (relay) {
                        setValue(`${fieldNames.relays}.${fieldIndex}`, {
                          newUri: relay.uri,
                          name: relay.name,
                          isMandatory: relay.isMandatory,
                          description: relay.description,
                        })
                      }
                    }}
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

                <Fieldset>
                  <InputControl
                    label="Uri"
                    name={`${fieldNames.relays}.${fieldIndex}.newUri`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const valueLower = value.toLowerCase()

                        if (relayInfo?.uri.toLowerCase() === valueLower) {
                          return true
                        }

                        const urlErr = validateUrl(value)
                        if (urlErr) {
                          return urlErr
                        }

                        if (relaysDataMap.has(value)) {
                          return 'Uri must not be in use by another relay'
                        }

                        const uriInSelectedRelaysIndex =
                          selectedRelays.findIndex(
                            ({ newUri }, index) =>
                              newUri.toLowerCase() === valueLower &&
                              fieldIndex !== index,
                          )

                        if (uriInSelectedRelaysIndex !== -1) {
                          return 'Uri is already in use by another update'
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    label="New name"
                    name={`${fieldNames.relays}.${fieldIndex}.name`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const valueLower = value.toLowerCase()

                        if (relayInfo?.name.toLowerCase() === valueLower) {
                          return true
                        }

                        if (value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH) {
                          return `Name must be less than ${MAX_MEV_BOOST_RELAY_STRING_LENGTH} characters`
                        }

                        const isInUse = mevBoostRelaysList.find(
                          relay => relay.name.toLowerCase() === valueLower,
                        )

                        if (isInUse) {
                          return 'Name must not be in use by another relay'
                        }

                        const nameInSelectedRelaysIndex =
                          selectedRelays.findIndex(
                            ({ name }, index) =>
                              name.toLowerCase() === valueLower &&
                              fieldIndex !== index,
                          )

                        if (nameInSelectedRelaysIndex !== -1) {
                          return 'Name is already in use by another update'
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    label="New description"
                    name={`${fieldNames.relays}.${fieldIndex}.description`}
                    rules={{ required: 'Field is required' }}
                  />
                </Fieldset>

                <Fieldset>
                  <CheckboxControl
                    label="New mandatory flag"
                    name={`${fieldNames.relays}.${fieldIndex}.isMandatory`}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          )
        })}
        {fieldsArr.fields.length < mevBoostRelaysList.length &&
          selectedRelays.length < MAX_MEV_BOOST_UPDATE_COUNT && (
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
