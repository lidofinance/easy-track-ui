import type { Chains } from 'modules/blockChain/chains'

export type EnvConfig = {
  defaultChain: string
  supportedChains: string
}

export type Config = {
  defaultChain: Chains
  supportedChainIds: Chains[]
}
