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
  AllowedRecipientsRegistryLDOAbi__factory,
  AllowedRecipientsRegistryLDOAbi,
  AddAllowedRecipientLDOAbi__factory,
  RemoveAllowedRecipientLDOAbi__factory,
  TopUpAllowedRecipientsLDOAbi__factory,
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
export type ContractTypeAllowedRecipientRegistry =
  AllowedRecipientsRegistryLDOAbi
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
  factory: AllowedRecipientsRegistryLDOAbi__factory,
  address: CONTRACT_ADDRESSES.AllowedRecipientRegistry,
})

export const ContractEvmAllowedRecipientAdd = createContractHelpers({
  factory: AddAllowedRecipientLDOAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientAdd],
})

export const ContractEvmAllowedRecipientRemove = createContractHelpers({
  factory: RemoveAllowedRecipientLDOAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientRemove],
})

export const ContractEvmAllowedRecipientTopUp = createContractHelpers({
  factory: TopUpAllowedRecipientsLDOAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientTopUp],
})

export const ContractAllowedRecipientDaiRegistry = createContractHelpers({
  factory: AllowedRecipientsRegistryLDOAbi__factory,
  address: CONTRACT_ADDRESSES.AllowedRecipientDaiRegistry,
})

export const ContractEvmAllowedRecipientAddDai = createContractHelpers({
  factory: AddAllowedRecipientLDOAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientAddDai],
})

export const ContractEvmAllowedRecipientRemoveDai = createContractHelpers({
  factory: RemoveAllowedRecipientLDOAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientRemoveDai],
})

export const ContractEvmAllowedRecipientTopUpDai = createContractHelpers({
  factory: TopUpAllowedRecipientsLDOAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientTopUpDai],
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
