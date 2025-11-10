import { createContractHelpers } from './utils/createContractHelpers'
import * as TypeChain from 'generated'
import { MotionType } from 'modules/motions/types'
import { EvmAddressesByType } from 'modules/motions/evmAddresses'
import * as CONTRACT_ADDRESSES from './contractAddresses'

export const ContractNodeOperatorsRegistry = createContractHelpers({
  factory: TypeChain.NodeOperatorsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.NodeOperatorsRegistry,
})

export const ContractEasyTrack = createContractHelpers({
  factory: TypeChain.EasyTrackAbi__factory,
  address: CONTRACT_ADDRESSES.EasyTrack,
})

export const ContractAragonAcl = createContractHelpers({
  factory: TypeChain.AragonACLAbi__factory,
  address: CONTRACT_ADDRESSES.AragonACL,
})

export const ContractEVMScriptExecutor = createContractHelpers({
  factory: TypeChain.EVMScriptExecutorAbi__factory,
  address: CONTRACT_ADDRESSES.EVMScriptExecutor,
})

export const ContractFinance = createContractHelpers({
  factory: TypeChain.FinanceAbi__factory,
  address: CONTRACT_ADDRESSES.Finance,
})

/**
 * @deprecated
 */
export const ContractRewardProgramRegistry = createContractHelpers({
  factory: TypeChain.RewardProgramRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.RewardProgramRegistry,
})

export const ContractAllowedRecipientRegistry = createContractHelpers({
  factory: TypeChain.AllowedRecipientsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.AllowedRecipientRegistry,
})

export const ContractEvmAllowedRecipientAdd = createContractHelpers({
  factory: TypeChain.AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientAdd],
})

export const ContractEvmAllowedRecipientRemove = createContractHelpers({
  factory: TypeChain.RemoveAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientRemove],
})

export const ContractEvmAllowedRecipientTopUp = createContractHelpers({
  factory: TypeChain.TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientTopUp],
})

// DAI Referral
export const ContractAllowedRecipientReferralDaiRegistry =
  createContractHelpers({
    factory: TypeChain.AllowedRecipientsRegistryAbi__factory,
    address: CONTRACT_ADDRESSES.AllowedRecipientReferralDaiRegistry,
  })

export const ContractEvmAllowedRecipientAddReferralDai = createContractHelpers({
  factory: TypeChain.AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientAddReferralDai],
})

export const ContractEvmAllowedRecipientRemoveReferralDai =
  createContractHelpers({
    factory: TypeChain.RemoveAllowedRecipientAbi__factory,
    address: EvmAddressesByType[MotionType.AllowedRecipientRemoveReferralDai],
  })

export const ContractEvmAllowedRecipientTopUpReferralDai =
  createContractHelpers({
    factory: TypeChain.TopUpAllowedRecipientsAbi__factory,
    address: EvmAddressesByType[MotionType.AllowedRecipientTopUpReferralDai],
  })

// LDO TRP
export const ContractAllowedRecipientTrpLdoRegistry = createContractHelpers({
  factory: TypeChain.AllowedRecipientsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.AllowedRecipientTrpLdoRegistry,
})

export const ContractEvmAllowedRecipientTopUpTrpLdo = createContractHelpers({
  factory: TypeChain.TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientTopUpTrpLdo],
})

export const ContractLegoLDORegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.LegoLDORegistry,
})

export const ContractEvmLegoLDOTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.LegoLDOTopUp],
})

export const ContractLegoStablesRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.LegoStablesRegistry,
})

/**
 * @deprecated
 */
export const ContractEvmLegoDAITopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.LegoDAITopUp],
})

/**
 * @deprecated
 */
export const ContractEvmRccDAITopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.RccDAITopUp],
})

/**
 * @deprecated
 */
export const ContractEvmPmlDAITopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.PmlDAITopUp],
})

/**
 * @deprecated
 */
export const ContractEvmAtcDAITopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.AtcDAITopUp],
})

export const ContractGasFunderETHRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.gasFunderETHRegistry,
})

export const ContractEvmGasFunderETHTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.GasFunderETHTopUp],
})

