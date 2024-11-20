import { useLidoSWR } from '@lido-sdk/react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { NODE_OPERATORS_REGISTRY_MAP } from '../constants'
import { StakingModule } from '../types'

export function useNodeOperatorNameLimit(module: StakingModule) {
  const { chainId } = useWeb3()

  return useLidoSWR(
    ['swr:useNodeOperatorNameLimit', chainId, module],
    async (_key: string, _chainId: number, _module: StakingModule) => {
      const registry = NODE_OPERATORS_REGISTRY_MAP[_module].connectRpc({
        chainId: _chainId,
      })
      return registry.MAX_NODE_OPERATOR_NAME_LENGTH()
    },
  )
}
