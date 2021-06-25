import { Chains } from 'modules/blockChain/chains'
import { createContractConnector } from './utils/createContractConnector'
import { NodeOperatorsAbi__factory, EasyTrackMockAbi__factory } from 'generated'

export const connectNodeOperators = createContractConnector({
  factory: NodeOperatorsAbi__factory,
  address: {
    [Chains.Mainnet]: '0x55032650b14df07b85bf18a3a3ec8e0af2e028d5',
  },
})

export const connectEasyTrackMock = createContractConnector({
  factory: EasyTrackMockAbi__factory,
  address: {
    [Chains.Goerli]: '0x65f7365B20A254d247BEB8197Ee25aCB49e8B48c',
  },
})
