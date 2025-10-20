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
} from '../../CreateMotionFormStyle'
import { EMPTY_TIER, MAX_FEE_BP, MAX_RESERVE_RATIO_BP } from './constants'

type TierSectionProps = {
  groupIndex: number
  fieldNames: Record<'groups', string>
  shareLimit: string
}

export const TiersSection = ({
  groupIndex,
  fieldNames,
  shareLimit,
}: TierSectionProps) => {
  const tiersFieldArray = useFieldArray({
    name: `${fieldNames.groups}.${groupIndex}.tiers`,
  })
  const { getValues } = useFormContext()

  const handleAddTier = () => tiersFieldArray.append({ ...EMPTY_TIER })

  const shareLimitBn = BigNumber.from(shareLimit || 0)

  return (
    <>
      <FieldsHeaderDesc style={{ marginTop: '16px', marginBottom: '8px' }}>
        Tiers
      </FieldsHeaderDesc>

      {tiersFieldArray.fields.map((tierItem, tierIndex) => (
        <FieldsWrapper key={tierItem.id} style={{ marginLeft: '16px' }}>
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
              name={`${fieldNames.groups}.${groupIndex}.tiers.${tierIndex}.shareLimit`}
              label="Tier share limit"
              rules={{
                required: 'Field is required',
                validate: value => {
                  const uintError = validateUintValue(value)
                  if (uintError) {
                    return uintError
                  }

                  if (shareLimitBn.lt(value)) {
                    return `Value must be less than or equal to ${shareLimitBn} (the group's share limit)`
                  }

                  return true
                },
              }}
            />
          </Fieldset>

          <Fieldset>
            <InputNumberControl
              name={`${fieldNames.groups}.${groupIndex}.tiers.${tierIndex}.reserveRatioBP`}
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

                  if (valueNum > 10000) {
                    return `Value must be less than or equal to ${MAX_RESERVE_RATIO_BP}`
                  }

                  return true
                },
              }}
            />
          </Fieldset>

          <Fieldset>
            <InputNumberControl
              name={`${fieldNames.groups}.${groupIndex}.tiers.${tierIndex}.forcedRebalanceThresholdBP`}
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
                    `${fieldNames.groups}.${groupIndex}.tiers.${tierIndex}.reserveRatioBP`,
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
              name={`${fieldNames.groups}.${groupIndex}.tiers.${tierIndex}.infraFeeBP`}
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
              name={`${fieldNames.groups}.${groupIndex}.tiers.${tierIndex}.liquidityFeeBP`}
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
              name={`${fieldNames.groups}.${groupIndex}.tiers.${tierIndex}.reservationFeeBP`}
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

      <Fieldset style={{ marginLeft: '16px' }}>
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