export const ContractGovernanceToken = createContractHelpers({
  factory: TypeChain.MiniMeTokenAbi__factory,
  address: CONTRACT_ADDRESSES.GovernanceToken,
})

export const ContractEvmNodeOperatorIncreaseLimit = createContractHelpers({
  factory: TypeChain.EvmIncreaseNodeOperatorStakingLimitAbi__factory,
  address: EvmAddressesByType[MotionType.NodeOperatorIncreaseLimit],
})

export const ContractEvmLEGOTopUp = createContractHelpers({
  factory: TypeChain.EvmTopUpLegoProgramAbi__factory,
  address: EvmAddressesByType[MotionType.LEGOTopUp],
})

/**
 * @deprecated
 */
export const ContractEvmRewardProgramAdd = createContractHelpers({
  factory: TypeChain.EvmAddRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramAdd],
})

/**
 * @deprecated
 */
export const ContractEvmRewardProgramRemove = createContractHelpers({
  factory: TypeChain.EvmRemoveRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramRemove],
})

/**
 * @deprecated
 */
export const ContractEvmRewardProgramTopUp = createContractHelpers({
  factory: TypeChain.EvmTopUpRewardProgramsAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramTopUp],
})

export const ContractEvmReferralPartnerAdd = createContractHelpers({
  factory: TypeChain.EvmAddReferralPartnerAbi__factory,
  address: EvmAddressesByType[MotionType.ReferralPartnerAdd],
})

export const ContractEvmReferralPartnerRemove = createContractHelpers({
  factory: TypeChain.EvmRemoveReferralPartnerAbi__factory,
  address: EvmAddressesByType[MotionType.ReferralPartnerRemove],
})

export const ContractEvmReferralPartnerTopUp = createContractHelpers({
  factory: TypeChain.EvmTopUpReferralPartnersAbi__factory,
  address: EvmAddressesByType[MotionType.ReferralPartnerTopUp],
})

export const ContractReferralPartnersRegistry = createContractHelpers({
  factory: TypeChain.ReferralPartnersRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.ReferralPartnersRegistry,
})

export const ContractStethRewardProgramRegistry = createContractHelpers({
  factory: TypeChain.AllowedRecipientsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.StethRewardProgramRegistry,
})

export const ContractStethRewardProgramAdd = createContractHelpers({
  factory: TypeChain.AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.StethRewardProgramAdd],
})

export const ContractStethRewardProgramRemove = createContractHelpers({
  factory: TypeChain.RemoveAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.StethRewardProgramRemove],
})

export const ContractStethRewardProgramTopUp = createContractHelpers({
  factory: TypeChain.TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.StethRewardProgramTopUp],
})

export const ContractStethGasSupplyRegistry = createContractHelpers({
  factory: TypeChain.AllowedRecipientsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.StethGasSupplyRegistry,
})

export const ContractStethGasSupplyAdd = createContractHelpers({
  factory: TypeChain.AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.StethGasSupplyAdd],
})

export const ContractStethGasSupplyRemove = createContractHelpers({
  factory: TypeChain.RemoveAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.StethGasSupplyRemove],
})

export const ContractStethGasSupplyTopUp = createContractHelpers({
  factory: TypeChain.TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.StethGasSupplyTopUp],
})

export const ContractRewardsShareProgramRegistry = createContractHelpers({
  factory: TypeChain.AllowedRecipientsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.RewardsShareProgramRegistry,
})

export const ContractRewardsShareProgramAdd = createContractHelpers({
  factory: TypeChain.AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.RewardsShareProgramAdd],
})

export const ContractRewardsShareProgramRemove = createContractHelpers({
  factory: TypeChain.RemoveAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.RewardsShareProgramRemove],
})

export const ContractRewardsShareProgramTopUp = createContractHelpers({
  factory: TypeChain.TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.RewardsShareProgramTopUp],
})

export const ContractSDVTRegistry = createContractHelpers({
  factory: TypeChain.NodeOperatorsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.SDVTRegistry,
})

export const ContractSDVTNodeOperatorsAdd = createContractHelpers({
  factory: TypeChain.AddNodeOperatorsAbi__factory,
  address: EvmAddressesByType[MotionType.SDVTNodeOperatorsAdd],
})

