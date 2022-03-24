import { useSWR } from 'modules/network/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
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
  const chainId = useCurrentChain()
  const nodeOperatorsInfo = useSWR<KeysInfo>(
    nodeOperatorsKeysInfo(chainId),
    fetcherStandard,
  )
  return nodeOperatorsInfo
}
