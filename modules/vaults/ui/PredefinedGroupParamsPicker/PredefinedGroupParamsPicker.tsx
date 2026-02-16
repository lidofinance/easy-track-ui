import { Button } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { ButtonsWrap, Wrap } from './PredefinedGroupParamsPickerStyle'
import { PredefinedGroupSetup } from 'modules/vaults/types'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { PREDEFINED_GROUP_SETUPS_MAP } from 'modules/vaults/constants'

type Props = {
  onSelect: (option: PredefinedGroupSetup) => void
}

export const PredefinedGroupParamsPicker = ({ onSelect }: Props) => {
  const { chainId } = useWeb3()

  const options = PREDEFINED_GROUP_SETUPS_MAP[chainId]

  if (!options?.length) {
    return null
  }

  return (
    <Wrap>
      <Text size={14}>Predefined group setups</Text>
      <ButtonsWrap>
        {options.map((option, index) => (
          <Button
            variant="outlined"
            key={index}
            size="xs"
            type="button"
            onClick={() => onSelect(option)}
          >
            {option.label}
          </Button>
        ))}
      </ButtonsWrap>
    </Wrap>
  )
}
