import { CHAINS } from '@lido-sdk/constants'

export const SUBGRAPH_URL = {
  [CHAINS.Mainnet]: 'https://api.thegraph.com/subgraphs/name/lidofinance/lido',
  [CHAINS.Ropsten]: '',
  [CHAINS.Rinkeby]:
    'https://easytrack-subgraph.testnet.lido.fi/subgraphs/name/bulbozaur/lido-easytrack-rinkeby',
  [CHAINS.Goerli]:
    'https://api.thegraph.com/subgraphs/name/lidofinance/lido-testnet',
  [CHAINS.Kovan]: '',
} as const
