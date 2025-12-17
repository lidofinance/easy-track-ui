import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { Fieldset } from 'modules/motions/ui/MotionFormStartNew/CreateMotionFormStyle'
import { validateEtherValue } from 'modules/motions/utils/validateEtherValue'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { useFormContext } from 'react-hook-form'
import { MAX_FEE_BP, MAX_RESERVE_RATIO_BP } from '../constants'
import { formatVaultParam } from '../utils/formatVaultParam'
import { BpValueFormatted } from './BpValueFormatted'

type Props = {
  tierArrayFieldName: string
  fieldIndex: number
  maxShareLimit: BigNumber
}

export const OperatorGridTierFieldsets = ({
  tierArrayFieldName,
  fieldIndex,
  maxShareLimit,
}: Props) => {
  const { getValues } = useFormContext()

  return (
    <>
      <Fieldset>
        <InputNumberControl
          name={`${tierArrayFieldName}.${fieldIndex}.shareLimit`}
          label="Share limit"
          disabled={maxShareLimit.isZero()}
          rules={{
            required: 'Field is required',
            validate: value => {
              const amountError = validateEtherValue(value)
              if (amountError) {
                return amountError
              }

              const valueBn = parseEther(value)
              if (maxShareLimit.lt(valueBn)) {
                return `Value must be less than or equal to ${formatVaultParam(
                  maxShareLimit,
                )}`
              }

              return true
            },
          }}
        />
      </Fieldset>

      <Fieldset>
        <InputNumberControl
          name={`${tierArrayFieldName}.${fieldIndex}.reserveRatioBP`}
          label="Reserve ratio (BP)"
          rules={{
            required: 'Field is required',
            validate: value => {
              const uintError = validateUintValue(value)
              if (uintError) {
                return uintError
              }

              const valueNum = Number(value)
              if (valueNum === 0) {
                return 'Value must be greater than 0'
              }

              if (valueNum > MAX_RESERVE_RATIO_BP) {
                return `Value must be less than or equal to ${MAX_RESERVE_RATIO_BP}`
              }

              return true
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.reserveRatioBP`}
          label="Reserve ratio"
        />
      </Fieldset>

      <Fieldset>
        <InputNumberControl
          name={`${tierArrayFieldName}.${fieldIndex}.forcedRebalanceThresholdBP`}
          label="Forced rebalance threshold (BP)"
          rules={{
            required: 'Field is required',
            validate: value => {
              const uintError = validateUintValue(value)
              if (uintError) {
                return uintError
              }

              const valueNum = Number(value)
              if (valueNum === 0) {
                return 'Value must be greater than 0'
              }

              const reserveRatioBP = getValues(
                `${tierArrayFieldName}.${fieldIndex}.reserveRatioBP`,
              )

              if (!reserveRatioBP) {
                return 'Please set Reserve ratio BP first'
              }

              if (valueNum + 10 >= Number(reserveRatioBP)) {
                return `Value must be at least 10 BP less than Reserve ratio BP (${reserveRatioBP})`
              }

              return true
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.forcedRebalanceThresholdBP`}
          label="Forced rebalance threshold"
        />
      </Fieldset>

      <Fieldset>
        <InputNumberControl
          name={`${tierArrayFieldName}.${fieldIndex}.infraFeeBP`}
          label="Infra fee (BP)"
          rules={{
            required: 'Field is required',
            validate: value => {
              const uintError = validateUintValue(value)
              if (uintError) {
                return uintError
              }

              if (Number(value) > MAX_FEE_BP) {
                return `Value must be less than or equal to ${MAX_FEE_BP}`
              }

              return true
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.infraFeeBP`}
          label="Infra fee"
        />
      </Fieldset>

      <Fieldset>
        <InputNumberControl
          name={`${tierArrayFieldName}.${fieldIndex}.liquidityFeeBP`}
          label="Liquidity fee (BP)"
          rules={{
            required: 'Field is required',
            validate: value => {
              const uintError = validateUintValue(value)
              if (uintError) {
                return uintError
              }

              if (Number(value) > MAX_FEE_BP) {
                return `Value must be less than or equal to ${MAX_FEE_BP}`
              }

              return true
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.liquidityFeeBP`}
          label="Liquidity fee"
        />
      </Fieldset>

      <Fieldset>
        <InputNumberControl
          name={`${tierArrayFieldName}.${fieldIndex}.reservationFeeBP`}
          label="Reservation liquidity fee (BP)"
          rules={{
            required: 'Field is required',
            validate: value => {
              const uintError = validateUintValue(value)
              if (uintError) {
                return uintError
              }

              if (Number(value) > MAX_FEE_BP) {
                return `Value must be less than or equal to ${MAX_FEE_BP}`
              }

              return true
            },
          }}
        />
        <BpValueFormatted
          fieldName={`${tierArrayFieldName}.${fieldIndex}.reservationFeeBP`}
          label="Reservation liquidity fee"
        />
      </Fieldset>
    </>
  )
}
