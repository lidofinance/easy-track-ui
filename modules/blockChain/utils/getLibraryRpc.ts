import memoize from 'lodash/memoize'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { getRpcJsonUrls } from 'modules/blockChain/utils/getRpcUrls'
import type { Chains } from 'modules/blockChain/chains'

export const getLibraryRpc = memoize((chainId: Chains) => {
  const urls = getRpcJsonUrls(chainId)
  return getStaticRpcBatchProvider(chainId, urls[0])
})
