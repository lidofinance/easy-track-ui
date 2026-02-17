import { utils } from 'ethers'

import { Fragment } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
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
import {
  DEFAULT_TIER_OPERATOR,
  EMPTY_TIER,
  PREDEFINED_CONSTANT_TIER_PARAMS,
} from 'modules/vaults/constants'
import { TierParams } from 'modules/vaults/types'
import { useOperatorGridInfo } from 'modules/vaults/hooks/useOperatorGridInfo'
import { useOperatorGridGroupMap } from 'modules/vaults/hooks/useOperatorGridGroupMap'
import { useSWR } from 'modules/network/hooks/useSwr'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { OperatorGridAddressInputControl } from 'modules/vaults/ui/OperatorGridAddressInputControl'
import { OperatorGridEditTiersFieldsWrapper } from 'modules/vaults/ui/OperatorGridEditTiersFieldsWrapper'
import { PredefinedGroupParamsPicker } from 'modules/vaults/ui/PredefinedGroupParamsPicker'
import { useOperatorGridTierMap } from 'modules/vaults/hooks/useOperatorGridTierMap'

type TierInput = {
  nodeOperator: string
  tiers: ({
    tierId: string
  } & TierParams)[]
}

export const formParts = createMotionFormPart({
  motionType: MotionType.AlterTiersInOperatorGrid,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const flatTiers = formData.groups.map(({ tiers }) => tiers).flat()

    const encodedCallData = new utils.AbiCoder().encode(
      ['uint256[]', 'tuple(uint256,uint256,uint256,uint256,uint256,uint256)[]'],
      [
        flatTiers.map(tier => Number(tier.tierId)),
        flatTiers.map(tier => {
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
    groups: [{ nodeOperator: '', tiers: [{ ...EMPTY_TIER }] }] as TierInput[],
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

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups })
    const { watch, resetField, setValue } = useFormContext()
    const groupsInput: TierInput[] = watch(fieldNames.groups)

    const handleAddTier = () =>
      groupsFieldArray.append({
        nodeOperator: '',
        tiers: [{ ...EMPTY_TIER }],
      } as TierInput)

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
        {groupsFieldArray.fields.map((item, groupIndex) => {
          const groupData =
            groupMap[groupsInput[groupIndex]?.nodeOperator.toLowerCase()]

          const groupShareLimit =
            groupData?.operator.toLowerCase() === DEFAULT_TIER_OPERATOR
              ? factoryData?.defaultTierMaxShareLimit
              : groupData?.shareLimit

          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {groupsFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      Update #{groupIndex + 1}
                    </FieldsHeaderDesc>
                  )}
                  {groupsFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => groupsFieldArray.remove(groupIndex)}
                    >
                      Remove update {groupIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <OperatorGridAddressInputControl
                    groupFieldName={fieldNames.groups}
                    fieldIndex={groupIndex}
                    getGroupData={getOperatorGridGroup}
                    onChange={() =>
                      resetField(`${fieldNames.groups}.${groupIndex}.tiers`)
                    }
                  />
                </Fieldset>

                {!!groupData?.tierIds && (
                  <>
                    <PredefinedGroupParamsPicker
                      title={`Predefined tier setups (for up to 5 tiers)`}
                      upgradeMode
                      onSelect={groupOption => {
                        const tiersToUpdate = groupOption.tiers.slice(
                          0,
                          groupData.tierIds.length,
                        )
                        setValue(
                          `${fieldNames.groups}.${groupIndex}.tiers`,
                          tiersToUpdate.map((tier, index) => ({
                            tierId: groupData.tierIds[index].toNumber(),
                            shareLimit: tier.shareLimit.toString(),
                            reserveRatioBP: tier.reserveRatioBP.toString(),
                            forcedRebalanceThresholdBP:
                              tier.forcedRebalanceThresholdBP.toString(),
                            infraFeeBP:
                              PREDEFINED_CONSTANT_TIER_PARAMS.infraFeeBP.toString(),
                            liquidityFeeBP:
                              PREDEFINED_CONSTANT_TIER_PARAMS.liquidityFeeBP.toString(),
                            reservationFeeBP:
                              PREDEFINED_CONSTANT_TIER_PARAMS.reservationFeeBP.toString(),
                          })),
                          { shouldValidate: true, shouldDirty: true },
                        )
                      }}
                    />
                    <OperatorGridEditTiersFieldsWrapper
                      tierArrayFieldName={`${fieldNames.groups}.${groupIndex}.tiers`}
                      maxShareLimit={groupShareLimit}
                      currentTierIds={groupData.tierIds}
                      getOperatorGridTier={getOperatorGridTier}
                    />
                  </>
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
