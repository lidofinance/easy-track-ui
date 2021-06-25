import { Chains, ChainId, parseChainId } from './chains'

export enum TOKENS {
  // wsteth = 'wsteth',
  // steth = 'steth',
  // weth = 'weth',
  ldo = 'ldo',
  // ldopl = 'ldopl',
}

export type Token = keyof typeof TOKENS

export const TOKENS_BY_NETWORK = {
  // [TOKENS.wsteth]: {
  //   [Chains.Mainnet]: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
  //   [Chains.Ropsten]: '0x0000000000000000000000000000000000000000',
  //   [Chains.Rinkeby]: '0x2Ca788280fB10384946D3ECC838D94DeCa505CF4',
  //   [Chains.Goerli]: '0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f',
  //   [Chains.Kovan]: '0x0000000000000000000000000000000000000000',
  // } as const,
  // [TOKENS.steth]: {
  //   [Chains.Mainnet]: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  //   [Chains.Ropsten]: '0x0000000000000000000000000000000000000000',
  //   [Chains.Rinkeby]: '0xbA453033d328bFdd7799a4643611b616D80ddd97',
  //   [Chains.Goerli]: '0x1643e812ae58766192cf7d2cf9567df2c37e9b7f',
  //   [Chains.Kovan]: '0x0000000000000000000000000000000000000000',
  // } as const,
  // [TOKENS.weth]: {
  //   [Chains.Mainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  //   [Chains.Ropsten]: '0x0000000000000000000000000000000000000000',
  //   [Chains.Rinkeby]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  //   [Chains.Goerli]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  //   [Chains.Kovan]: '0x0000000000000000000000000000000000000000',
  // } as const,
  [TOKENS.ldo]: {
    [Chains.Mainnet]: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
    [Chains.Ropsten]: '0x0000000000000000000000000000000000000000',
    [Chains.Rinkeby]: '0xbfcb02cf3df4f36ab8185469834e0e00a5fc6053',
    [Chains.Goerli]: '0x56340274fb5a72af1a3c6609061c451de7961bd4',
    // [Chains.Goerli]: '0xc3e39834c92c90463fab675a99def1bdd195fb04',
    [Chains.Kovan]: '0x0000000000000000000000000000000000000000',
  } as const,
  // [TOKENS.ldopl]: {
  //   [Chains.Mainnet]: '0x0000000000000000000000000000000000000000',
  //   [Chains.Ropsten]: '0x0000000000000000000000000000000000000000',
  //   [Chains.Rinkeby]: '0xb07de0148b53e5ec7bb73e16016bb4d3fc71f0ca',
  //   [Chains.Goerli]: '0xb07de0148b53e5ec7bb73e16016bb4d3fc71f0ca',
  //   [Chains.Kovan]: '0x0000000000000000000000000000000000000000',
  // } as const,
} as const

export const getTokenAddresses = (token: Token) => TOKENS_BY_NETWORK[token]

export const getTokenAddress = (chainId: ChainId, token: Token) =>
  TOKENS_BY_NETWORK[token][parseChainId(chainId)]
