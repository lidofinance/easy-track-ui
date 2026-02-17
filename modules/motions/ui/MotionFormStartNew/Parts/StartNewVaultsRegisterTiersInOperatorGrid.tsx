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

import { ContractRegisterTiersInOperatorGrid } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { useOperatorGridGroupMap } from 'modules/vaults/hooks/useOperatorGridGroupMap'
import {
  EMPTY_TIER,
  PREDEFINED_CONSTANT_TIER_PARAMS,
} from 'modules/vaults/constants'
import { OperatorGridAddTiersFieldsWrapper } from 'modules/vaults/ui/OperatorGridAddTiersFieldsWrapper'
import { GridGroup } from 'modules/vaults/types'
import { OperatorGridAddressInputControl } from 'modules/vaults/ui/OperatorGridAddressInputControl'
import { PredefinedGroupParamsPicker } from 'modules/vaults/ui/PredefinedGroupParamsPicker'

type GroupInput = Omit<GridGroup, 'shareLimit'>

export const formParts = createMotionFormPart({
  motionType: MotionType.RegisterTiersInOperatorGrid,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      [
        'address[]',
        'tuple(uint256,uint256,uint256,uint256,uint256,uint256)[][]',
      ],
      [
        formData.groups.map(group => utils.getAddress(group.nodeOperator)),
        formData.groups.map(group =>
          group.tiers.map(tier => [
            utils.parseEther(tier.shareLimit),
            Number(tier.reserveRatioBP),
            Number(tier.forcedRebalanceThresholdBP),
            Number(tier.infraFeeBP),
            Number(tier.liquidityFeeBP),
            Number(tier.reservationFeeBP),
          ]),
        ),
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
    groups: [{ nodeOperator: '', tiers: [{ ...EMPTY_TIER }] }] as GroupInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const { groupMap, getOperatorGridGroup } = useOperatorGridGroupMap()

    const trustedCaller = ContractRegisterTiersInOperatorGrid.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups })
    const { watch, getValues } = useFormContext()
    const groupsInput: GroupInput[] = watch(fieldNames.groups)

    const handleAddGroup = () =>
      groupsFieldArray.append({ nodeOperator: '', tiers: [{ ...EMPTY_TIER }] })

    if (trustedCaller.initialLoading) {
      return <PageLoader />
    }

    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        {groupsFieldArray.fields.map((item, groupIndex) => {
          const entityInMap =
            groupMap[groupsInput[groupIndex].nodeOperator.toLowerCase()]
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {groupsFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>Group #{groupIndex + 1}</FieldsHeaderDesc>
                  )}
                  {groupsFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => groupsFieldArray.remove(groupIndex)}
                    >
                      Remove group {groupIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <OperatorGridAddressInputControl
                    groupFieldName={fieldNames.groups}
                    fieldIndex={groupIndex}
                    getGroupData={getOperatorGridGroup}
                    allowDefaultOperatorAddress={false}
                  />
                </Fieldset>

                <PredefinedGroupParamsPicker
                  onSelect={groupOption => {
                    // For phase III we need to add all tiers except first one, which was added in Phase I
                    const tiersToAdd = groupOption.tiers.slice(1)

                    groupsFieldArray.update(groupIndex, {
                      nodeOperator: getValues(
                        `${fieldNames.groups}.${groupIndex}.nodeOperator`,
                      ),
                      tiers: tiersToAdd.map(tier => ({
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
                    })
                  }}
                />

                <OperatorGridAddTiersFieldsWrapper
                  tierArrayFieldName={`${fieldNames.groups}.${groupIndex}.tiers`}
                  maxShareLimit={entityInMap?.shareLimit}
                  groupTiersCount={entityInMap?.tierIds.length}
                />
              </FieldsWrapper>
            </Fragment>
          )
        })}

        <Fieldset>
          <ButtonIcon
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddGroup}
            icon={<Plus />}
            color="secondary"
          >
            One more group
          </ButtonIcon>
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
