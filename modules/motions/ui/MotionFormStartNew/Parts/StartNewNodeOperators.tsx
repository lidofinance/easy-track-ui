import { utils } from 'ethers'
import { useMemo, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useNodeOperatorsList } from 'modules/motions/hooks/useNodeOperatorsList'
import { useNodeOperatorKeysInfo } from 'modules/motions/hooks/useNodeOperatorKeysInfo'

import { KeysInfoBlock } from 'modules/motions/ui/KeysInfoBlock'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { InputNumberControl } from 'modules/shared/ui/Controls/InputNumber'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'
import { NodeOperatorsRegistry } from 'modules/blockChain/contractAddresses'

export const formParts = createMotionFormPart({
  motionType: MotionType.NodeOperatorIncreaseLimit,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['uint256', 'uint256'],
      [Number(formData.nodeOperatorId), Number(formData.newLimit)],
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
    newLimit: '',
    nodeOperatorId: '',
  }),
  Component: function StartNewMotionNodeOperators({
    fieldNames,
    submitAction,
  }) {
    const { setValue } = useFormContext()
    const { walletAddress } = useWeb3()
    const nodeOperators = useNodeOperatorsList()
    const keysInfo = useNodeOperatorKeysInfo(NodeOperatorsRegistry)

    const [operatorId, currentNodeOperator] = useMemo(() => {
      if (!walletAddress) return [undefined, null]
      const idx = nodeOperators.data?.list.findIndex(
        o =>
          utils.getAddress(o.rewardAddress) === utils.getAddress(walletAddress),
      )
      const operator = idx !== undefined && nodeOperators.data?.list[idx]
      return [idx, operator]
    }, [walletAddress, nodeOperators])

    const isNodeOperatorConnected =
      !nodeOperators.data?.isRegistrySupported || Boolean(currentNodeOperator)

    const connectedKeysInfo = useMemo(() => {
      if (!isNodeOperatorConnected || !keysInfo.data || !walletAddress)
        return null
      return keysInfo.data.operators?.find(
        o =>
          utils.getAddress(o.info.rewardAddress) ===
          utils.getAddress(walletAddress),
      )
    }, [isNodeOperatorConnected, keysInfo.data, walletAddress])

    useEffect(() => {
      setValue(fieldNames.nodeOperatorId, operatorId)
    }, [operatorId, fieldNames.nodeOperatorId, setValue])

    if (nodeOperators.initialLoading || keysInfo.initialLoading) {
      return <PageLoader />
    }

    if (!isNodeOperatorConnected) {
      return <MessageBox>You should be connected as node operator</MessageBox>
    }

    if (!connectedKeysInfo) {
      return <MessageBox>Error: No keys info found</MessageBox>
    }

    const isConnectedKeysValid =
      connectedKeysInfo.invalid.length === 0 &&
      connectedKeysInfo.duplicates.length === 0

    if (!isConnectedKeysValid) {
      return <KeysInfoBlock keys={connectedKeysInfo} />
    }

    return (
      <>
        <KeysInfoBlock keys={connectedKeysInfo} />

        <Fieldset>
          <InputControl
            name={fieldNames.nodeOperatorId}
            label={
              currentNodeOperator ? (
                <>
                  Node operator <b>{currentNodeOperator.name}</b> with id
                </>
              ) : (
                `Node operator id is loading`
              )
            }
            rules={{ required: 'Field is required' }}
            readOnly
          />
        </Fieldset>

        <Fieldset>
          <InputNumberControl
            name={fieldNames.newLimit}
            label={
              currentNodeOperator ? (
                <>
                  New limit (current limit is{' '}
                  {currentNodeOperator.stakingLimit.toString()})
                </>
              ) : (
                `New limit`
              )
            }
            rules={{
              required: 'Field is required',
              validate: value => {
                if (value === '') return true
                const parsedValue = Number(value)
                if (Number.isNaN(parsedValue)) return 'Wrong number format'
                const limit = currentNodeOperator
                  ? currentNodeOperator.stakingLimit.toNumber()
                  : 0
                if (parsedValue <= limit) {
                  return 'New limit value should be greater than current'
                }
                if (parsedValue > connectedKeysInfo.info.totalSigningKeys) {
                  return 'New limit value should be less than total signing keys'
                }
                return true
              },
            }}
          />
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
