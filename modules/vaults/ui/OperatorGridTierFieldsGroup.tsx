import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
import { BigNumber } from 'ethers'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  Fieldset,
  FieldsHeader,
  FieldsHeaderDesc,
  FieldsWrapper,
  RemoveItemButton,
} from 'modules/motions/ui/MotionFormStartNew/CreateMotionFormStyle'
import { EMPTY_TIER, MAX_FEE_BP, MAX_RESERVE_RATIO_BP } from '../constants'
import { parseEther } from 'ethers/lib/utils'
import { formatVaultParam } from '../utils/formatVaultParam'
import { validateEtherValue } from 'modules/motions/utils/validateEtherValue'
import { useMemo } from 'react'

type Props = {
  tierArrayFieldName: string
  maxShareLimit: BigNumber | string | undefined
}

export const OperatorGridTierFieldsGroup = ({
  tierArrayFieldName,
  maxShareLimit,
}: Props) => {
  const tiersFieldArray = useFieldArray({
    name: tierArrayFieldName,
  })
  const { getValues } = useFormContext()

  const handleAddTier = () => tiersFieldArray.append({ ...EMPTY_TIER })

  const maxShareLimitBn = useMemo(() => {
    if (!maxShareLimit) {
      return BigNumber.from(0)
    }
    if (typeof maxShareLimit === 'string') {
      return parseEther(maxShareLimit)
    }
    return maxShareLimit
  }, [maxShareLimit])

  return (
    <>
      <FieldsHeaderDesc>Tiers</FieldsHeaderDesc>

      {tiersFieldArray.fields.map((tierItem, tierIndex) => (
        <FieldsWrapper key={tierItem.id}>
          <FieldsHeader>
            {tiersFieldArray.fields.length > 1 && (
              <FieldsHeaderDesc>Tier #{tierIndex + 1}</FieldsHeaderDesc>
            )}
            {tiersFieldArray.fields.length > 1 && (
              <RemoveItemButton
                onClick={() => tiersFieldArray.remove(tierIndex)}
              >
                Remove tier {tierIndex + 1}
              </RemoveItemButton>
            )}
          </FieldsHeader>

          <Fieldset>
            <InputNumberControl
              name={`${tierArrayFieldName}.${tierIndex}.shareLimit`}
              label="Tier share limit"
              disabled={maxShareLimitBn.isZero()}
              rules={{
                required: 'Field is required',
                validate: value => {
                  const uintError = validateUintValue(value)
                  if (uintError) {
                    return uintError
                  }

                  if (maxShareLimitBn.lt(parseEther(value))) {
                    return `Value must be less than or equal to ${formatVaultParam(
                      maxShareLimitBn,
                    )}`
                  }

                  return true
                },
              }}
            />
          </Fieldset>

          <Fieldset>
            <InputNumberControl
              name={`${tierArrayFieldName}.${tierIndex}.reserveRatioBP`}
              label="Reserve ratio (BP)"
              rules={{
                required: 'Field is required',
                validate: value => {
                  const amountError = validateEtherValue(value)
                  if (amountError) {
                    return amountError
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
          </Fieldset>

          <Fieldset>
            <InputNumberControl
              name={`${tierArrayFieldName}.${tierIndex}.forcedRebalanceThresholdBP`}
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
                    `${tierArrayFieldName}.${tierIndex}.reserveRatioBP`,
                  )

                  if (!reserveRatioBP) {
                    return 'Please set Reserve ratio BP first'
                  }

                  if (valueNum > Number(reserveRatioBP)) {
                    return `Value must be less than or equal to Reserve ratio BP (${reserveRatioBP})`
                  }

                  return true
                },
              }}
            />
          </Fieldset>

          <Fieldset>
            <InputNumberControl
              name={`${tierArrayFieldName}.${tierIndex}.infraFeeBP`}
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
          </Fieldset>

          <Fieldset>
            <InputNumberControl
              name={`${tierArrayFieldName}.${tierIndex}.liquidityFeeBP`}
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
          </Fieldset>

          <Fieldset>
            <InputNumberControl
              name={`${tierArrayFieldName}.${tierIndex}.reservationFeeBP`}
              label="Reservation fee (BP)"
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
          </Fieldset>
        </FieldsWrapper>
      ))}

      <Fieldset>
        <ButtonIcon
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAddTier}
          icon={<Plus />}
          color="secondary"
        >
          Add tier
        </ButtonIcon>
      </Fieldset>
    </>
  )
}
