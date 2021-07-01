import { Chains } from 'modules/blockChain/chains'
import { createContractConnector } from './utils/createContractConnector'
import { getTokenAddresses, TOKENS } from '../tokens/tokens'
import {
  EasyTrackMockAbi,
  NodeOperatorsAbi__factory,
  EasyTrackMockAbi__factory,
  // Erc20Abi__factory,
  MiniMeTokenAbi__factory,
} from 'generated'

export const connectNodeOperators = createContractConnector({
  factory: NodeOperatorsAbi__factory,
  address: {
    [Chains.Mainnet]: '0x55032650b14df07b85bf18a3a3ec8e0af2e028d5',
  },
})

export type ContractEasyTrack = EasyTrackMockAbi

export const connectEasyTrack = createContractConnector({
  factory: EasyTrackMockAbi__factory,
  address: {
    [Chains.Goerli]: '0x65f7365B20A254d247BEB8197Ee25aCB49e8B48c',
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
