import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useFormContext } from 'react-hook-form'
import {
  PREDEFINED_CONSTANT_TIER_PARAMS,
  PREDEFINED_GROUP_SETUPS_MAP,
} from 'modules/vaults/constants'
import { PredefinedParamsPicker } from '../PredefinedParamsPicker'
import { PredefinedGroupSetup } from 'modules/vaults/types'

type Props = {
  groupsArrayFieldName: string
  groupIndex: number
  onUpdate: (index: number, value: unknown) => void
}

export const PredefinedGroupParamsPicker = ({
  groupsArrayFieldName,
  groupIndex,
  onUpdate,
}: Props) => {
  const { chainId } = useWeb3()
  const { getValues } = useFormContext()

  const handleOptionClick = (predefinedGroup: PredefinedGroupSetup) => {
    onUpdate(groupIndex, {
      nodeOperator: getValues(
        `${groupsArrayFieldName}.${groupIndex}.nodeOperator`,
      ),
      shareLimit: predefinedGroup.groupShareLimit.toString(),
      tiers: predefinedGroup.tiers.map(tier => ({
        shareLimit: tier.shareLimit.toString(),
        reserveRatioBP: tier.reserveRatioBP.toString(),
        forcedRebalanceThresholdBP: tier.forcedRebalanceThresholdBP.toString(),
        infraFeeBP: PREDEFINED_CONSTANT_TIER_PARAMS.infraFeeBP.toString(),
        liquidityFeeBP:
          PREDEFINED_CONSTANT_TIER_PARAMS.liquidityFeeBP.toString(),
        reservationFeeBP:
          PREDEFINED_CONSTANT_TIER_PARAMS.reservationFeeBP.toString(),
      })),
    })
  }

  return (
    <PredefinedParamsPicker
      title="Predefined group setups"
      options={PREDEFINED_GROUP_SETUPS_MAP[chainId]}
      onSelect={handleOptionClick}
    />
  )
}
