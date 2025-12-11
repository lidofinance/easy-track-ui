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

  const fieldName = `${vaultsFieldName}.${fieldIndex}.address`

  const validateVaultAddress = (value: string) => {
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
    if (!value) return
    const addressErr = validateVaultAddress(value)
    if (addressErr) {
      setError(fieldName, {
        type: 'validate',
        message: addressErr,
      })
      return
    }

    const lowerAddress = value.toLowerCase()
    // Fetch vault data
    const vaultData = await getVaultData(lowerAddress)

    if (!vaultData) {
      setError(fieldName, {
        type: 'validate',
        message: 'Invalid vault address',
      })
      return
    }

    // Extra validation
    const extraValidationResult = extraValidateFn?.(vaultData)
    if (typeof extraValidationResult === 'string') {
      setError(fieldName, {
        type: 'validate',
        message: extraValidationResult,
      })
      return
    }

    // Call callback with valid vault data
    onValidVaultAddressInput?.(vaultData)
    clearErrors(fieldName)
  }

  return (
    <InputControl
      name={fieldName}
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
