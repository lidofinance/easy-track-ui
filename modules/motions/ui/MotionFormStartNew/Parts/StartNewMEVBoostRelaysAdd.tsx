import { utils } from 'ethers'

import { Fragment } from 'react'
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
  ErrorBox,
} from '../CreateMotionFormStyle'

import { ContractMEVBoostRelaysAdd } from 'modules/blockChain/contracts'

import { MEVBoostRelay, MotionTypeForms } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'

import { useMEVBoostRelays } from 'modules/motions/hooks/useMEVBoostRelays'
import {
  MAX_MEV_BOOST_RELAYS_COUNT,
  MAX_MEV_BOOST_RELAY_STRING_LENGTH,
  MAX_MEV_BOOST_UPDATE_COUNT,
} from 'modules/motions/constants'
import { CheckboxControl } from 'modules/shared/ui/Controls/Checkbox'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { Text } from 'modules/shared/ui/Common/Text'
import { validateRelayUrl } from 'modules/motions/utils/validateRelayUrl'

export const formParts = createMotionFormPart({
  motionType: MotionTypeForms.MEVBoostRelaysAdd,
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
      { uri: '', name: '', isMandatory: false, description: '' },
    ] as MEVBoostRelay[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { watch } = useFormContext()
    const { walletAddress } = useWeb3()
    const trustedCaller = ContractMEVBoostRelaysAdd.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { relaysMap, relaysCount, isRelaysDataLoading } = useMEVBoostRelays()

    const isTrustedCallerConnected = trustedCaller.data === walletAddress

    const fieldsArr = useFieldArray({ name: fieldNames.relays })
    const selectedRelays: MEVBoostRelay[] = watch(fieldNames.relays)

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

    if (!relaysMap) {
      return <ErrorBox>Cannot load MEV-Boost relays list</ErrorBox>
    }

    if (relaysCount >= MAX_MEV_BOOST_RELAYS_COUNT) {
      return <MessageBox>Relays limit reached</MessageBox>
    }

    return (
      <>
        <MotionInfoBox>
          <Text as="span" size={12} weight={500}>
            Max relays count: {MAX_MEV_BOOST_RELAYS_COUNT}.
          </Text>
        </MotionInfoBox>
        {fieldsArr.fields.map((item, fieldIndex) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                <FieldsHeaderDesc>
                  Relay #{relaysCount + fieldIndex}
                </FieldsHeaderDesc>
                {fieldsArr.fields.length > 1 && (
                  <RemoveItemButton
                    onClick={() => handleRemoveRelay(fieldIndex)}
                  >
                    Remove relay {relaysCount + fieldIndex}
                  </RemoveItemButton>
                )}
              </FieldsHeader>

              <Fieldset>
                <InputControl
                  label="Uri"
                  name={`${fieldNames.relays}.${fieldIndex}.uri`}
                  rules={{
                    required: 'Field is required',
                    validate: value => {
                      const urlErr = validateRelayUrl(value)
                      if (urlErr) {
                        return urlErr
                      }

                      if (value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH) {
                        return `Uri must be less than ${MAX_MEV_BOOST_RELAY_STRING_LENGTH} characters`
                      }

                      if (relaysMap.has(value)) {
                        return 'Uri must not be in use by another relay'
                      }

                      const uriInSelectedRelaysIndex = selectedRelays.findIndex(
                        ({ uri }, index) =>
                          uri.toLowerCase() === value.toLowerCase() &&
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
                  label="Name"
                  name={`${fieldNames.relays}.${fieldIndex}.name`}
                  rules={{
                    required: 'Field is required',
                    validate: value => {
                      if (value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH) {
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
                    required: 'Field is required',
                    validate: value => {
                      if (value.length > MAX_MEV_BOOST_RELAY_STRING_LENGTH) {
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
            </FieldsWrapper>
          </Fragment>
        ))}
        {MAX_MEV_BOOST_RELAYS_COUNT >
          fieldsArr.fields.length + selectedRelays.length &&
          selectedRelays.length < MAX_MEV_BOOST_UPDATE_COUNT && (
            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddRelay}
                icon={<Plus />}
                color="secondary"
              >
                One more relay
              </ButtonIcon>
            </Fieldset>
          )}

        {submitAction}
      </>
    )
  },
})
