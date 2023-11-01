import { Option } from '@lidofinance/lido-ui'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { withFormController } from 'modules/shared/hocs/withFormController'

type SelectOption = {
  id: number
  name: string
}

const MAX_NAME_LENGTH = 45

const getOptionLabel = (option: SelectOption) =>
  `${option.name.slice(0, MAX_NAME_LENGTH)}${
    option.name.length > MAX_NAME_LENGTH ? '...' : ''
  } (id: ${option.id})`

type SelectControlProps = React.ComponentProps<
  ReturnType<typeof withFormController>
>

type Props = Omit<SelectControlProps, 'children' | 'label' | 'rules'> & {
  options: SelectOption[]
}

export function NodeOperatorSelectControl(props: Props) {
  const { options, ...selectControlProps } = props

  return (
    <SelectControl
      label="Node operator"
      rules={{ required: 'Field is required' }}
      {...selectControlProps}
    >
      {options.map(nodeOperator => (
        <Option
          key={nodeOperator.id}
          value={nodeOperator.id}
          children={getOptionLabel(nodeOperator)}
        />
      ))}
    </SelectControl>
  )
}
