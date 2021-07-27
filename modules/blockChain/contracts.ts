import { createContractConnector } from './utils/createContractConnector'
import {
  EasyTrackAbi,
  EasyTrackAbi__factory,
  NodeOperatorsAbi__factory,
  // Erc20Abi__factory,
  MiniMeTokenAbi__factory,
  RewardProgramRegistryAbi__factory,
  EvmIncreaseNodeOperatorStakingLimitAbi__factory,
  EvmTopUpLegoProgramAbi__factory,
  EvmAddRewardProgramAbi__factory,
  EvmRemoveRewardProgramAbi__factory,
  EvmTopUpRewardProgramsAbi__factory,
} from 'generated'
import { MotionType } from 'modules/motions/types'
import { EvmAddressesByType } from 'modules/motions/evmAddresses'
import {
  contractAddressesNodeOperatorsRegistry,
  contractAddressesEasyTrack,
  contractAddressesLDO,
  contractAddressesRewardProgramRegistry,
} from './contractAddresses'

export const connectNodeOperators = createContractConnector({
  factory: NodeOperatorsAbi__factory,
  address: contractAddressesNodeOperatorsRegistry,
})

export type ContractEasyTrack = EasyTrackAbi

export const connectEasyTrack = createContractConnector({
  factory: EasyTrackAbi__factory,
  address: contractAddressesEasyTrack,
})

export const connectRewardProgramRegistry = createContractConnector({
  factory: RewardProgramRegistryAbi__factory,
  address: contractAddressesRewardProgramRegistry,
})

export const connectLDO = createContractConnector({
  factory: MiniMeTokenAbi__factory,
  address: contractAddressesLDO,
})

export const connectEvmNodeOperatorIncreaseLimit = createContractConnector({
  factory: EvmIncreaseNodeOperatorStakingLimitAbi__factory,
  address: EvmAddressesByType[MotionType.NodeOperatorIncreaseLimit],
})

export const connectEvmLEGOTopUp = createContractConnector({
  factory: EvmTopUpLegoProgramAbi__factory,
  address: EvmAddressesByType[MotionType.LEGOTopUp],
})

export const connectEvmRewardProgramAdd = createContractConnector({
  factory: EvmAddRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramAdd],
})

export const connectEvmRewardProgramRemove = createContractConnector({
  factory: EvmRemoveRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramRemove],
})

export const connectEvmRewardProgramTopUp = createContractConnector({
  factory: EvmTopUpRewardProgramsAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramTopUp],
})
