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

import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'
import { IncreaseLimitMotionType } from 'modules/motions/constants'
import { getNodeOperatorRegistryType } from 'modules/motions/utils/getNodeOperatorRegistryType'
import { validateUintValue } from 'modules/motions/utils/validateUintValue'

export const formParts = ({
  motionType,
}: {
  motionType: IncreaseLimitMotionType
}) =>
  createMotionFormPart({
    motionType,
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
    Component: function StartNewMotionNodeOperatorLimitIncrease({
      fieldNames,
      submitAction,
    }) {
      const { setValue } = useFormContext()
      const { walletAddress } = useWeb3()
      const registryType = getNodeOperatorRegistryType(motionType)
      const nodeOperators = useNodeOperatorsList(registryType)
      const keysInfo = useNodeOperatorKeysInfo(registryType)

      const currentNodeOperator = useMemo(() => {
        if (!walletAddress || !nodeOperators.data) {
          return null
        }
        return nodeOperators.data.find(
          o =>
            utils.getAddress(o.rewardAddress) ===
            utils.getAddress(walletAddress),
        )
      }, [nodeOperators.data, walletAddress])

      const isNodeOperatorConnected = !!currentNodeOperator

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
        if (currentNodeOperator) {
          setValue(fieldNames.nodeOperatorId, currentNodeOperator.id)
        }
      }, [fieldNames.nodeOperatorId, setValue, currentNodeOperator])

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
                <>
                  Node operator <b>{currentNodeOperator.name}</b> with id
                </>
              }
              rules={{ required: 'Field is required' }}
              readOnly
            />
          </Fieldset>

          <Fieldset>
            <InputNumberControl
              name={fieldNames.newLimit}
              label={
                <>
                  New limit (current limit is{' '}
                  {connectedKeysInfo.info.stakingLimit.toString()})
                </>
              }
              rules={{
                required: 'Field is required',
                validate: value => {
                  const uintError = validateUintValue(value)
                  if (uintError) {
                    return uintError
                  }
                  const valueNum = Number(value)

                  if (valueNum <= connectedKeysInfo.info.stakingLimit) {
                    return 'New limit value should be greater than current'
                  }
                  if (valueNum > connectedKeysInfo.info.totalSigningKeys) {
                    return 'New limit value should be less than or equal to total signing keys'
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
