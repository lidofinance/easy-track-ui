import { validateAddress } from 'modules/motions/utils/validateAddress'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { useFormContext, useWatch } from 'react-hook-form'
import { VaultData } from '../types'
import { useEffect } from 'react'
import { useDebounce } from 'modules/shared/hooks/useDebounce'

type Props = {
  vaultsFieldName: string
  fieldIndex: number
  allowDisconnectedVaults?: boolean
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
  allowDisconnectedVaults,
  getVaultData,
  onValidVaultAddressInput,
  extraValidateFn,
}: Props) => {
  const { setError, clearErrors, getValues } = useFormContext()

  const fieldName = `${vaultsFieldName}.${fieldIndex}.address`
  const fieldValue = useWatch({ name: fieldName })

  const debouncedAddress = useDebounce(fieldValue, 500)

  const validateVaultAddressSync = (value: string) => {
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

  useEffect(() => {
    if (!debouncedAddress) {
      clearErrors(fieldName)
      return
    }
    console.log('Validating vault address:', debouncedAddress)

    const addressErr = validateVaultAddressSync(debouncedAddress)
    if (addressErr) {
      setError(fieldName, { type: 'validate', message: addressErr })
      return
    }

    let isCurrent = true // Guard against race conditions

    const fetchAndValidate = async () => {
      const lowerAddress = debouncedAddress.toLowerCase()

      const vaultData = await getVaultData(lowerAddress)

      // Check if this effect is still the latest one before setting state
      if (!isCurrent) return

      if (!vaultData) {
        setError(fieldName, {
          type: 'validate',
          message: 'Invalid vault address',
        })
        return
      }

      if (!allowDisconnectedVaults && !vaultData.isVaultConnected) {
        setError(fieldName, {
          type: 'validate',
          message: 'Vault is not connected in the Operator Grid',
        })
        return
      }

      const extraValidationResult = extraValidateFn?.(vaultData)
      if (typeof extraValidationResult === 'string') {
        setError(fieldName, {
          type: 'validate',
          message: extraValidationResult,
        })
        return
      }

      // Success handling
      onValidVaultAddressInput?.(vaultData)
      clearErrors(fieldName)
    }

    fetchAndValidate()

    // Cleanup
    return () => {
      isCurrent = false
    }

    // Only run when the debounced value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAddress])

  return (
    <InputControl
      name={fieldName}
      label="Vault address"
      rules={{ required: 'Field is required' }}
    />
  )
}
