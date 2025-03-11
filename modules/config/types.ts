import { CHAINS } from '@lido-sdk/constants'

export type EnvConfigRaw = {
  defaultChain: string
  supportedChains: string
}

export type EnvConfigParsed = {
  defaultChain: CHAINS
  supportedChainIds: CHAINS[]
}
