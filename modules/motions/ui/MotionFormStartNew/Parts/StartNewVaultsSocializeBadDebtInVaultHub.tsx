import { utils } from 'ethers'

import { Fragment } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
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

import { ContractSocializeBadDebtInVaultHub } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { useVaultsDataMap } from 'modules/vaults/hooks/useVaultsDataMap'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { validateEtherValue } from 'modules/motions/utils/validateEtherValue'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { VaultAddressInputControl } from 'modules/vaults/ui/VaultAddressInputControl'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'

type VaultInput = {
  address: string
  acceptorAddress: string
  maxShareToSocialize: string
}

export const formParts = createMotionFormPart({
  motionType: MotionType.SocializeBadDebtInVaultHub,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'address[]', 'uint256[]'],
      [
        formData.vaults.map(vault => utils.getAddress(vault.address)),
        formData.vaults.map(vault => utils.getAddress(vault.acceptorAddress)),
        formData.vaults.map(vault =>
          utils.parseEther(vault.maxShareToSocialize),
        ),
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
        acceptorAddress: '',
        maxShareToSocialize: '',
      },
    ] as VaultInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const trustedCaller = ContractSocializeBadDebtInVaultHub.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { vaultsDataMap, getVaultData } = useVaultsDataMap({
      includeBadDebt: true,
    })

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults })

    const { watch } = useFormContext()
    const vaultsInputs: VaultInput[] = watch(fieldNames.vaults)

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        acceptorAddress: '',
        maxShareToSocialize: '',
      } as VaultInput)

    if (trustedCaller.initialLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        {vaultsFieldArray.fields.map((item, fieldIndex) => {
          const vaultData =
            vaultsDataMap[vaultsInputs[fieldIndex]?.address.toLowerCase()]

          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {vaultsFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      Update #{fieldIndex + 1}
                    </FieldsHeaderDesc>
                  )}
                  {vaultsFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => vaultsFieldArray.remove(fieldIndex)}
                    >
                      Remove update {fieldIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                {vaultData?.badDebtEth && (
                  <MotionInfoBox>
                    Current vault debt: {formatVaultParam(vaultData.badDebtEth)}
                  </MotionInfoBox>
                )}

                <Fieldset>
                  <VaultAddressInputControl
                    vaultsFieldName={fieldNames.vaults}
                    fieldIndex={fieldIndex}
                    getVaultData={getVaultData}
                  />
                </Fieldset>

                <Fieldset>
                  <InputControl
                    name={`${fieldNames.vaults}.${fieldIndex}.acceptorAddress`}
                    label="Acceptor address"
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const addressErr = validateAddress(value)
                        if (addressErr) {
                          return addressErr
                        }

                        const vaultAddress = vaultsInputs[fieldIndex]?.address
                        if (
                          vaultAddress &&
                          value.toLowerCase() === vaultAddress.toLowerCase()
                        ) {
                          return 'Acceptor address cannot be the same as vault address'
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberControl
                    name={`${fieldNames.vaults}.${fieldIndex}.maxShareToSocialize`}
                    label="Max share to socialize"
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const amountError = validateEtherValue(value)
                        if (amountError) {
                          return amountError
                        }

                        const parsedValue = utils.parseEther(value)
                        if (parsedValue.isZero()) {
                          return 'Amount must be greater than 0'
                        }

                        if (vaultData?.badDebtEth) {
                          if (parsedValue.gt(vaultData.badDebtEth)) {
                            return `Amount exceeds current vault debt (${formatVaultParam(
                              vaultData.badDebtEth,
                            )})`
                          }
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          )
        })}

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
