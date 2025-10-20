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
} from '../../CreateMotionFormStyle'

import { ContractRegisterGroupsInOperatorGrid } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from '../createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'
import { useSWR } from 'modules/network/hooks/useSwr'
import { GridGroup } from './types'
import { EMPTY_GROUP } from './constants'
import { TiersSection } from './TiersSection'

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
        sortedGroups.map(group => group.nodeOperator),
        sortedGroups.map(group => group.shareLimit),
        sortedGroups.map(group =>
          group.tiers.map(tier => [
            Number(tier.shareLimit),
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

    const factoryContract = ContractRegisterGroupsInOperatorGrid.useRpc()

    const { data: factoryData, initialLoading: isFactoryDataLoading } = useSWR(
      `register-groups-factory-${chainId}`,
      async () => {
        const [maxShareLimit, trustedCaller, defaultTierOperator] =
          await Promise.all([
            factoryContract.maxShareLimit(),
            factoryContract.trustedCaller(),
            factoryContract.DEFAULT_TIER_OPERATOR(),
          ])
        return {
          maxShareLimit,
          trustedCaller,
          defaultTierOperator,
        }
      },
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
    )

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups })

    const { watch } = useFormContext()
    const groupsInput: GridGroup[] = watch(fieldNames.groups)

    const handleAddGroup = () => groupsFieldArray.append({ ...EMPTY_GROUP })

    if (isFactoryDataLoading) {
      return <PageLoader />
    }

    if (factoryData?.trustedCaller !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        {groupsFieldArray.fields.map((item, groupIndex) => (
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
                    validate: value => {
                      const addressErr = validateAddress(value)
                      if (addressErr) {
                        return addressErr
                      }

                      const valueAddress = utils.getAddress(value)

                      if (valueAddress === factoryData?.defaultTierOperator) {
                        return `Address can not be the default tier operator address`
                      }

                      const addressInGroupInputIndex = groupsInput.findIndex(
                        ({ nodeOperator }, index) =>
                          nodeOperator &&
                          utils.getAddress(nodeOperator) === valueAddress &&
                          groupIndex !== index,
                      )

                      if (addressInGroupInputIndex !== -1) {
                        return 'Address is already in use by another group within the motion'
                      }

                      return true
                    },
                  }}
                />
              </Fieldset>

              <Fieldset>
                <InputNumberControl
                  name={`${fieldNames.groups}.${groupIndex}.shareLimit`}
                  label="Share limit"
                  rules={{
                    required: 'Field is required',
                    validate: value => {
                      const uintError = validateUintValue(value)
                      if (uintError) {
                        return uintError
                      }

                      if (factoryData?.maxShareLimit.lt(value)) {
                        return `Value must be less than or equal to ${factoryData.maxShareLimit}`
                      }

                      return true
                    },
                  }}
                />
              </Fieldset>
              <TiersSection
                groupIndex={groupIndex}
                fieldNames={fieldNames}
                shareLimit={groupsInput[groupIndex].shareLimit}
              />
            </FieldsWrapper>
          </Fragment>
        ))}

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
