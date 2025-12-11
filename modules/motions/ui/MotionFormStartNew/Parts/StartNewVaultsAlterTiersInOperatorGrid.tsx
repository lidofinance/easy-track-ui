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
import { DEFAULT_TIER_OPERATOR, EMPTY_TIER } from 'modules/vaults/constants'
import { TierParams } from 'modules/vaults/types'
import { useOperatorGridInfo } from 'modules/vaults/hooks/useOperatorGridInfo'
import { useOperatorGridTierMap } from 'modules/vaults/hooks/useOperatorGridTierMap'
import { useOperatorGridGroupMap } from 'modules/vaults/hooks/useOperatorGridGroupMap'
import { SelectControl } from 'modules/shared/ui/Controls/Select'
import { OperatorGridTierFieldsets } from 'modules/vaults/ui/OperatorGridTierFieldsets'
import { convertShareLimitToInputValue } from 'modules/vaults/utils/convertShareLimitToInputValue'
import { useSWR } from 'modules/network/hooks/useSwr'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { OperatorGridAddressInputControl } from 'modules/vaults/ui/OperatorGridAddressInputControl'

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
    const { walletAddress, chainId } = useWeb3()

    const factoryContract = ContractAlterTiersInOperatorGrid.useRpc()

    const { data: factoryData, initialLoading: isFactoryDataLoading } = useSWR(
      `alter-tiers-factory-${chainId}`,
      async () => {
        const [defaultTierMaxShareLimit, trustedCaller] = await Promise.all([
          factoryContract.defaultTierMaxShareLimit(),
          factoryContract.trustedCaller(),
        ])
        return {
          defaultTierMaxShareLimit,
          trustedCaller,
        }
      },
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
    )

    const { data: operatorGridInfo, initialLoading: isOperatorGridLoading } =
      useOperatorGridInfo()

    const { groupMap, getOperatorGridGroup } = useOperatorGridGroupMap()

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

    if (isFactoryDataLoading || isOperatorGridLoading) {
      return <PageLoader />
    }

    if (factoryData?.trustedCaller !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    if (!operatorGridInfo || !operatorGridInfo.tiersCount) {
      return <MessageBox>No tiers in the operator grid to alter</MessageBox>
    }

    return (
      <>
        <MotionInfoBox>
          Note: to alter default tier with global tierId 0, use default tier
          operator address address — {DEFAULT_TIER_OPERATOR}
        </MotionInfoBox>
        {tiersFieldArray.fields.map((item, tierIndex) => {
          const groupData =
            groupMap[tiersInput[tierIndex]?.nodeOperator.toLowerCase()]

          const groupShareLimit =
            groupData?.operator.toLowerCase() === DEFAULT_TIER_OPERATOR
              ? factoryData?.defaultTierMaxShareLimit
              : groupData?.shareLimit

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
                  <OperatorGridAddressInputControl
                    groupFieldName={fieldNames.tiers}
                    fieldIndex={tierIndex}
                    getGroupData={getOperatorGridGroup}
                    allowDuplicateAddresses
                    onValidOperatorAddressInput={() =>
                      resetField(`${fieldNames.tiers}.${tierIndex}.tierId`)
                    }
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
                            convertShareLimitToInputValue(tier.shareLimit),
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

                {groupShareLimit && (
                  <OperatorGridTierFieldsets
                    tierArrayFieldName={fieldNames.tiers}
                    fieldIndex={tierIndex}
                    maxShareLimit={groupShareLimit}
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
