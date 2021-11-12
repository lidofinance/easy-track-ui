import memoize from 'lodash/memoize'
import { providers } from 'ethers'
import { getRpcJsonUrls } from 'modules/blockChain/utils/getRpcUrls'
import type { Chains } from 'modules/blockChain/chains'

export const getLibrary = memoize((chainId: Chains) => {
  const urls = getRpcJsonUrls(chainId)
  return new providers.JsonRpcProvider(urls[0], chainId)
})