export const ContractSDVTNodeOperatorsActivate = createContractHelpers({
  factory: TypeChain.ActivateNodeOperatorsAbi__factory,
  address: EvmAddressesByType[MotionType.SDVTNodeOperatorsActivate],
})

export const ContractSDVTNodeOperatorsDeactivate = createContractHelpers({
  factory: TypeChain.DeactivateNodeOperatorsAbi__factory,
  address: EvmAddressesByType[MotionType.SDVTNodeOperatorsDeactivate],
})

export const ContractSDVTVettedValidatorsLimitsSet = createContractHelpers({
  factory: TypeChain.SetVettedValidatorsLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.SDVTVettedValidatorsLimitsSet],
})

export const ContractSDVTNodeOperatorNamesSet = createContractHelpers({
  factory: TypeChain.SetNodeOperatorNamesAbi__factory,
  address: EvmAddressesByType[MotionType.SDVTNodeOperatorNamesSet],
})

export const ContractSDVTNodeOperatorRewardAddressesSet = createContractHelpers(
  {
    factory: TypeChain.SetNodeOperatorRewardAddressesAbi__factory,
    address: EvmAddressesByType[MotionType.SDVTNodeOperatorRewardAddressesSet],
  },
)

export const ContractSDVTNodeOperatorManagerChange = createContractHelpers({
  factory: TypeChain.ChangeNodeOperatorManagersAbi__factory,
  address: EvmAddressesByType[MotionType.SDVTNodeOperatorManagerChange],
})

export const ContractSDVTTargetValidatorLimitsUpdateV2 = createContractHelpers({
  factory: TypeChain.UpdateTargetValidatorLimitsV2Abi__factory,
  address: EvmAddressesByType[MotionType.SDVTTargetValidatorLimitsUpdateV2],
})

export const ContractSandboxNodeOperatorsRegistry = createContractHelpers({
  factory: TypeChain.NodeOperatorsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.SandboxNodeOperatorsRegistry,
})

export const ContractEvmSandboxNodeOperatorIncreaseLimit =
  createContractHelpers({
    factory: TypeChain.EvmIncreaseNodeOperatorStakingLimitAbi__factory,
    address: EvmAddressesByType[MotionType.SandboxNodeOperatorIncreaseLimit],
  })

export const ContractAllowedTokensRegistry = createContractHelpers({
  factory: TypeChain.AllowedTokensRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.AllowedTokensRegistry,
})

export const ContractRccStablesRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.RccStablesRegistry,
})

export const ContractEvmRccStablesTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsStablesAbi__factory,
  address: EvmAddressesByType[MotionType.RccStablesTopUp],
})

export const ContractPmlStablesRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.PmlStablesRegistry,
})

export const ContractEvmPmlStablesTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsStablesAbi__factory,
  address: EvmAddressesByType[MotionType.PmlStablesTopUp],
})

export const ContractAtcStablesRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.AtcStablesRegistry,
})

export const ContractEvmAtcStablesTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsStablesAbi__factory,
  address: EvmAddressesByType[MotionType.AtcStablesTopUp],
})

export const ContractSandboxStablesAllowedRecipientRegistry =
  createContractHelpers({
    factory: TypeChain.RegistryWithLimitsAbi__factory,
    address: CONTRACT_ADDRESSES.SandboxStablesAllowedRecipientRegistry,
  })

export const ContractEvmSandboxStablesTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsStablesAbi__factory,
  address: EvmAddressesByType[MotionType.SandboxStablesTopUp],
})

export const ContractRccStethAllowedRecipientsRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.RccStethAllowedRecipientsRegistry,
})

export const ContractPmlStethAllowedRecipientsRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.PmlStethAllowedRecipientsRegistry,
})

export const ContractAtcStethAllowedRecipientsRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.AtcStethAllowedRecipientsRegistry,
})

export const ContractRccStethTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.RccStethTopUp],
})

export const ContractPmlStethTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.PmlStethTopUp],
})

export const ContractAtcStethTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.AtcStethTopUp],
})

export const ContractLegoStablesTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsStablesAbi__factory,
  address: EvmAddressesByType[MotionType.LegoStablesTopUp],
})

