import { constants, utils } from 'ethers'

import { InputControl } from 'modules/shared/ui/Controls/Input'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'
import { MotionType } from 'modules/motions/types'
import { ContractCSMSetVettedGateTree } from 'modules/blockChain/contracts'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { MotionInfoBox } from 'modules/shared/ui/Common/MotionInfoBox'
import { Text } from 'modules/shared/ui/Common/Text'
import { useCSMVettedGateInfo } from 'modules/motions/hooks/useCSMVettedGateInfo'
import { isValidCID } from 'modules/motions/utils'

// CSMSetVettedGateTree
export const formParts = createMotionFormPart({
  motionType: MotionType.CSMSetVettedGateTree,
  populateTx: async ({ evmScriptFactory, formData, contract }) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['bytes32', 'string'],
      [formData.treeRoot, formData.treeCid],
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
    treeRoot: '',
    treeCid: '',
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { walletAddress } = useWeb3()

    const trustedCaller = ContractCSMSetVettedGateTree.useSwrWeb3(
      'trustedCaller',
      [],
    )

    const { data: vettedTreeData, initialLoading: isVettedTreeDataLoading } =
      useCSMVettedGateInfo()

    if (trustedCaller.initialLoading || isVettedTreeDataLoading) {
      return <PageLoader />
    }

    if (!trustedCaller.data) {
      return <MessageBox>Trusted caller is not set</MessageBox>
    }
    if (trustedCaller.data !== walletAddress) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>
    }

    return (
      <>
        {vettedTreeData && (
          <MotionInfoBox>
            <Text size={14} weight={800}>
              Current Vetted Gate Info
            </Text>
            <Text size={12} weight={500}>
              Tree Root: <br />
              {vettedTreeData.treeRoot}
            </Text>
            <Text size={12} weight={500}>
              Tree cid: <br />
              {vettedTreeData.treeCid}
            </Text>
          </MotionInfoBox>
        )}
        <Fieldset>
          <InputControl
            name={fieldNames.treeRoot}
            label="Tree root"
            rules={{
              required: 'Field is required',
              validate: value => {
                if (value.trim() === '') {
                  return 'Tree root cannot be empty'
                }

                if (!utils.isHexString(value)) {
                  return 'Tree root must be a valid hex string'
                }

                if (value === constants.HashZero) {
                  return 'Tree root cannot be zero'
                }

                if (!vettedTreeData) {
                  return 'Vetted gate tree data is not available'
                }

                if (value === vettedTreeData.treeRoot) {
                  return 'Tree root is the same as current'
                }

                return true
              },
            }}
          />
        </Fieldset>
        <Fieldset>
          <InputControl
            name={fieldNames.treeCid}
            label="Tree сid"
            rules={{
              required: 'Field is required',
              validate: value => {
                const trimmed = value.trim()
                if (trimmed === '') {
                  return 'Tree cid cannot be empty'
                }

                if (!isValidCID(trimmed)) {
                  return 'Tree cid must be a valid IPFS CID (v0 or v1)'
                }

                if (!vettedTreeData) {
                  return 'Vetted gate tree data is not available'
                }

                // Check if treeCid hash is the same as current (equivalent to keccak256 comparison)
                const newTreeCidHash = utils.keccak256(
                  utils.toUtf8Bytes(trimmed),
                )
                const currentTreeCidHash = utils.keccak256(
                  utils.toUtf8Bytes(vettedTreeData.treeCid),
                )

                if (newTreeCidHash === currentTreeCidHash) {
                  return 'Tree cid is the same as current'
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
