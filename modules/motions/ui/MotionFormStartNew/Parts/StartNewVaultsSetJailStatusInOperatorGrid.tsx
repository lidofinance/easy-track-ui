import { utils } from 'ethers'

import { Fragment } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../CreateMotionFormStyle'

import { ContractSetJailStatusInOperatorGrid } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { useVaultsDataMap } from 'modules/vaults/hooks/useVaultsDataMap'
import { isAddress } from 'ethers/lib/utils'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { VaultAddressInputControl } from 'modules/vaults/ui/VaultAddressInputControl'
import { Text } from 'modules/shared/ui/Common/Text'

type VaultInput = {
  address: string
  isInJail: boolean | null
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SetJailStatusInOperatorGrid,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'bool[]'],
      [
        formData.vaults.map(vault => utils.getAddress(vault.address)),
        formData.vaults.map(vault => vault.isInJail),
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
    vaults: [
      {
        address: '',
        isInJail: null,
      },
    ] as VaultInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const trustedCaller = ContractSetJailStatusInOperatorGrid.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { vaultsDataMap, getVaultData } = useVaultsDataMap({
      includeJailStatus: true,
    })

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults })

    const { formState, control, register } = useFormContext()
    const vaultsInputs: VaultInput[] = useWatch({
      control,
      name: fieldNames.vaults,
    })

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        isInJail: null,
      } as VaultInput)

    if (trustedCaller.initialLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    const sharedNodeOperatorAddress =
      !formState.errors[`${fieldNames.vaults}.0.address`] &&
      vaultsDataMap[vaultsInputs[0]?.address.toLowerCase()]?.nodeOperator

    return (
      <>
        <MotionInfoBox>
          Note: all vaults within the motion must share the node operator
          address.
          {typeof sharedNodeOperatorAddress === 'string' &&
          isAddress(sharedNodeOperatorAddress) ? (
            <>
              <br />
              Current address:
              <AddressInlineWithPop
                address={sharedNodeOperatorAddress}
                trim={false}
              />
            </>
          ) : null}
        </MotionInfoBox>
        {vaultsFieldArray.fields.map((item, fieldIndex) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                {vaultsFieldArray.fields.length > 1 && (
                  <FieldsHeaderDesc>Update #{fieldIndex + 1}</FieldsHeaderDesc>
                )}
                {vaultsFieldArray.fields.length > 1 && (
                  <RemoveItemButton
                    onClick={() => vaultsFieldArray.remove(fieldIndex)}
                  >
                    Remove update {fieldIndex + 1}
                  </RemoveItemButton>
                )}
              </FieldsHeader>

              <Fieldset>
                <VaultAddressInputControl
                  vaultsFieldName={fieldNames.vaults}
                  fieldIndex={fieldIndex}
                  getVaultData={getVaultData}
                  onValidVaultAddressInput={data => {
                    // Update isInJail based on current jail status automatically
                    const currentJailStatus = data.jailStatus
                    vaultsFieldArray.update(fieldIndex, {
                      ...vaultsInputs[fieldIndex],
                      isInJail: !currentJailStatus,
                    })
                  }}
                  extraValidateFn={vaultData => {
                    if (
                      fieldIndex > 0 &&
                      vaultData.nodeOperator !== sharedNodeOperatorAddress
                    ) {
                      return 'All vaults within the motion must share the same node operator address'
                    }
                  }}
                />
              </Fieldset>

              {typeof vaultsInputs[fieldIndex]?.isInJail === 'boolean' && (
                <Text size={16}>
                  This vault jail status will be changed to{' '}
                  <b>{vaultsInputs[fieldIndex].isInJail ? 'True' : 'False'}</b>.
                </Text>
              )}

              <input
                type="hidden"
                {...register(`${fieldNames.vaults}.${fieldIndex}.isInJail`, {
                  validate: value => {
                    if (value === null) {
                      return 'Please enter a valid vault address first'
                    }
                    return true
                  },
                })}
              />
            </FieldsWrapper>
          </Fragment>
        ))}

        <Fieldset>
          <ButtonIcon
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddUpdate}
            icon={<Plus />}
            color="secondary"
          >
            One more update
          </ButtonIcon>
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
