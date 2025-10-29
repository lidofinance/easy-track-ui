import { utils } from 'ethers'

import { Fragment } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon, Option } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../CreateMotionFormStyle'

import { ContractAlterTiersInOperatorGrid } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { EMPTY_TIER } from 'modules/vaults/constants'
import { TierParams } from 'modules/vaults/types'
import { useOperatorGridInfo } from 'modules/vaults/hooks/useOperatorGridInfo'
import { useOperatorGridTierMap } from 'modules/vaults/hooks/useOperatorGridTierMap'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { useOperatorGridGroup } from 'modules/vaults/hooks/useOperatorGridGroup'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { OperatorGridTierFieldsets } from 'modules/vaults/ui/OperatorGridTierFieldsets'
import { formatShareLimit } from 'modules/vaults/utils/formatShareLimit'

type TierInput = {
  nodeOperator: string
  tierId: string
} & TierParams

export const formParts = createMotionFormPart({
  motionType: MotionType.AlterTiersInOperatorGrid,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['uint256[]', 'tuple(uint256,uint256,uint256,uint256,uint256,uint256)[]'],
      [
        formData.tiers.map(tier => Number(tier.tierId)),
        formData.tiers.map(tier => {
          return [
            utils.parseEther(tier.shareLimit),
            Number(tier.reserveRatioBP),
            Number(tier.forcedRebalanceThresholdBP),
            Number(tier.infraFeeBP),
            Number(tier.liquidityFeeBP),
            Number(tier.reservationFeeBP),
          ]
        }),
      ],
    )
    const gasLimit = await estimateGasFallback(
      contract.estimateGas.createMotion(evmScriptFactory, encodedCallData),
    )
    const tx = await contract.populateTransaction.createMotion(
      evmScriptFactory,
      encodedCallData,
      { gasLimit },
    )
    return tx
  },
  getDefaultFormData: () => ({
    tiers: [{ nodeOperator: '', tierId: '', ...EMPTY_TIER }] as TierInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const trustedCaller = ContractAlterTiersInOperatorGrid.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { data: operatorGridInfo, initialLoading: isOperatorGridLoading } =
      useOperatorGridInfo()

    const { groupMap, getOperatorGridGroup } = useOperatorGridGroup()

    const { getOperatorGridTier } = useOperatorGridTierMap(
      operatorGridInfo?.tiersCount,
    )

    const tiersFieldArray = useFieldArray({ name: fieldNames.tiers })
    const { watch, setValue, resetField } = useFormContext()
    const tiersInput: TierInput[] = watch(fieldNames.tiers)

    const handleAddTier = () =>
      tiersFieldArray.append({ nodeOperator: '', tierId: '', ...EMPTY_TIER })

    const setTierParam = (key: string, value: string) => {
      setValue(key, value, { shouldValidate: true, shouldDirty: true })
    }

    const getFilteredTierIdOptions = (fieldIdx: number) => {
      const tierIds =
        groupMap[tiersInput[fieldIdx]?.nodeOperator.toLowerCase()]?.tierIds
      if (!Array.isArray(tierIds)) {
        return []
      }
      const selectedIds = tiersInput.map(({ tierId }) => parseInt(tierId))
      const thisId = parseInt(tiersInput[fieldIdx]?.tierId)
      return tierIds.filter(tierId => {
        const tierIdNum = tierId.toNumber()
        return tierIdNum === thisId || !selectedIds.includes(tierIdNum)
      })
    }

    if (trustedCaller.initialLoading || isOperatorGridLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!operatorGridInfo || !operatorGridInfo.tiersCount) {
      return <MessageBox>No tiers in the operator grid to alter</MessageBox>
    }

    return (
      <>
        {tiersFieldArray.fields.map((item, tierIndex) => {
          const groupData =
            groupMap[tiersInput[tierIndex]?.nodeOperator.toLowerCase()]

          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {tiersFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>Update #{tierIndex + 1}</FieldsHeaderDesc>
                  )}
                  {tiersFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => tiersFieldArray.remove(tierIndex)}
                    >
                      Remove update {tierIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <InputControl
                    name={`${fieldNames.tiers}.${tierIndex}.nodeOperator`}
                    label="Node operator address"
                    onChange={() =>
                      resetField(`${fieldNames.tiers}.${tierIndex}.tierId`)
                    }
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        const addressErr = validateAddress(value)
                        if (addressErr) {
                          return addressErr
                        }

                        const lowerAddress = value.toLowerCase()

                        const group = await getOperatorGridGroup(lowerAddress)
                        if (!group) {
                          return `Node operator is not registered in Operator Grid`
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <SelectControl
                    label="Tier to alter"
                    name={`${fieldNames.tiers}.${tierIndex}.tierId`}
                    rules={{ required: 'Field is required' }}
                    disabled={!groupData}
                    onChange={value => {
                      getOperatorGridTier(value).then(tier => {
                        if (tier) {
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.shareLimit`,
                            formatShareLimit(tier.shareLimit),
                          )
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.reserveRatioBP`,
                            tier.reserveRatioBP.toString(),
                          )
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.forcedRebalanceThresholdBP`,
                            tier.forcedRebalanceThresholdBP.toString(),
                          )
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.infraFeeBP`,
                            tier.infraFeeBP.toString(),
                          )
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.liquidityFeeBP`,
                            tier.liquidityFeeBP.toString(),
                          )
                          setTierParam(
                            `${fieldNames.tiers}.${tierIndex}.reservationFeeBP`,
                            tier.reservationFeeBP.toString(),
                          )
                        }
                      })
                    }}
                  >
                    {getFilteredTierIdOptions(tierIndex).map((tierId, i) => (
                      <Option
                        key={i}
                        value={tierId.toNumber()}
                        children={`#${i + 1} (global tierId = ${tierId})`}
                      />
                    ))}
                  </SelectControl>
                </Fieldset>

                {groupData && (
                  <OperatorGridTierFieldsets
                    tierFieldName={`${fieldNames.tiers}.${tierIndex}`}
                    maxShareLimit={groupData.shareLimit}
                  />
                )}
              </FieldsWrapper>
            </Fragment>
          )
        })}

        <Fieldset>
          <ButtonIcon
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddTier}
            icon={<Plus />}
            color="secondary"
          >
            One more update
          </ButtonIcon>
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
