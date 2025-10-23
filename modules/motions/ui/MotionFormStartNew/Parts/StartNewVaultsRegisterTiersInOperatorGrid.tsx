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
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { useOperatorGridGroup } from 'modules/vaults/hooks/useOperatorGridGroup'
import { DEFAULT_TIER_OPERATOR, EMPTY_TIER } from 'modules/vaults/constants'
import { OperatorGridAddTiersFieldsWrapper } from 'modules/vaults/ui/OperatorGridAddTiersFieldsWrapper'
import { GridGroup } from 'modules/vaults/types'
import { useOperatorGridInfo } from 'modules/vaults/hooks/useOperatorGridInfo'

type GroupInput = Omit<GridGroup, 'shareLimit'>

export const formParts = createMotionFormPart({
  motionType: MotionType.RegisterTiersInOperatorGrid,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedGroups = formData.groups.sort((a, b) =>
      a.nodeOperator.toLowerCase().localeCompare(b.nodeOperator.toLowerCase()),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      [
        'address[]',
        'tuple(uint256,uint256,uint256,uint256,uint256,uint256)[][]',
      ],
      [
        sortedGroups.map(group => utils.getAddress(group.nodeOperator)),
        sortedGroups.map(group =>
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

    const { groupMap, getOperatorGridGroup } = useOperatorGridGroup()

    const trustedCaller = ContractRegisterTiersInOperatorGrid.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const {
      data: operatorGridInfo,
      initialLoading: isOperatorGridInfoLoading,
    } = useOperatorGridInfo()

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups })
    const { watch } = useFormContext()
    const groupsInput: GroupInput[] = watch(fieldNames.groups)

    const handleAddGroup = () =>
      groupsFieldArray.append({ nodeOperator: '', tier: { ...EMPTY_TIER } })

    if (trustedCaller.initialLoading || isOperatorGridInfoLoading) {
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
                  <InputControl
                    name={`${fieldNames.groups}.${groupIndex}.nodeOperator`}
                    label="Node operator address"
                    rules={{
                      required: 'Field is required',
                      validate: async value => {
                        const addressErr = validateAddress(value)
                        if (addressErr) {
                          return addressErr
                        }

                        const lowerAddress = value.toLowerCase()

                        if (lowerAddress === DEFAULT_TIER_OPERATOR) {
                          return `Address can not be the default tier operator address`
                        }

                        const addressInGroupInputIndex = groupsInput.findIndex(
                          ({ nodeOperator }, index) =>
                            nodeOperator.toLowerCase() === lowerAddress &&
                            groupIndex !== index,
                        )

                        if (addressInGroupInputIndex !== -1) {
                          return 'Address is already in use by another group within the motion'
                        }

                        const group = await getOperatorGridGroup(lowerAddress)
                        if (!group) {
                          return `Node operator is not registered in Operator Grid`
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>

                <OperatorGridAddTiersFieldsWrapper
                  tierArrayFieldName={`${fieldNames.groups}.${groupIndex}.tiers`}
                  maxShareLimit={entityInMap?.shareLimit}
                  groupTiersCount={entityInMap?.tierIds.length}
                  totalTiersCount={operatorGridInfo?.tiersCount}
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
