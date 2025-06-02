import { utils } from 'ethers'

import { Fragment, useCallback } from 'react'
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

import { useMEVBoostRelays } from 'modules/motions/hooks/useMEVBoostRelays'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { CheckboxControl } from 'modules/shared/ui/Controls/Checkbox'
import {
  MAX_MEV_BOOST_RELAY_STRING_LENGTH,
  MAX_MEV_BOOST_UPDATE_COUNT,
} from 'modules/motions/constants'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { Text } from 'modules/shared/ui/Common/Text'

export const formParts = createMotionFormPart({
  motionType: MotionTypeForms.MEVBoostRelaysEdit,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      [
        'tuple(string uri, string operator, bool is_mandatory, string description)[]',
      ],
      [
        formData.relays.map(relay => ({
          uri: relay.uri,
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
      },
    ] as MEVBoostRelay[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { watch, setValue } = useFormContext()
    const { walletAddress } = useWeb3()
    const trustedCaller = ContractMEVBoostRelaysEdit.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { relaysList, relaysCount, relaysMap, isRelaysDataLoading } =
      useMEVBoostRelays()

    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    const fieldsArr = useFieldArray({ name: fieldNames.relays })
    const selectedRelays: MEVBoostRelay[] = watch(fieldNames.relays)

    const getFilteredOptions = useCallback(
      (fieldIdx: number) => {
        if (!relaysList?.length) return []

        const selectedUrisSet = new Set(selectedRelays.map(relay => relay.uri))
        selectedUrisSet.delete(selectedRelays[fieldIdx].uri)

        const options: { label: string; value: string }[] = []

        for (const relay of relaysList) {
          if (!selectedUrisSet.has(relay.uri)) {
            options.push({
              label: `${relay.name} (${relay.uriHost})`,
              value: relay.uri,
            })
          }
        }

        return options
      },
      [relaysList, selectedRelays],
    )

    const handleAddRelay = () =>
      fieldsArr.append({
        uri: '',
        name: '',
        isMandatory: false,
        description: '',
      } as MEVBoostRelay)

    const handleRemoveRelay = (fieldIndex: number) =>
      fieldsArr.remove(fieldIndex)

    if (trustedCaller.initialLoading || isRelaysDataLoading) {
      return <PageLoader />
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!Array.isArray(relaysList) || !relaysMap) {
      return <ErrorBox>Cannot load MEV-Boost relays list</ErrorBox>
    }

    return (
      <>
        <MotionInfoBox>
          <Text as="span" size={12} weight={500}>
            Due to the smart contract&quot;s limitations, the maximum number of
            updates per motion is {MAX_MEV_BOOST_UPDATE_COUNT}.
          </Text>
        </MotionInfoBox>
        {fieldsArr.fields.map((item, fieldIndex) => {
          const relayInfo = relaysMap.get(selectedRelays[fieldIndex].uri)
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
                      const relay = relaysMap.get(value)

                      if (relay) {
                        setValue(`${fieldNames.relays}.${fieldIndex}`, {
                          uri: relay.uri,
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

                {!!relayInfo && (
                  <>
                    <Fieldset>
                      <InputControl
                        label="Uri"
                        name={`${fieldNames.relays}.${fieldIndex}.uri`}
                        readOnly
                        disabled
                      />
                    </Fieldset>

                    <Fieldset>
                      <InputControl
                        label="Name"
                        name={`${fieldNames.relays}.${fieldIndex}.name`}
                        rules={{
                          required: 'Name is required',
                          validate: value => {
                            const valueLower = value.toLowerCase()

                            if (!valueLower.trim().length) {
                              return 'Name must not be empty'
                            }

                            if (relayInfo.name.toLowerCase() === valueLower) {
                              return true
                            }

                            if (
                              value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH
                            ) {
                              return `Name must be less than ${MAX_MEV_BOOST_RELAY_STRING_LENGTH} characters`
                            }

                            return true
                          },
                        }}
                      />
                    </Fieldset>
                    <Fieldset>
                      <InputControl
                        label="Description"
                        name={`${fieldNames.relays}.${fieldIndex}.description`}
                        rules={{
                          required: 'Description is required',
                          validate: value => {
                            if (!value.trim().length) {
                              return 'Description must not be empty'
                            }

                            if (
                              value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH
                            ) {
                              return `Description must be less than ${MAX_MEV_BOOST_RELAY_STRING_LENGTH} characters`
                            }

                            return true
                          },
                        }}
                      />
                    </Fieldset>
                    <Fieldset>
                      <CheckboxControl
                        label="Mandatory"
                        name={`${fieldNames.relays}.${fieldIndex}.isMandatory`}
                      />
                    </Fieldset>
                  </>
                )}
              </FieldsWrapper>
            </Fragment>
          )
        })}
        {fieldsArr.fields.length < relaysCount &&
          fieldsArr.fields.length < MAX_MEV_BOOST_UPDATE_COUNT && (
            <Fieldset>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddRelay}
                color="secondary"
              >
                Update one more relay
              </Button>
            </Fieldset>
          )}

        {submitAction}
      </>
    )
  },
})
