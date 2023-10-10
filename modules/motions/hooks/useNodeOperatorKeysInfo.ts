import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { nodeOperatorsKeysInfo } from 'modules/network/utils/urlsApi'
import { fetcherStandard } from 'modules/network/utils/fetcherStandard'
import type { KeysInfo } from '../types'

export function useNodeOperatorKeysInfo() {
  const { chainId, walletAddress } = useWeb3()
  const nodeOperatorsInfo = useSWR<KeysInfo>(
    nodeOperatorsKeysInfo(chainId, `${walletAddress}`),
    fetcherStandard,
  )
  return nodeOperatorsInfo
}
