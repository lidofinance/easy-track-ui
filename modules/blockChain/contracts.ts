import { createContractHelpers } from './utils/createContractHelpers'
import * as TypeChain from 'generated'
import { MotionType } from 'modules/motions/types'
import { EvmAddressesByType } from 'modules/motions/evmAddresses'
import * as CONTRACT_ADDRESSES from './contractAddresses'

export type ContractTypeEasyTrack = TypeChain.EasyTrackAbi
/**
 * @deprecated
 */
export type ContractTypeRewardProgramRegistry =
  TypeChain.RewardProgramRegistryAbi
export type ContractTypeReferralPartnersRegistry =
  TypeChain.ReferralPartnersRegistryAbi
export type ContractTypeAllowedRecipientRegistry =
  TypeChain.AllowedRecipientsRegistryAbi
export type ContractTypeRegistryWithLimits = TypeChain.RegistryWithLimitsAbi

export const ContractNodeOperatorsRegistry = createContractHelpers({
  factory: TypeChain.NodeOperatorsAbi__factory,
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

export const ContractLegoDAIRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.LegoDAIRegistry,
})

export const ContractEvmLegoDAITopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.LegoDAITopUp],
})

export const ContractRccDAIRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.RccDAIRegistry,
})

export const ContractEvmRccDAITopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.RccDAITopUp],
})

export const ContractPmlDAIRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.PmlDAIRegistry,
})

export const ContractEvmPmlDAITopUp = createContractHelpers({
  factory: TypeChain.TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.PmlDAITopUp],
})

export const ContractAtcDAIRegistry = createContractHelpers({
  factory: TypeChain.RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.AtcDAIRegistry,
})

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
  factory: TypeChain.SDVTRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.SDVTRegistry,
})

export const ContractSDVTNodeOperatorsAdd = createContractHelpers({
  factory: TypeChain.AddNodeOperatorAbi__factory,
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

// export const ContractSDVTVettedValidatorsLimitsSet = createContractHelpers({
//   factory: TypeChain.SetVettedValidatorsLimitsAbi__factory,
//   address: EvmAddressesByType[MotionType.SDVTVettedValidatorsLimitsSet],
// })

// export const ContractSDVTNodeOperatorNamesSet = createContractHelpers({
//   factory: TypeChain.SetNodeOperatorsNameAbi__factory,
//   address: EvmAddressesByType[MotionType.SDVTNodeOperatorNamesSet],
// })

export const ContractSDVTNodeOperatorRewardAddressesSet = createContractHelpers(
  {
    factory: TypeChain.SetNodeOperatorRewardAddressesAbi__factory,
    address: EvmAddressesByType[MotionType.SDVTNodeOperatorRewardAddressesSet],
  },
)

// export const ContractSDVTNodeOperatorManagerChange = createContractHelpers({
//   factory: TypeChain.TransferNodeOperatorManagerAbi__factory,
//   address: EvmAddressesByType[MotionType.SDVTNodeOperatorManager],
// })

// export const ContractSDVTTargetValidatorLimitsUpdate = createContractHelpers({
//   factory: TypeChain.UpdateTargetValidatorLimitsAbi__factory,
//   address: EvmAddressesByType[MotionType.SDVTTargetValidatorLimitsUpdate],
// })