export const ContractStonksStethAllowedRecipientsRegistry =
  createContractHelpers({
    factory: TypeChain.RegistryWithLimitsAbi__factory,
    address: CONTRACT_ADDRESSES.StonksStethAllowedRecipientsRegistry,
  })

export const ContractStonksStablesAllowedRecipientsRegistry =
  createContractHelpers({
    factory: TypeChain.RegistryWithLimitsAbi__factory,
    address: CONTRACT_ADDRESSES.StonksStablesAllowedRecipientsRegistry,
  })

export const ContractStonksStethTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.StonksStethTopUp],
})

export const ContractStonksStablesTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsStablesAbi__factory,
  address: EvmAddressesByType[MotionType.StonksStablesTopUp],
})

export const ContractCSMSettleElStealingPenalty = createContractHelpers({
  factory: TypeChain.CSMSettleElStealingPenaltyAbi__factory,
  address: EvmAddressesByType[MotionType.CSMSettleElStealingPenalty],
})

export const ContractCSMRegistry = createContractHelpers({
  factory: TypeChain.CSMRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.CSMRegistry,
})

export const ContractAllianceOpsStablesAllowedRecipientsRegistry =
  createContractHelpers({
    factory: TypeChain.RegistryWithLimitsAbi__factory,
    address: CONTRACT_ADDRESSES.AllianceOpsAllowedRecipientsRegistry,
  })

export const ContractEvmAllianceOpsStablesTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsStablesAbi__factory,
  address: EvmAddressesByType[MotionType.AllianceOpsStablesTopUp],
})

/**
 * @deprecated
 */
export const ContractSDVTTargetValidatorLimitsUpdateV1 = createContractHelpers({
  factory: TypeChain.UpdateTargetValidatorLimitsV1Abi__factory,
  address: EvmAddressesByType[MotionType.SDVTTargetValidatorLimitsUpdateV1],
})

export const ContractEcosystemOpsStablesAllowedRecipientsRegistry =
  createContractHelpers({
    factory: TypeChain.RegistryWithLimitsAbi__factory,
    address: CONTRACT_ADDRESSES.EcosystemOpsStablesAllowedRecipientsRegistry,
  })

export const ContractEcosystemOpsStablesTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsStablesAbi__factory,
  address: EvmAddressesByType[MotionType.EcosystemOpsStablesTopUp],
})

export const ContractLabsOpsStablesAllowedRecipientsRegistry =
  createContractHelpers({
    factory: TypeChain.RegistryWithLimitsAbi__factory,
    address: CONTRACT_ADDRESSES.LabsOpsStablesAllowedRecipientsRegistry,
  })

export const ContractLabsOpsStablesTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsStablesAbi__factory,
  address: EvmAddressesByType[MotionType.LabsOpsStablesTopUp],
})

export const ContractEcosystemOpsStethAllowedRecipientsRegistry =
  createContractHelpers({
    factory: TypeChain.RegistryWithLimitsAbi__factory,
    address: CONTRACT_ADDRESSES.EcosystemOpsStethAllowedRecipientsRegistry,
  })

export const ContractEcosystemOpsStethTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.EcosystemOpsStethTopUp],
})

export const ContractLabsOpsStethAllowedRecipientsRegistry =
  createContractHelpers({
    factory: TypeChain.RegistryWithLimitsAbi__factory,
    address: CONTRACT_ADDRESSES.LabsOpsStethAllowedRecipientsRegistry,
  })

export const ContractLabsOpsStethTopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.LabsOpsStethTopUp],
})

export const ContractMEVBoostRelayList = createContractHelpers({
  factory: TypeChain.MEVBoostRelayListAbi__factory,
  address: CONTRACT_ADDRESSES.MEVBoostRelayList,
})

export const ContractMEVBoostRelaysAdd = createContractHelpers({
  factory: TypeChain.AddMEVBoostRelaysAbi__factory,
  address: EvmAddressesByType[MotionType.MEVBoostRelaysAdd],
})

export const ContractMEVBoostRelaysEdit = createContractHelpers({
  factory: TypeChain.EditMEVBoostRelaysAbi__factory,
  address: EvmAddressesByType[MotionType.MEVBoostRelaysEdit],
})

