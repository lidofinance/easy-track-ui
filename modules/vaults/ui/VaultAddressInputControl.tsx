import { validateAddress } from 'modules/motions/utils/validateAddress'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { useFormContext } from 'react-hook-form'
import { VaultData } from '../types'

type Props = {
  vaultsFieldName: string
  fieldIndex: number
  getVaultData: (address: string) => Promise<VaultData | null | undefined>
  onValidVaultAddressInput?: (vaultData: VaultData) => void
  extraValidateFn?: (vaultData: VaultData) => string | undefined
}

type VaultInput = {
  address: string
}

export const VaultAddressInputControl = ({
  vaultsFieldName,
  fieldIndex,
  getVaultData,
  onValidVaultAddressInput,
  extraValidateFn,
}: Props) => {
  const { setError, clearErrors, getValues } = useFormContext()

  const validateVaultAddress = (value: string) => {
    console.log('Validating vault address input:', value)
    console.log('field index:', fieldIndex)
    console.log('------------------------------')
    if (!value) return
    const addressErr = validateAddress(value)
    if (addressErr) {
      return addressErr
    }

    const lowerAddress = value.toLowerCase()

    const vaultsInputs: VaultInput[] = getValues(vaultsFieldName)

    const addressInGroupInputIndex = vaultsInputs.findIndex(
      ({ address }, index) =>
        address.toLowerCase() === lowerAddress && fieldIndex !== index,
    )

    if (addressInGroupInputIndex !== -1) {
      return 'Address is already in use by another update within the motion'
    }
  }

  const handleValueChange = async (e: any) => {
    const value = e.target.value
    console.log('Validating vault address input:', value)
    console.log('field index:', fieldIndex)
    console.log('------------------------------')
    if (!value) return
    const addressErr = validateVaultAddress(value)
    if (addressErr) {
      setError(`${vaultsFieldName}.${fieldIndex}.address`, {
        type: 'validate',
        message: addressErr,
      })
      return
    }

    const lowerAddress = value.toLowerCase()
    // Fetch vault data
    const vaultData = await getVaultData(lowerAddress)

    if (!vaultData) {
      setError(`${vaultsFieldName}.${fieldIndex}.address`, {
        type: 'validate',
        message: 'Invalid vault address',
      })
      return
    }

    // Extra validation
    const extraValidationResult = extraValidateFn?.(vaultData)
    if (typeof extraValidationResult === 'string') {
      setError(`${vaultsFieldName}.${fieldIndex}.address`, {
        type: 'validate',
        message: extraValidationResult,
      })
      return
    }

    // Call callback with valid vault data
    onValidVaultAddressInput?.(vaultData)
    clearErrors(`${vaultsFieldName}.${fieldIndex}.address`)
  }

  return (
    <InputControl
      name={`${vaultsFieldName}.${fieldIndex}.address`}
      label="Vault address"
      rules={{ required: 'Field is required' }}
      onChange={e => {
        setTimeout(() => {
          handleValueChange(e)
        }, 500)
      }}
    />
  )
}
