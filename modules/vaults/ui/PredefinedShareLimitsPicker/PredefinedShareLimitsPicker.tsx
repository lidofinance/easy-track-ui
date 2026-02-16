import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useFormContext } from 'react-hook-form'
import { PREDEFINED_GROUP_SHARE_LIMITS_MAP } from 'modules/vaults/constants'
import { PredefinedParamsPicker } from '../PredefinedParamsPicker'
import { PredefinedGroupShareLimit } from 'modules/vaults/types'

type Props = {
  groupsArrayFieldName: string
  groupIndex: number
  onUpdate: (index: number, value: unknown) => void
}

export const PredefinedShareLimitsPicker = ({
  groupsArrayFieldName,
  groupIndex,
  onUpdate,
}: Props) => {
  const { chainId } = useWeb3()
  const { getValues } = useFormContext()

  const handleOptionClick = (predefinedGroup: PredefinedGroupShareLimit) => {
    onUpdate(groupIndex, {
      nodeOperator: getValues(
        `${groupsArrayFieldName}.${groupIndex}.nodeOperator`,
      ),
      shareLimit: predefinedGroup.groupShareLimit.toString(),
    })
  }

  return (
    <PredefinedParamsPicker
      title="Predefined limits"
      options={PREDEFINED_GROUP_SHARE_LIMITS_MAP[chainId]}
      onSelect={handleOptionClick}
    />
  )
}
