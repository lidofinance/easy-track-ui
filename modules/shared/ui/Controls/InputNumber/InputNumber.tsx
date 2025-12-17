import { forwardRef, useCallback } from 'react'
import { Input } from '@lidofinance/lido-ui'
import { withFormController } from 'modules/shared/hocs/withFormController'

type Props = React.ComponentProps<typeof Input>

const NUM_REGEX = /^-?(\d+\.?\d*|\d*\.\d+|\.)$/

export const InputNumber = forwardRef<HTMLInputElement, Props>(
  ({ onChange, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value

        if (value === '') {
          onChange?.(e)
          return
        }

        if (value === '.') {
          e.currentTarget.value = '0.'
          onChange?.(e)
          return
        }

        if (value.includes('-')) {
          e.currentTarget.value = value.replaceAll('-', '')
        }

        // Validate the input matches numeric pattern
        if (!NUM_REGEX.test(value)) {
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
