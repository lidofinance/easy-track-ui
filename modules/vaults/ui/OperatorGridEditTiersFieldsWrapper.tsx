import { Plus, ButtonIcon, Option } from '@lidofinance/lido-ui'
import { BigNumber } from 'ethers'
import { useFieldArray, useWatch } from 'react-hook-form'
import {
  Fieldset,
  FieldsHeader,
  FieldsHeaderDesc,
  FieldsWrapper,
  RemoveItemButton,
} from 'modules/motions/ui/MotionFormStartNew/CreateMotionFormStyle'
import { EMPTY_TIER } from '../constants'
import { parseEther } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { OperatorGridTierFieldsets } from './OperatorGridTierFieldsets'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { Tier } from '../hooks/useOperatorGridTierMap'
import { TierParams } from '../types'
import { convertShareLimitToInputValue } from '../utils/convertShareLimitToInputValue'

type TierInput = {
  tierId: string
} & TierParams

type Props = {
  tierArrayFieldName: string
  maxShareLimit: BigNumber | string | undefined
  currentTierIds: BigNumber[]
  getOperatorGridTier: (tierId: string) => Promise<Tier | null>
}

export const OperatorGridEditTiersFieldsWrapper = ({
  tierArrayFieldName,
  maxShareLimit,
  currentTierIds,
  getOperatorGridTier,
}: Props) => {
  const tiersFieldArray = useFieldArray({
    name: tierArrayFieldName,
  })

  const selectedTiers: TierInput[] = useWatch({ name: tierArrayFieldName })

  const handleAddTier = () => tiersFieldArray.append({ ...EMPTY_TIER })

  const getFilteredTierIdOptions = (tierIndex: number) => {
    if (!Array.isArray(currentTierIds)) {
      return []
    }

    const allOptions = currentTierIds.map((tierId, index) => ({
      tierId: tierId.toNumber(),
      index,
    }))

    const selectedIds = selectedTiers.map(({ tierId }) => parseInt(tierId))
    const thisId = parseInt(selectedTiers[tierIndex]?.tierId)
    return allOptions.filter(({ tierId }) => {
      return tierId === thisId || !selectedIds.includes(tierId)
    })
  }

  const maxShareLimitBn = useMemo(() => {
    if (!maxShareLimit) {
      return BigNumber.from(0)
    }
    if (typeof maxShareLimit === 'string') {
      try {
        return parseEther(maxShareLimit)
      } catch (error) {
        return BigNumber.from(0)
      }
    }
    return maxShareLimit
  }, [maxShareLimit])

  return (
    <>
      <FieldsHeaderDesc>Tiers</FieldsHeaderDesc>

      {tiersFieldArray.fields.map((tierItem, tierIndex) => (
        <FieldsWrapper key={tierItem.id}>
          <FieldsHeader>
            <FieldsHeaderDesc>Update #{tierIndex + 1}</FieldsHeaderDesc>
            {tiersFieldArray.fields.length > 1 && (
              <RemoveItemButton
                onClick={() => tiersFieldArray.remove(tierIndex)}
              >
                Remove update
              </RemoveItemButton>
            )}
          </FieldsHeader>

          <Fieldset>
            <SelectControl
              label="Tier to alter"
              name={`${tierArrayFieldName}.${tierIndex}.tierId`}
              rules={{ required: 'Field is required' }}
              onChange={value => {
                getOperatorGridTier(value).then(tier => {
                  if (tier) {
                    tiersFieldArray.update(tierIndex, {
                      tierId: value,
                      shareLimit: convertShareLimitToInputValue(
                        tier.shareLimit,
                      ),
                      reserveRatioBP: tier.reserveRatioBP.toString(),
                      forcedRebalanceThresholdBP:
                        tier.forcedRebalanceThresholdBP.toString(),
                      infraFeeBP: tier.infraFeeBP.toString(),
                      liquidityFeeBP: tier.liquidityFeeBP.toString(),
                      reservationFeeBP: tier.reservationFeeBP.toString(),
                    })
                  }
                })
              }}
            >
              {getFilteredTierIdOptions(tierIndex).map(({ tierId, index }) => (
                <Option
                  key={tierId}
                  value={tierId}
                  children={`#${index + 1} (global tierId = ${tierId})`}
                />
              ))}
            </SelectControl>
          </Fieldset>

          <OperatorGridTierFieldsets
            tierArrayFieldName={tierArrayFieldName}
            fieldIndex={tierIndex}
            maxShareLimit={maxShareLimitBn}
          />
        </FieldsWrapper>
      ))}

      {tiersFieldArray.fields.length < currentTierIds.length && (
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
      )}
    </>
  )
}
