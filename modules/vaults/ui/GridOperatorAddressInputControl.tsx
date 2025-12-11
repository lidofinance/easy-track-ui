import { validateAddress } from 'modules/motions/utils/validateAddress'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { useFormContext } from 'react-hook-form'
import { DEFAULT_TIER_OPERATOR } from '../constants'
import { Group } from '../types'

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

export const GridOperatorAddressInputControl = ({
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

  const validateNodeOperatorAddress = (value: string) => {
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

  const handleValueChange = async (e: any) => {
    const value = e.target.value
    if (!value) return
    const addressErr = validateNodeOperatorAddress(value)
    if (addressErr) {
      setError(fieldName, {
        type: 'validate',
        message: addressErr,
      })
      return
    }

    const lowerAddress = value.toLowerCase()
    // Fetch group data
    const groupData = await getGroupData(lowerAddress)

    if (!groupData) {
      setError(fieldName, {
        type: 'validate',
        message: 'Node operator is not registered in Operator Grid',
      })
      return
    }

    // Extra validation
    const extraValidationResult = extraValidateFn?.(groupData)
    if (typeof extraValidationResult === 'string') {
      setError(fieldName, {
        type: 'validate',
        message: extraValidationResult,
      })
      return
    }

    // Call callback with valid group data
    onValidOperatorAddressInput?.(groupData)
    clearErrors(fieldName)
  }

  return (
    <InputControl
      name={fieldName}
      label="Node operator address"
      rules={{ required: 'Field is required' }}
      onChange={e => {
        setTimeout(() => {
          handleValueChange(e)
        }, 500)
      }}
    />
  )
}
