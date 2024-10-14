import { useLidoSWR } from '@lido-sdk/react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { NODE_OPERATORS_REGISTRY_MAP } from '../constants'
import { StakingModule } from '../types'

export function useNodeOperatorsCount(module: StakingModule) {
  const { chainId } = useWeb3()

  return useLidoSWR(
    ['swr:useNodeOperatorsCount', chainId, module],
    async (_key: string, _chainId: number, _module: StakingModule) => {
      const registry = NODE_OPERATORS_REGISTRY_MAP[_module].connectRpc({
        chainId: _chainId,
      })
      const [current, max] = await Promise.all([
        registry.getNodeOperatorsCount(),
        registry.MAX_NODE_OPERATORS_COUNT(),
      ])
      return { current: current.toNumber(), max: max.toNumber() }
    },
  )
}
