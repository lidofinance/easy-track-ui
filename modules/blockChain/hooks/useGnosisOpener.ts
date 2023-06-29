import { useCallback } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { openWindow } from 'modules/shared/utils/openWindow'
import { getGnosisSafeLink } from '../utils/getGnosisSafeLink'

export function useGnosisOpener(address: string, txHash: string) {
  const { chainId } = useWeb3()
  return useCallback(() => {
    const link = getGnosisSafeLink(chainId, address, txHash)
    openWindow(link)
  }, [chainId, address, txHash])
}
