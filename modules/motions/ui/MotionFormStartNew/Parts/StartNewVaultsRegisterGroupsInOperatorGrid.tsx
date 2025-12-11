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

import { ContractRegisterGroupsInOperatorGrid } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { useSWR } from 'modules/network/hooks/useSwr'
import { EMPTY_GROUP } from 'modules/vaults/constants'
import { GridGroup } from 'modules/vaults/types'
import { OperatorGridAddTiersFieldsWrapper } from 'modules/vaults/ui/OperatorGridAddTiersFieldsWrapper'
import { useOperatorGridGroupMap } from 'modules/vaults/hooks/useOperatorGridGroupMap'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import { parseEther } from 'ethers/lib/utils'
import { validateEtherValue } from 'modules/motions/utils/validateEtherValue'
import { useOperatorGridInfo } from 'modules/vaults/hooks/useOperatorGridInfo'
import { GridOperatorAddressInputControl } from 'modules/vaults/ui/GridOperatorAddressInputControl'

export const formParts = createMotionFormPart({
  motionType: MotionType.RegisterGroupsInOperatorGrid,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const sortedGroups = formData.groups.sort((a, b) =>
      a.nodeOperator.toLowerCase().localeCompare(b.nodeOperator.toLowerCase()),
    )

    const encodedCallData = new utils.AbiCoder().encode(
      [
        'address[]',
        'uint256[]',
        'tuple(uint256,uint256,uint256,uint256,uint256,uint256)[][]',
      ],
      [
        sortedGroups.map(group => utils.getAddress(group.nodeOperator)),
        sortedGroups.map(group => utils.parseEther(group.shareLimit)),
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
    groups: [{ ...EMPTY_GROUP }] as GridGroup[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress, chainId } = useWeb3()
    const { getOperatorGridGroup } = useOperatorGridGroupMap()

    const factoryContract = ContractRegisterGroupsInOperatorGrid.useRpc()

    const { data: factoryData, initialLoading: isFactoryDataLoading } = useSWR(
      `register-groups-factory-${chainId}`,
      async () => {
        const [maxShareLimit, trustedCaller] = await Promise.all([
          factoryContract.maxShareLimit(),
          factoryContract.trustedCaller(),
        ])
        return {
          maxShareLimit,
          trustedCaller,
        }
      },
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
    )

    const {
      data: operatorGridInfo,
      initialLoading: isOperatorGridInfoLoading,
    } = useOperatorGridInfo()

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups })

    const { watch } = useFormContext()
    const groupsInput: GridGroup[] = watch(fieldNames.groups)

    const handleAddGroup = () => groupsFieldArray.append({ ...EMPTY_GROUP })

    if (isFactoryDataLoading || isOperatorGridInfoLoading) {
      return <PageLoader />
    }

    if (factoryData?.trustedCaller !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    const groupCount = operatorGridInfo?.nodeOperatorCount ?? 0

    return (
      <>
        {groupsFieldArray.fields.map((item, groupIndex) => {
          const groupNumber = groupCount + groupIndex + 1
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  <FieldsHeaderDesc>Group #{groupNumber}</FieldsHeaderDesc>
                  {groupsFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => groupsFieldArray.remove(groupIndex)}
                    >
                      Remove group {groupNumber}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <GridOperatorAddressInputControl
                    groupFieldName={fieldNames.groups}
                    fieldIndex={groupIndex}
                    getGroupData={getOperatorGridGroup}
                    allowDefaultOperatorAddress={false}
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberControl
                    name={`${fieldNames.groups}.${groupIndex}.shareLimit`}
                    label="Share limit"
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const amountError = validateEtherValue(value)
                        if (amountError) {
                          return amountError
                        }

                        if (factoryData?.maxShareLimit.lt(parseEther(value))) {
                          return `Value must be less than or equal to ${formatVaultParam(
                            factoryData.maxShareLimit,
                          )}`
                        }

                        return true
                      },
                    }}
                  />
                </Fieldset>
                <OperatorGridAddTiersFieldsWrapper
                  tierArrayFieldName={`${fieldNames.groups}.${groupIndex}.tiers`}
                  maxShareLimit={groupsInput[groupIndex].shareLimit}
                  groupTiersCount={0}
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
