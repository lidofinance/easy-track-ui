import React, { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { DEFAULT_TIER_OPERATOR } from '../constants'
import { Group } from '../types'
import { useDebounce } from 'modules/shared/hooks/useDebounce'

type Props = {
  groupFieldName: string
  fieldIndex: number
  allowDuplicateAddresses?: boolean
  allowDefaultOperatorAddress?: boolean
  getGroupData: (address: string) => Promise<any | null | undefined>
  onValidOperatorAddressInput?: (groupData: Group) => void
  extraValidateFn?: (groupData: Group) => string | undefined
}

type GroupInput = {
  nodeOperator: string
}

export const OperatorGridAddressInputControl = ({
  groupFieldName,
  fieldIndex,
  allowDuplicateAddresses,
  allowDefaultOperatorAddress = true,
  getGroupData,
  onValidOperatorAddressInput,
  extraValidateFn,
}: Props) => {
  const { setError, clearErrors, getValues } = useFormContext()

  const fieldName = `${groupFieldName}.${fieldIndex}.nodeOperator`
  const fieldValue = useWatch({ name: fieldName })

  const debouncedAddress = useDebounce(fieldValue, 500)

  const validateAddressSync = (value: string) => {
    if (!value) return

    const addressErr = validateAddress(value)
    if (addressErr) {
      return addressErr
    }

    const lowerAddress = value.toLowerCase()

    if (
      !allowDefaultOperatorAddress &&
      lowerAddress === DEFAULT_TIER_OPERATOR
    ) {
      return `Address can not be the default tier operator address`
    }

    if (!allowDuplicateAddresses) {
      const groupsInputs: GroupInput[] = getValues(groupFieldName)

      const addressInGroupInputIndex = groupsInputs.findIndex(
        ({ nodeOperator }, index) =>
          nodeOperator.toLowerCase() === lowerAddress && fieldIndex !== index,
      )

      if (addressInGroupInputIndex !== -1) {
        return 'Address is already in use by another group within the motion'
      }
    }
  }

  useEffect(() => {
    if (!debouncedAddress) {
      clearErrors(fieldName)
      return
    }

    const addressErr = validateAddressSync(debouncedAddress)
    if (addressErr) {
      setError(fieldName, { type: 'validate', message: addressErr })
      return
    }

    let isCurrent = true // Guard against race conditions

    const fetchAndValidate = async () => {
      const lowerAddress = debouncedAddress.toLowerCase()

      const groupData = await getGroupData(lowerAddress)

      // Check if this effect is still the latest one before setting state
      if (!isCurrent) return

      if (!groupData) {
        setError(fieldName, {
          type: 'validate',
          message: 'Node operator is not registered in Operator Grid',
        })
        return
      }

      const extraValidationResult = extraValidateFn?.(groupData)
      if (typeof extraValidationResult === 'string') {
        setError(fieldName, {
          type: 'validate',
          message: extraValidationResult,
        })
        return
      }

      // Success handling
      onValidOperatorAddressInput?.(groupData as Group)
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

  // 5. Render the InputControl
  return (
    <InputControl
      name={fieldName}
      label="Node operator address"
      rules={{ required: 'Field is required' }}
    />
  )
}
