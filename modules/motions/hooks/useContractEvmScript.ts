import { getLimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { MotionType } from '../types'
import * as CONTRACTS from 'modules/blockChain/contracts'
import { EvmUnrecognized } from '../evmAddresses'
import { useConfig } from 'modules/config/hooks/useConfig'

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
  [MotionType.SandboxStablesTopUp]: CONTRACTS.ContractEvmSandboxStablesTopUp,
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
  [MotionType.SDVTTargetValidatorLimitsUpdateV1]:
    CONTRACTS.ContractSDVTTargetValidatorLimitsUpdateV1,
  [MotionType.EcosystemOpsStablesTopUp]:
    CONTRACTS.ContractEcosystemOpsStablesTopUp,
  [MotionType.EcosystemOpsStethTopUp]: CONTRACTS.ContractEcosystemOpsStethTopUp,
  [MotionType.LabsOpsStablesTopUp]: CONTRACTS.ContractLabsOpsStablesTopUp,
  [MotionType.LabsOpsStethTopUp]: CONTRACTS.ContractLabsOpsStethTopUp,
  [MotionType.MEVBoostRelaysAdd]: CONTRACTS.ContractMEVBoostRelaysAdd,
  [MotionType.MEVBoostRelaysEdit]: CONTRACTS.ContractMEVBoostRelaysEdit,
  [MotionType.MEVBoostRelaysRemove]: CONTRACTS.ContractMEVBoostRelaysRemove,
  [MotionType.CSMSetVettedGateTree]: CONTRACTS.ContractCSMSetVettedGateTree,
  [MotionType.CuratedExitRequestHashesSubmit]:
    CONTRACTS.ContractCuratedExitRequestHashesSubmit,
  [MotionType.SDVTExitRequestHashesSubmit]:
    CONTRACTS.ContractSDVTExitRequestHashesSubmit,
  [MotionType.RegisterGroupsInOperatorGrid]:
    CONTRACTS.ContractRegisterGroupsInOperatorGrid,
  [MotionType.RegisterTiersInOperatorGrid]:
    CONTRACTS.ContractRegisterTiersInOperatorGrid,
  [MotionType.UpdateGroupsShareLimit]: CONTRACTS.ContractUpdateGroupsShareLimit,
  [MotionType.AlterTiersInOperatorGrid]:
    CONTRACTS.ContractAlterTiersInOperatorGrid,
  [MotionType.SandboxStethTopUp]: CONTRACTS.ContractSandboxStethTopUp,
  [MotionType.SandboxStethAdd]: CONTRACTS.ContractSandboxStethAdd,
  [MotionType.SandboxStethRemove]: CONTRACTS.ContractSandboxStethRemove,
  [MotionType.SetJailStatusInOperatorGrid]:
    CONTRACTS.ContractSetJailStatusInOperatorGrid,
  [MotionType.UpdateVaultsFeesInOperatorGrid]:
    CONTRACTS.ContractUpdateVaultsFeesInOperatorGrid,
} as const

export function useContractEvmScript<T extends MotionType | EvmUnrecognized>(
  motionType: T,
) {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()

  const contract = useGlobalMemo(() => {
    if (motionType === EvmUnrecognized) return null
    const library = getLimitedJsonRpcBatchProvider(chainId, getRpcUrl(chainId))
    return EVM_CONTRACTS[motionType as MotionType].connect({ chainId, library })
  }, `evm-contract-${chainId}-${motionType}`)

  type Contract = T extends MotionType
    ? ReturnType<typeof EVM_CONTRACTS[T]['connect']>
    : null
  return contract as Contract
}
