import { useCallback } from 'react'
import { useChain } from './useChain'
import { openWindow } from 'modules/utils/openWindow'
import { getEtherscanLink, EtherscanEntities } from '../utils/getEtherscanLink'

export function useEtherscanOpen(hash: string, entity: EtherscanEntities) {
  const chainId = useChain()

  return useCallback(() => {
    const link = getEtherscanLink(chainId, hash, entity)
    openWindow(link)
  }, [chainId, entity, hash])
}
