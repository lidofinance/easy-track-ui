import { utils } from 'ethers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Fieldset, MessageBox } from '../CreateMotionFormStyle'

import {
  ContractStethGasSupplyRemove,
  ContractStethRewardProgramRemove,
  ContractRewardsShareProgramRemove,
  ContractEvmSandboxStablesRemove,
} from 'modules/blockChain/contracts'
import { MotionTypeForms } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { estimateGasFallback } from 'modules/motions/utils/estimateGasFallback'
import { useAllowedRecipients } from 'modules/motions/hooks'

export const ALLOWED_RECIPIENT_REMOVE_MAP = {
  [MotionTypeForms.StethRewardProgramRemove]: {
    evmContract: ContractStethRewardProgramRemove,
    motionType: MotionTypeForms.StethRewardProgramRemove,
  },
  [MotionTypeForms.StethGasSupplyRemove]: {
    evmContract: ContractStethGasSupplyRemove,
    motionType: MotionTypeForms.StethGasSupplyRemove,
  },
  [MotionTypeForms.RewardsShareProgramRemove]: {
    evmContract: ContractRewardsShareProgramRemove,
    motionType: MotionTypeForms.RewardsShareProgramRemove,
  },
  [MotionTypeForms.SandboxStablesRemove]: {
    evmContract: ContractEvmSandboxStablesRemove,
    motionType: MotionTypeForms.SandboxStablesRemove,
  },
}

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof ALLOWED_RECIPIENT_REMOVE_MAP
}) =>
  createMotionFormPart({
    motionType: ALLOWED_RECIPIENT_REMOVE_MAP[registryType].motionType,
    populateTx: async ({ evmScriptFactory, formData, contract }) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['address'],
        [utils.getAddress(formData.address)],
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
      address: '',
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
    }) {
      const allowedRecipients = useAllowedRecipients({ registryType })
      const { walletAddress } = useWeb3()
      const trustedCaller = ALLOWED_RECIPIENT_REMOVE_MAP[
        registryType
      ].evmContract.useSwrWeb3('trustedCaller', [])
      const isTrustedCallerConnected = trustedCaller.data === walletAddress

      if (trustedCaller.initialLoading || allowedRecipients.initialLoading) {
        return <PageLoader />
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        )
      }

      return (
        <>
          <Fieldset>
            <SelectControl
              label="Allowed recipient address"
              name={fieldNames.address}
              rules={{ required: 'Field is required' }}
            >
              {allowedRecipients.data?.map((program, i) => (
                <Option
                  key={i}
                  value={program.address}
                  children={`${program.title || program.address}`}
                />
              ))}
            </SelectControl>
          </Fieldset>

          {submitAction}
        </>
      )
    },
  })
