import { CHAINS } from 'modules/blockChain/chains'

export type EnvConfigRaw = {
  defaultChain: string
  supportedChains: string
}

export type EnvConfigParsed = {
  defaultChain: CHAINS
  supportedChainIds: CHAINS[]
}