export const ContractMEVBoostRelaysRemove = createContractHelpers({
  factory: TypeChain.RemoveMEVBoostRelaysAbi__factory,
  address: EvmAddressesByType[MotionType.MEVBoostRelaysRemove],
})

export const ContractCSMSetVettedGateTree = createContractHelpers({
  factory: TypeChain.CSMSetVettedGateTreeAbi__factory,
  address: EvmAddressesByType[MotionType.CSMSetVettedGateTree],
})

export const ContractSDVTExitRequestHashesSubmit = createContractHelpers({
  factory: TypeChain.SubmitExitRequestHashesAbi__factory,
  address: EvmAddressesByType[MotionType.SDVTExitRequestHashesSubmit],
})

export const ContractCuratedExitRequestHashesSubmit = createContractHelpers({
  factory: TypeChain.SubmitExitRequestHashesAbi__factory,
  address: EvmAddressesByType[MotionType.CuratedExitRequestHashesSubmit],
})

export const ContractRegisterGroupsInOperatorGrid = createContractHelpers({
  factory: TypeChain.EvmRegisterGroupsInOperatorsGridAbi__factory,
  address: EvmAddressesByType[MotionType.RegisterGroupsInOperatorGrid],
})

export const ContractRegisterTiersInOperatorGrid = createContractHelpers({
  factory: TypeChain.EvmRegisterTiersInOperatorsGridAbi__factory,
  address: EvmAddressesByType[MotionType.RegisterTiersInOperatorGrid],
})

export const ContractOperatorGrid = createContractHelpers({
  factory: TypeChain.OperatorGridAbi__factory,
  address: CONTRACT_ADDRESSES.OperatorGrid,
})

export const ContractUpdateGroupsShareLimit = createContractHelpers({
  factory: TypeChain.EvmUpdateGroupsShareLimitAbi__factory,
  address: EvmAddressesByType[MotionType.UpdateGroupsShareLimit],
})

export const ContractAlterTiersInOperatorGrid = createContractHelpers({
  factory: TypeChain.EvmAlterTiersInOperatorGridAbi__factory,
  address: EvmAddressesByType[MotionType.AlterTiersInOperatorGrid],
})

export const ContractSteth = createContractHelpers({
  factory: TypeChain.StethAbi__factory,
  address: CONTRACT_ADDRESSES.STETH,
})

export const ContractSandboxStethTopUp = createContractHelpers({
  factory: TypeChain.TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.SandboxStethTopUp],
})

export const ContractSandboxStethAdd = createContractHelpers({
  factory: TypeChain.AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.SandboxStethAdd],
})

export const ContractSandboxStethRemove = createContractHelpers({
  factory: TypeChain.RemoveAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.SandboxStethRemove],
})

export const ContractSandboxStethAllowedRecipientsRegistry =
  createContractHelpers({
    factory: TypeChain.RegistryWithLimitsAbi__factory,
    address: CONTRACT_ADDRESSES.SandboxAllowedRecipientsRegistry,
  })

export const ContractSetJailStatusInOperatorGrid = createContractHelpers({
  factory: TypeChain.EvmSetJailStatusInOperatorGridAbi__factory,
  address: EvmAddressesByType[MotionType.SetJailStatusInOperatorGrid],
})

export const ContractVaultsAdapter = createContractHelpers({
  factory: TypeChain.VaultsAdapterAbi__factory,
  address: CONTRACT_ADDRESSES.VaultsAdapter,
})

export const ContractUpdateVaultsFeesInOperatorGrid = createContractHelpers({
  factory: TypeChain.EvmUpdateVaultsFeesInOperatorGridAbi__factory,
  address: EvmAddressesByType[MotionType.UpdateVaultsFeesInOperatorGrid],
})

export const ContractVaultHub = createContractHelpers({
  factory: TypeChain.VaultHubAbi__factory,
  address: CONTRACT_ADDRESSES.VaultHub,
})

export const ContractVaultViewer = createContractHelpers({
  factory: TypeChain.VaultViewerAbi__factory,
  address: CONTRACT_ADDRESSES.VaultViewer,
})
