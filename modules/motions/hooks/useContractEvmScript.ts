import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { getBackendRpcUrl } from 'modules/blockChain/utils/getBackendRpcUrl'
import { MotionType } from '../types'
import {
  ContractEvmNodeOperatorIncreaseLimit,
  ContractEvmLEGOTopUp,
  ContractEvmRewardProgramAdd,
  ContractEvmRewardProgramRemove,
  ContractEvmRewardProgramTopUp,
  ContractEvmReferralPartnerAdd,
  ContractEvmReferralPartnerRemove,
  ContractEvmReferralPartnerTopUp,
  ContractEvmAllowedRecipientAdd,
  ContractEvmAllowedRecipientRemove,
  ContractEvmAllowedRecipientTopUp,
  ContractEvmAllowedRecipientAddReferralDai,
  ContractEvmAllowedRecipientRemoveReferralDai,
  ContractEvmAllowedRecipientTopUpReferralDai,
  ContractEvmAllowedRecipientTopUpTrpLdo,
  ContractEvmLegoDAITopUp,
  ContractEvmLegoLDOTopUp,
  ContractEvmRccDAITopUp,
  ContractEvmPmlDAITopUp,
  ContractEvmAtcDAITopUp,
  ContractEvmGasFunderETHTopUp,
  ContractStethRewardProgramAdd,
  ContractStethRewardProgramRemove,
  ContractStethRewardProgramTopUp,
  ContractStethGasSupplyAdd,
  ContractStethGasSupplyRemove,
  ContractStethGasSupplyTopUp,
} from 'modules/blockChain/contracts'
import { EvmUnrecognized } from '../evmAddresses'

export const EVM_CONTRACTS = {
  [MotionType.NodeOperatorIncreaseLimit]: ContractEvmNodeOperatorIncreaseLimit,
  [MotionType.LEGOTopUp]: ContractEvmLEGOTopUp,
  [MotionType.RewardProgramAdd]: ContractEvmRewardProgramAdd,
  [MotionType.RewardProgramTopUp]: ContractEvmRewardProgramTopUp,
  [MotionType.RewardProgramRemove]: ContractEvmRewardProgramRemove,
  [MotionType.ReferralPartnerAdd]: ContractEvmReferralPartnerAdd,
  [MotionType.ReferralPartnerTopUp]: ContractEvmReferralPartnerTopUp,
  [MotionType.ReferralPartnerRemove]: ContractEvmReferralPartnerRemove,
  [MotionType.AllowedRecipientAdd]: ContractEvmAllowedRecipientAdd,
  [MotionType.AllowedRecipientRemove]: ContractEvmAllowedRecipientRemove,
  [MotionType.AllowedRecipientTopUp]: ContractEvmAllowedRecipientTopUp,
  [MotionType.AllowedRecipientAddReferralDai]:
    ContractEvmAllowedRecipientAddReferralDai,
  [MotionType.AllowedRecipientRemoveReferralDai]:
    ContractEvmAllowedRecipientRemoveReferralDai,
  [MotionType.AllowedRecipientTopUpReferralDai]:
    ContractEvmAllowedRecipientTopUpReferralDai,
  [MotionType.AllowedRecipientTopUpTrpLdo]:
    ContractEvmAllowedRecipientTopUpTrpLdo,
  [MotionType.LegoLDOTopUp]: ContractEvmLegoLDOTopUp,
  [MotionType.LegoDAITopUp]: ContractEvmLegoDAITopUp,
  [MotionType.RccDAITopUp]: ContractEvmRccDAITopUp,
  [MotionType.PmlDAITopUp]: ContractEvmPmlDAITopUp,
  [MotionType.AtcDAITopUp]: ContractEvmAtcDAITopUp,
  [MotionType.GasFunderETHTopUp]: ContractEvmGasFunderETHTopUp,
  [MotionType.StethRewardProgramAdd]: ContractStethRewardProgramAdd,
  [MotionType.StethRewardProgramRemove]: ContractStethRewardProgramRemove,
  [MotionType.StethRewardProgramTopUp]: ContractStethRewardProgramTopUp,
  [MotionType.StethGasSupplyAdd]: ContractStethGasSupplyAdd,
  [MotionType.StethGasSupplyRemove]: ContractStethGasSupplyRemove,
  [MotionType.StethGasSupplyTopUp]: ContractStethGasSupplyTopUp,
} as const

export function useContractEvmScript<T extends MotionType | EvmUnrecognized>(
  motionType: T,
) {
  const { chainId } = useWeb3()

  const contract = useGlobalMemo(() => {
    if (motionType === EvmUnrecognized) return null
    const library = getStaticRpcBatchProvider(
      chainId,
      getBackendRpcUrl(chainId),
    )
    return EVM_CONTRACTS[motionType as MotionType].connect({ chainId, library })
  }, `evm-contract-${chainId}-${motionType}`)

  type Contract = T extends MotionType
    ? ReturnType<typeof EVM_CONTRACTS[T]['connect']>
    : null
  return contract as Contract
}
