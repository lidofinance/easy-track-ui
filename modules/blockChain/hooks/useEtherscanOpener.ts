import { useCallback } from 'react'
import { useCurrentChain } from './useCurrentChain'
import { openWindow } from 'modules/utils/openWindow'
import { getEtherscanLink, EtherscanEntities } from '../utils/getEtherscanLink'

export function useEtherscanOpener(hash: string, entity: EtherscanEntities) {
  const currentChain = useCurrentChain()
  return useCallback(() => {
    const link = getEtherscanLink(currentChain, hash, entity)
    openWindow(link)
  }, [currentChain, entity, hash])
}
