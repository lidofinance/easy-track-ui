import { utils } from 'ethers'
import { useMemo } from 'react'
import { useWalletInfo } from 'modules/wallet/hooks/useWalletInfo'
import { useNodeOperatorsList } from 'modules/motions/hooks/useNodeOperatorsList'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'

export const formParts = createMotionFormPart({
  motionType: MotionType.NodeOperatorIncreaseLimit,
  onSubmit: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['uint256', 'uint256'],
      [Number(formData.nodeOperatorId), Number(formData.newLimit)],
    )
    const res = await contract.createMotion(evmScriptFactory, encodedCallData, {
      gasLimit: 500000,
    })
    return res
  },
  getDefaultFormData: () => ({
    newLimit: '',
    nodeOperatorId: '',
  }),
  Component: function StartNewMotionNodeOperators({
    fieldNames,
    submitAction,
  }) {
    const { walletAddress } = useWalletInfo()
    const nodeOperatorsList = useNodeOperatorsList()

    const isNodeOperatorConnected = useMemo(
      () =>
        Boolean(
          nodeOperatorsList.data?.find(o => o.rewardAddress === walletAddress),
        ),
      [walletAddress, nodeOperatorsList],
    )

    if (nodeOperatorsList.initialLoading) {
      return <PageLoader />
    }

    if (!isNodeOperatorConnected) {
      return <MessageBox>You should be connected as node operator</MessageBox>
    }

    return (
      <>
        <Fieldset>
          <InputControl
            name={fieldNames.nodeOperatorId}
            label="Node operator id"
          />
        </Fieldset>

        <Fieldset>
          <InputControl name={fieldNames.newLimit} label="New limit" />
        </Fieldset>

        {submitAction}
      </>
    )
  },
})
