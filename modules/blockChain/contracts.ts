import { Chains } from 'modules/blockChain/chains'
import { createContractConnector } from './utils/createContractConnector'
import { getTokenAddresses, TOKENS } from '../tokens/tokens'
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

export const connectNodeOperators = createContractConnector({
  factory: NodeOperatorsAbi__factory,
  address: {
    [Chains.Mainnet]: '0x55032650b14df07b85bf18a3a3ec8e0af2e028d5',
  },
})

export type ContractEasyTrack = EasyTrackAbi

export const connectEasyTrack = createContractConnector({
  factory: EasyTrackAbi__factory,
  address: {
    [Chains.Rinkeby]: '0x0006de2639a6fc48349aa0b116f499621168a112',
    // [Chains.Goerli]: '0x65f7365B20A254d247BEB8197Ee25aCB49e8B48c', // EasyTrackMock
  },
})

export const connectRewardProgramRegistry = createContractConnector({
  factory: RewardProgramRegistryAbi__factory,
  address: {
    [Chains.Rinkeby]: '0x07804B6667d649c819dfA94aF50c782c26f5Abc3',
  },
})

export const connectLDO = createContractConnector({
  factory: MiniMeTokenAbi__factory,
  address: getTokenAddresses(TOKENS.ldo),
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
