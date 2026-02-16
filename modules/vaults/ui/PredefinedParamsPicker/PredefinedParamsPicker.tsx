import { Button } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { ButtonsWrap, Wrap } from './PredefinedParamsPickerStyle'

type Option = { label: string }

type Props = {
  title: string
  options: Option[] | undefined
  onSelect: (option: Option) => void
}

export const PredefinedParamsPicker = ({ options, title, onSelect }: Props) => {
  if (!options?.length) {
    return null
  }

  return (
    <Wrap>
      <Text size={14}>{title}</Text>
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
