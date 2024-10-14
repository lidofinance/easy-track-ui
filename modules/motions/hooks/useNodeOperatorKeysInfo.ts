import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { nodeOperatorsKeysInfo } from 'modules/network/utils/urlsApi'
import { fetcherStandard } from 'modules/network/utils/fetcherStandard'
import { KeysInfo, StakingModule } from '../types'
import { NODE_OPERATORS_REGISTRY_MAP } from '../constants'

export function useNodeOperatorKeysInfo(module: StakingModule) {
  const { chainId, walletAddress } = useWeb3()
  const nodeOperatorsInfo = useSWR<KeysInfo>(
    nodeOperatorsKeysInfo(
      chainId,
      `${walletAddress}`,
      `${NODE_OPERATORS_REGISTRY_MAP[module].address[chainId]}`,
    ),
    fetcherStandard,
  )
  return nodeOperatorsInfo
}
