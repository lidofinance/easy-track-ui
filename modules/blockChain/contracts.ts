import { createContractHelpers } from './utils/createContractHelpers'
import {
  EasyTrackAbi,
  RewardProgramRegistryAbi,
  ReferralPartnersRegistryAbi,
  EasyTrackAbi__factory,
  NodeOperatorsAbi__factory,
  // Erc20Abi__factory,
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
} from 'generated'
import { MotionType } from 'modules/motions/types'
import { EvmAddressesByType } from 'modules/motions/evmAddresses'
import * as CONTRACT_ADDRESSES from './contractAddresses'

export type ContractTypeEasyTrack = EasyTrackAbi
export type ContractTypeRewardProgramRegistry = RewardProgramRegistryAbi
export type ContractTypeReferralPartnersRegistry = ReferralPartnersRegistryAbi

export const ContractNodeOperatorsRegistry = createContractHelpers({
  factory: NodeOperatorsAbi__factory,
  address: CONTRACT_ADDRESSES.NodeOperatorsRegistry,
})

export const ContractEasyTrack = createContractHelpers({
  factory: EasyTrackAbi__factory,
  address: CONTRACT_ADDRESSES.EasyTrack,
})

export const ContractRewardProgramRegistry = createContractHelpers({
  factory: RewardProgramRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.RewardProgramRegistry,
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

export const ContractEvmRewardProgramAdd = createContractHelpers({
  factory: EvmAddRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramAdd],
})

export const ContractEvmRewardProgramRemove = createContractHelpers({
  factory: EvmRemoveRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramRemove],
})

export const ContractEvmRewardProgramTopUp = createContractHelpers({
  factory: EvmTopUpRewardProgramsAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramTopUp],
})

export const ContractEvmReferralPartnerAdd = createContractHelpers({
  factory: EvmAddReferralPartnerAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramAdd],
})

export const ContractEvmReferralPartnerRemove = createContractHelpers({
  factory: EvmRemoveReferralPartnerAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramRemove],
})

export const ContractEvmReferralPartnerTopUp = createContractHelpers({
  factory: EvmTopUpReferralPartnersAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramTopUp],
})

export const ContractReferralPartnersRegistry = createContractHelpers({
  factory: ReferralPartnersRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.ReferralPartnersRegistry,
})
