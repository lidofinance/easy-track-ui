import { useCallback } from 'react'
import { useCurrentChain } from './useCurrentChain'
import { openWindow } from 'modules/shared/utils/openWindow'
import { getGnosisSafeLink } from '../utils/getGnosisSafeLink'

export function useGnosisOpener(address: string, linkAddition?: string) {
  const currentChain = useCurrentChain()
  return useCallback(() => {
    const link = getGnosisSafeLink(
      currentChain,
      `${address}${linkAddition || ''}`,
    )
    openWindow(link)
  }, [currentChain, address, linkAddition])
}
