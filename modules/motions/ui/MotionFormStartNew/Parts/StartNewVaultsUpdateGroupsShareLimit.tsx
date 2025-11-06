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

import { ContractUpdateGroupsShareLimit } from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { validateAddress } from 'modules/motions/utils/validateAddress'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { useSWR } from 'modules/network/hooks/useSwr'
import { GridGroup } from 'modules/vaults/types'
import { useOperatorGridGroupMap } from 'modules/vaults/hooks/useOperatorGridGroupMap'
import { parseEther } from 'ethers/lib/utils'
import { formatVaultParam } from 'modules/vaults/utils/formatVaultParam'
import { validateEtherValue } from 'modules/motions/utils/validateEtherValue'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { Text } from 'modules/shared/ui/Common/Text'

type GroupInput = Omit<GridGroup, 'tiers'>

export const formParts = createMotionFormPart({
  motionType: MotionType.UpdateGroupsShareLimit,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'uint256[]'],
      [
        formData.groups.map(group => utils.getAddress(group.nodeOperator)),
        formData.groups.map(group => utils.parseEther(group.shareLimit)),
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
    groups: [{ nodeOperator: '', shareLimit: '' }] as GroupInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress, chainId } = useWeb3()
    const { groupMap, getOperatorGridGroup } = useOperatorGridGroupMap()

    const factoryContract = ContractUpdateGroupsShareLimit.useRpc()

    const { data: factoryData, initialLoading: isFactoryDataLoading } = useSWR(
      `update-groups-share-factory-${chainId}`,
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

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups })

    const { watch } = useFormContext()
    const groupsInput: GridGroup[] = watch(fieldNames.groups)

    const handleAddGroup = () =>
      groupsFieldArray.append({ nodeOperator: '', shareLimit: '' })

    if (isFactoryDataLoading) {
      return <PageLoader />
    }

    if (factoryData?.trustedCaller !== walletAddress) {
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

                {factoryData ? (
                  <MotionInfoBox>
                    <Text size={12}>
                      Max share limit:{' '}
                      {formatVaultParam(factoryData.maxShareLimit)} stETH
                    </Text>
                    {entityInMap && !entityInMap.shareLimit.isZero() ? (
                      <Text size={12}>
                        Current share limit:{' '}
                        {formatVaultParam(entityInMap.shareLimit)} stETH
                      </Text>
                    ) : null}
                  </MotionInfoBox>
                ) : null}

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
