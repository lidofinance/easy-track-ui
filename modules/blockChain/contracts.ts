import { createContractHelpers } from './utils/createContractHelpers'
import {
  EasyTrackAbi,
  RewardProgramRegistryAbi,
  ReferralPartnersRegistryAbi,
  EasyTrackAbi__factory,
  NodeOperatorsAbi__factory,
  MiniMeTokenAbi__factory,
  RewardProgramRegistryAbi__factory,
  ReferralPartnersRegistryAbi__factory,
  EvmIncreaseNodeOperatorStakingLimitAbi__factory,
  EvmTopUpLegoProgramAbi__factory,
  EvmAddRewardProgramAbi__factory,
  EvmRemoveRewardProgramAbi__factory,
  EvmTopUpRewardProgramsAbi__factory,
  EvmAddReferralPartnerAbi__factory,
  EvmRemoveReferralPartnerAbi__factory,
  EvmTopUpReferralPartnersAbi__factory,
  AllowedRecipientsRegistryAbi__factory,
  AllowedRecipientsRegistryAbi,
  AddAllowedRecipientAbi__factory,
  RemoveAllowedRecipientAbi__factory,
  TopUpAllowedRecipientsAbi__factory,
  RegistryWithLimitsAbi__factory,
  RegistryWithLimitsAbi,
  TopUpWithLimitsAbi__factory,
} from 'generated'
import { MotionType } from 'modules/motions/types'
import { EvmAddressesByType } from 'modules/motions/evmAddresses'
import * as CONTRACT_ADDRESSES from './contractAddresses'

export type ContractTypeEasyTrack = EasyTrackAbi
/**
 * @deprecated
 */
export type ContractTypeRewardProgramRegistry = RewardProgramRegistryAbi
export type ContractTypeReferralPartnersRegistry = ReferralPartnersRegistryAbi
export type ContractTypeAllowedRecipientRegistry = AllowedRecipientsRegistryAbi
export type ContractTypeRegistryWithLimits = RegistryWithLimitsAbi

export const ContractNodeOperatorsRegistry = createContractHelpers({
  factory: NodeOperatorsAbi__factory,
  address: CONTRACT_ADDRESSES.NodeOperatorsRegistry,
})

export const ContractEasyTrack = createContractHelpers({
  factory: EasyTrackAbi__factory,
  address: CONTRACT_ADDRESSES.EasyTrack,
})

/**
 * @deprecated
 */
export const ContractRewardProgramRegistry = createContractHelpers({
  factory: RewardProgramRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.RewardProgramRegistry,
})

export const ContractAllowedRecipientRegistry = createContractHelpers({
  factory: AllowedRecipientsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.AllowedRecipientRegistry,
})

export const ContractEvmAllowedRecipientAdd = createContractHelpers({
  factory: AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientAdd],
})

export const ContractEvmAllowedRecipientRemove = createContractHelpers({
  factory: RemoveAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientRemove],
})

export const ContractEvmAllowedRecipientTopUp = createContractHelpers({
  factory: TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientTopUp],
})

// DAI Referral
export const ContractAllowedRecipientReferralDaiRegistry =
  createContractHelpers({
    factory: AllowedRecipientsRegistryAbi__factory,
    address: CONTRACT_ADDRESSES.AllowedRecipientReferralDaiRegistry,
  })

export const ContractEvmAllowedRecipientAddReferralDai = createContractHelpers({
  factory: AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientAddReferralDai],
})

export const ContractEvmAllowedRecipientRemoveReferralDai =
  createContractHelpers({
    factory: RemoveAllowedRecipientAbi__factory,
    address: EvmAddressesByType[MotionType.AllowedRecipientRemoveReferralDai],
  })

export const ContractEvmAllowedRecipientTopUpReferralDai =
  createContractHelpers({
    factory: TopUpAllowedRecipientsAbi__factory,
    address: EvmAddressesByType[MotionType.AllowedRecipientTopUpReferralDai],
  })

// LDO TRP
export const ContractAllowedRecipientTrpLdoRegistry = createContractHelpers({
  factory: AllowedRecipientsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.AllowedRecipientTrpLdoRegistry,
})

export const ContractEvmAllowedRecipientTopUpTrpLdo = createContractHelpers({
  factory: TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientTopUpTrpLdo],
})

export const ContractLegoLDORegistry = createContractHelpers({
  factory: RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.LegoLDORegistry,
})

export const ContractEvmLegoLDOTopUp = createContractHelpers({
  factory: TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.LegoLDOTopUp],
})

