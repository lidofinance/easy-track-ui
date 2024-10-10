import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { getBackendRpcUrl } from 'modules/blockChain/utils/getBackendRpcUrl'
import { MotionType } from '../types'
import * as CONTRACTS from 'modules/blockChain/contracts'
import { EvmUnrecognized } from '../evmAddresses'

export const EVM_CONTRACTS = {
  [MotionType.NodeOperatorIncreaseLimit]:
    CONTRACTS.ContractEvmNodeOperatorIncreaseLimit,
  [MotionType.LEGOTopUp]: CONTRACTS.ContractEvmLEGOTopUp,
  [MotionType.RewardProgramAdd]: CONTRACTS.ContractEvmRewardProgramAdd,
  [MotionType.RewardProgramTopUp]: CONTRACTS.ContractEvmRewardProgramTopUp,
  [MotionType.RewardProgramRemove]: CONTRACTS.ContractEvmRewardProgramRemove,
  [MotionType.ReferralPartnerAdd]: CONTRACTS.ContractEvmReferralPartnerAdd,
  [MotionType.ReferralPartnerTopUp]: CONTRACTS.ContractEvmReferralPartnerTopUp,
  [MotionType.ReferralPartnerRemove]:
    CONTRACTS.ContractEvmReferralPartnerRemove,
  [MotionType.AllowedRecipientAdd]: CONTRACTS.ContractEvmAllowedRecipientAdd,
  [MotionType.AllowedRecipientRemove]:
    CONTRACTS.ContractEvmAllowedRecipientRemove,
  [MotionType.AllowedRecipientTopUp]:
    CONTRACTS.ContractEvmAllowedRecipientTopUp,
  [MotionType.AllowedRecipientAddReferralDai]:
    CONTRACTS.ContractEvmAllowedRecipientAddReferralDai,
  [MotionType.AllowedRecipientRemoveReferralDai]:
    CONTRACTS.ContractEvmAllowedRecipientRemoveReferralDai,
  [MotionType.AllowedRecipientTopUpReferralDai]:
    CONTRACTS.ContractEvmAllowedRecipientTopUpReferralDai,
  [MotionType.AllowedRecipientTopUpTrpLdo]:
    CONTRACTS.ContractEvmAllowedRecipientTopUpTrpLdo,
  [MotionType.LegoLDOTopUp]: CONTRACTS.ContractEvmLegoLDOTopUp,
  [MotionType.LegoDAITopUp]: CONTRACTS.ContractEvmLegoDAITopUp,
  [MotionType.RccDAITopUp]: CONTRACTS.ContractEvmRccDAITopUp,
  [MotionType.PmlDAITopUp]: CONTRACTS.ContractEvmPmlDAITopUp,
  [MotionType.AtcDAITopUp]: CONTRACTS.ContractEvmAtcDAITopUp,
  [MotionType.GasFunderETHTopUp]: CONTRACTS.ContractEvmGasFunderETHTopUp,
  [MotionType.StethRewardProgramAdd]: CONTRACTS.ContractStethRewardProgramAdd,
  [MotionType.StethRewardProgramRemove]:
    CONTRACTS.ContractStethRewardProgramRemove,
  [MotionType.StethRewardProgramTopUp]:
    CONTRACTS.ContractStethRewardProgramTopUp,
  [MotionType.StethGasSupplyAdd]: CONTRACTS.ContractStethGasSupplyAdd,
  [MotionType.StethGasSupplyRemove]: CONTRACTS.ContractStethGasSupplyRemove,
  [MotionType.StethGasSupplyTopUp]: CONTRACTS.ContractStethGasSupplyTopUp,
  [MotionType.RewardsShareProgramAdd]: CONTRACTS.ContractRewardsShareProgramAdd,
  [MotionType.RewardsShareProgramRemove]:
    CONTRACTS.ContractRewardsShareProgramRemove,
  [MotionType.RewardsShareProgramTopUp]:
    CONTRACTS.ContractRewardsShareProgramTopUp,
  [MotionType.SDVTNodeOperatorsAdd]: CONTRACTS.ContractSDVTNodeOperatorsAdd,
  [MotionType.SDVTNodeOperatorsActivate]:
    CONTRACTS.ContractSDVTNodeOperatorsActivate,
  [MotionType.SDVTNodeOperatorsDeactivate]:
    CONTRACTS.ContractSDVTNodeOperatorsDeactivate,
  [MotionType.SDVTVettedValidatorsLimitsSet]:
    CONTRACTS.ContractSDVTVettedValidatorsLimitsSet,
  [MotionType.SDVTTargetValidatorLimitsUpdate]:
    CONTRACTS.ContractSDVTTargetValidatorLimitsUpdate,
  [MotionType.SDVTTargetValidatorLimitsUpdateV2]:
    CONTRACTS.ContractSDVTTargetValidatorLimitsUpdateV2,
  [MotionType.SDVTNodeOperatorRewardAddressesSet]:
    CONTRACTS.ContractSDVTNodeOperatorRewardAddressesSet,
  [MotionType.SDVTNodeOperatorNamesSet]:
    CONTRACTS.ContractSDVTNodeOperatorNamesSet,
  [MotionType.SDVTNodeOperatorManagerChange]:
    CONTRACTS.ContractSDVTNodeOperatorManagerChange,
  [MotionType.SandboxNodeOperatorIncreaseLimit]:
    CONTRACTS.ContractEvmSandboxNodeOperatorIncreaseLimit,
  [MotionType.RccStablesTopUp]: CONTRACTS.ContractEvmRccStablesTopUp,
  [MotionType.PmlStablesTopUp]: CONTRACTS.ContractEvmPmlStablesTopUp,
  [MotionType.AtcStablesTopUp]: CONTRACTS.ContractEvmAtcStablesTopUp,
  [MotionType.SandboxStablesAdd]: CONTRACTS.ContractEvmSandboxStablesAdd,
  [MotionType.SandboxStablesTopUp]: CONTRACTS.ContractEvmSandboxStablesTopUp,
  [MotionType.SandboxStablesRemove]: CONTRACTS.ContractEvmSandboxStablesRemove,
  [MotionType.RccStethTopUp]: CONTRACTS.ContractRccStethTopUp,
  [MotionType.PmlStethTopUp]: CONTRACTS.ContractPmlStethTopUp,
  [MotionType.AtcStethTopUp]: CONTRACTS.ContractAtcStethTopUp,
  [MotionType.LegoStablesTopUp]: CONTRACTS.ContractLegoStablesTopUp,
  [MotionType.StonksStethTopUp]: CONTRACTS.ContractStonksStethTopUp,
  [MotionType.StonksStablesTopUp]: CONTRACTS.ContractStonksStablesTopUp,
  [MotionType.CSMSettleElStealingPenalty]:
    CONTRACTS.ContractCSMSettleElStealingPenalty,
  [MotionType.AllianceOpsStablesTopUp]:
    CONTRACTS.ContractEvmAllianceOpsStablesTopUp,
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
