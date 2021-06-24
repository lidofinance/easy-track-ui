import type { ChainId } from 'modules/blockChain/chains'

export type EnvConfig = {
  defaultChain: string
  supportedChains: string
}

export type Config = {
  currentChain: ChainId
  supportedChainIds: number[]
}