export const ContractLegoDAIRegistry = createContractHelpers({
  factory: RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.LegoDAIRegistry,
})

export const ContractEvmLegoDAITopUp = createContractHelpers({
  factory: TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.LegoDAITopUp],
})

export const ContractRccDAIRegistry = createContractHelpers({
  factory: RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.RccDAIRegistry,
})

export const ContractEvmRccDAITopUp = createContractHelpers({
  factory: TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.RccDAITopUp],
})

export const ContractPmlDAIRegistry = createContractHelpers({
  factory: RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.PmlDAIRegistry,
})

export const ContractEvmPmlDAITopUp = createContractHelpers({
  factory: TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.PmlDAITopUp],
})

export const ContractAtcDAIRegistry = createContractHelpers({
  factory: RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.AtcDAIRegistry,
})

export const ContractEvmAtcDAITopUp = createContractHelpers({
  factory: TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.AtcDAITopUp],
})

export const ContractGasFunderETHRegistry = createContractHelpers({
  factory: RegistryWithLimitsAbi__factory,
  address: CONTRACT_ADDRESSES.gasFunderETHRegistry,
})

export const ContractEvmGasFunderETHTopUp = createContractHelpers({
  factory: TopUpWithLimitsAbi__factory,
  address: EvmAddressesByType[MotionType.GasFunderETHTopUp],
})

export const ContractGovernanceToken = createContractHelpers({
  factory: MiniMeTokenAbi__factory,
  address: CONTRACT_ADDRESSES.GovernanceToken,
})

export const ContractEvmNodeOperatorIncreaseLimit = createContractHelpers({
  factory: EvmIncreaseNodeOperatorStakingLimitAbi__factory,
  address: EvmAddressesByType[MotionType.NodeOperatorIncreaseLimit],
})

export const ContractEvmLEGOTopUp = createContractHelpers({
  factory: EvmTopUpLegoProgramAbi__factory,
  address: EvmAddressesByType[MotionType.LEGOTopUp],
})

/**
 * @deprecated
 */
export const ContractEvmRewardProgramAdd = createContractHelpers({
  factory: EvmAddRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramAdd],
})

/**
 * @deprecated
 */
export const ContractEvmRewardProgramRemove = createContractHelpers({
  factory: EvmRemoveRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramRemove],
})

/**
 * @deprecated
 */
export const ContractEvmRewardProgramTopUp = createContractHelpers({
  factory: EvmTopUpRewardProgramsAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramTopUp],
})

export const ContractEvmReferralPartnerAdd = createContractHelpers({
  factory: EvmAddReferralPartnerAbi__factory,
  address: EvmAddressesByType[MotionType.ReferralPartnerAdd],
})

export const ContractEvmReferralPartnerRemove = createContractHelpers({
  factory: EvmRemoveReferralPartnerAbi__factory,
  address: EvmAddressesByType[MotionType.ReferralPartnerRemove],
})

export const ContractEvmReferralPartnerTopUp = createContractHelpers({
  factory: EvmTopUpReferralPartnersAbi__factory,
  address: EvmAddressesByType[MotionType.ReferralPartnerTopUp],
})

export const ContractReferralPartnersRegistry = createContractHelpers({
  factory: ReferralPartnersRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.ReferralPartnersRegistry,
})

export const ContractStethRewardProgramRegistry = createContractHelpers({
  factory: AllowedRecipientsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.StethRewardProgramRegistry,
})

export const ContractStethRewardProgramAdd = createContractHelpers({
  factory: AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.StethRewardProgramAdd],
})

export const ContractStethRewardProgramRemove = createContractHelpers({
  factory: RemoveAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.StethRewardProgramRemove],
})

export const ContractStethRewardProgramTopUp = createContractHelpers({
  factory: TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.StethRewardProgramTopUp],
})

export const ContractStethGasSupplyRegistry = createContractHelpers({
  factory: AllowedRecipientsRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.StethGasSupplyRegistry,
})

export const ContractStethGasSupplyAdd = createContractHelpers({
  factory: AddAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.StethGasSupplyAdd],
})

export const ContractStethGasSupplyRemove = createContractHelpers({
  factory: RemoveAllowedRecipientAbi__factory,
  address: EvmAddressesByType[MotionType.StethGasSupplyRemove],
})

export const ContractStethGasSupplyTopUp = createContractHelpers({
  factory: TopUpAllowedRecipientsAbi__factory,
  address: EvmAddressesByType[MotionType.StethGasSupplyTopUp],
})
