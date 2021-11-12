export const Chains = {
  Mainnet: 1,
  Ropsten: 3,
  Rinkeby: 4,
  Goerli: 5,
  Kovan: 42,
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Chains = typeof Chains[keyof typeof Chains]

export const ChainNames = {
  [Chains.Mainnet]: 'Mainnet',
  [Chains.Ropsten]: 'Ropsten',
  [Chains.Rinkeby]: 'Rinkeby',
  [Chains.Goerli]: 'Goerli',
  [Chains.Kovan]: 'Kovan',
} as const

export const parseChainId = (chainId: number | string) => {
  const parsed = Number(chainId)
  if (!ChainNames.hasOwnProperty(chainId)) {
    throw new Error(`Chain ${chainId} is not supported`)
  }
  return parsed as Chains
}

export const getChainName = (chainId: number) =>
  ChainNames[parseChainId(chainId)]

export const ChainColors = {
  [Chains.Mainnet]: '#29b6af',
  [Chains.Ropsten]: '#ff4a8d',
  [Chains.Rinkeby]: '#f6c343',
  [Chains.Goerli]: '#3099f2',
  [Chains.Kovan]: '#9064ff',
} as const

export const getChainColor = (chainId: number) =>
  ChainColors[parseChainId(chainId)]
