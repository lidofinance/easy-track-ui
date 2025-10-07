export enum CHAINS {
  Mainnet = 1,
  Holesky = 17000,
  Hoodi = 560048,
  Goerli = 5,
}

export const ChainNames = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Holesky]: 'Holesky',
  [CHAINS.Hoodi]: 'Hoodi',
} as const

export const parseChainId = (chainId: number | string) => {
  return Number(chainId) as keyof typeof ChainNames
}

export const getChainName = (chainId: number) =>
  ChainNames[parseChainId(chainId)]
