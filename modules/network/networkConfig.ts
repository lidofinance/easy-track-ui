import { Chains } from 'modules/blockChain/chains'

export const SUBGRAPH_URL = {
  [Chains.Mainnet]: 'https://api.thegraph.com/subgraphs/name/lidofinance/lido',
  [Chains.Ropsten]: '',
  [Chains.Rinkeby]:
    'https://easytrack-subgraph.testnet.lido.fi/subgraphs/name/bulbozaur/lido-easytrack-rinkeby',
  [Chains.Goerli]:
    'https://api.thegraph.com/subgraphs/name/lidofinance/lido-testnet',
  [Chains.Kovan]: '',
} as const
