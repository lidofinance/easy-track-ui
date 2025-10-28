import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
import { BigNumber } from 'ethers'
import { useFieldArray } from 'react-hook-form'
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

type Props = {
  tierArrayFieldName: string
  maxShareLimit: BigNumber | string | undefined
  groupTiersCount: number | undefined
}

export const OperatorGridAddTiersFieldsWrapper = ({
  tierArrayFieldName,
  maxShareLimit,
  groupTiersCount,
}: Props) => {
  const tiersFieldArray = useFieldArray({
    name: tierArrayFieldName,
  })

  const handleAddTier = () => tiersFieldArray.append({ ...EMPTY_TIER })

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
            <FieldsHeaderDesc>
              Tier
              {groupTiersCount !== undefined && (
                <>
                  <br />
                  expected in-group index = {groupTiersCount + tierIndex}
                </>
              )}
            </FieldsHeaderDesc>
            {tiersFieldArray.fields.length > 1 && (
              <RemoveItemButton
                onClick={() => tiersFieldArray.remove(tierIndex)}
              >
                Remove tier
              </RemoveItemButton>
            )}
          </FieldsHeader>

          <OperatorGridTierFieldsets
            tierFieldName={`${tierArrayFieldName}.${tierIndex}`}
            maxShareLimit={maxShareLimitBn}
          />
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
