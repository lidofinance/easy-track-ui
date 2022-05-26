import getConfig from 'next/config'
import { CHAINS } from '@lido-sdk/constants'

const { publicRuntimeConfig } = getConfig()
const {
  subgraphMainnet,
  subgraphRopsten,
  subgraphRinkeby,
  subgraphGoerli,
  subgraphKovan,
  subgraphKintsugi,
} = publicRuntimeConfig

export const SUBGRAPH_URL = {
  [CHAINS.Mainnet]: subgraphMainnet,
  [CHAINS.Ropsten]: subgraphRopsten,
  [CHAINS.Rinkeby]: subgraphRinkeby,
  [CHAINS.Goerli]: subgraphGoerli,
  [CHAINS.Kovan]: subgraphKovan,
  [CHAINS.Kintsugi]: subgraphKintsugi,
} as const
