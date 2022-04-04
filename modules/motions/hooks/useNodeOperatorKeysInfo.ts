import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { fetcherStandard } from 'modules/network/utils/fetcherStandard'
import { nodeOperatorsKeysInfo } from 'modules/network/utils/urlsApi'

type KeysInfo = {
  operators: {
    invalid: string[]
    duplicates: string[]
    info: {
      index: number
      active: boolean
      name: string
      rewardAddress: string
      stakingLimit: number
      stoppedValidators: number
      totalSigningKeys: number
      usedSigningKeys: number
    }
  }[]
  keys: {
    signatureVerified: number
    duplicatesVerified: number
    total: number
    unusedButNotNew: number
    unused: number
    used: number
    unconfirmed: number
  }
  health: {
    nextUpdateTime: number
    lastUpdateTime: number
    serverTime: number
    status: string
  }
}

export function useNodeOperatorKeysInfo() {
  const { chainId } = useWeb3()
  const nodeOperatorsInfo = useSWR<KeysInfo>(
    nodeOperatorsKeysInfo(chainId),
    fetcherStandard,
  )
  return nodeOperatorsInfo
}
