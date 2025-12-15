import { Button } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { Text } from 'modules/shared/ui/Common/Text'
import { useFormContext } from 'react-hook-form'
import {
  PREDEFINED_CONSTANT_TIER_PARAMS,
  PREDEFINED_GROUP_SETUPS_MAP,
} from '../../constants'
import { ButtonsWrap, Wrap } from './PredefinedGroupParamsPickerStyle'

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

  const predefinedGroups = PREDEFINED_GROUP_SETUPS_MAP[chainId]

  if (!predefinedGroups?.length) {
    return null
  }

  const handleGroupClick = (index: number) => {
    const predefinedGroup = predefinedGroups[index]

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
    <Wrap>
      <Text size={14}>Predefined group setups</Text>
      <ButtonsWrap>
        {predefinedGroups.map((group, index) => (
          <Button
            variant="outlined"
            key={index}
            size="xs"
            type="button"
            onClick={() => handleGroupClick(index)}
          >
            {group.label}
          </Button>
        ))}
      </ButtonsWrap>
    </Wrap>
  )
}
