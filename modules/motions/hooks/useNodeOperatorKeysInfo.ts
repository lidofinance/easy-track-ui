import { CHAINS } from '@lido-sdk/constants'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { nodeOperatorsKeysInfo } from 'modules/network/utils/urlsApi'
import { fetcherStandard } from 'modules/network/utils/fetcherStandard'
import type { KeysInfo } from '../types'

export function useNodeOperatorKeysInfo(
  moduleAddresses: Partial<Record<CHAINS, string>>,
) {
  const { chainId, walletAddress } = useWeb3()
  const nodeOperatorsInfo = useSWR<KeysInfo>(
    nodeOperatorsKeysInfo(
      chainId,
      `${walletAddress}`,
      `${moduleAddresses[chainId]}`,
    ),
    fetcherStandard,
  )
  return nodeOperatorsInfo
}
