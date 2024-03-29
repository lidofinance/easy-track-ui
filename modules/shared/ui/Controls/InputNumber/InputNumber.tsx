import { forwardRef, useCallback } from 'react'
import { Input } from '@lidofinance/lido-ui'
import { withFormController } from 'modules/shared/hocs/withFormController'

type Props = React.ComponentProps<typeof Input>

export const InputNumber = forwardRef<HTMLInputElement, Props>(
  ({ onChange, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // Prepend zero when user types just a dot symbol for "0."
        if (e.currentTarget.value === '.') {
          e.currentTarget.value = '0.'
          onChange?.(e)
          return
        }

        if (isNaN(Number(e.target.value))) {
          return
        }

        onChange?.(e)
      },
      [onChange],
    )
    return <Input {...props} ref={ref} onChange={handleChange} />
  },
)

InputNumber.displayName = 'InputNumber'

export const InputNumberControl = withFormController(InputNumber)
