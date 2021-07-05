import { Chains } from 'modules/blockChain/chains'
import { createContractConnector } from './utils/createContractConnector'
import { getTokenAddresses, TOKENS } from '../tokens/tokens'
import {
  EasyTrackAbi,
  EasyTrackAbi__factory,
  NodeOperatorsAbi__factory,
  // Erc20Abi__factory,
  MiniMeTokenAbi__factory,
} from 'generated'

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
    [Chains.Rinkeby]: '0x4e442D49a4B335E0E3B6Cdad2E77A9AaA6823330',
    // [Chains.Goerli]: '0x65f7365B20A254d247BEB8197Ee25aCB49e8B48c', // EasyTrackMock
  },
})

// export const connectSTETH = createContractConnector({
//   factory: Erc20Abi__factory,
//   address: getTokenAddresses(TOKENS.steth),
// })

// export const connectWETH = createContractConnector({
//   factory: Erc20Abi__factory,
//   address: getTokenAddresses(TOKENS.weth),
// })

export const connectLDO = createContractConnector({
  factory: MiniMeTokenAbi__factory,
  address: getTokenAddresses(TOKENS.ldo),
})
