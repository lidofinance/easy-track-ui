import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { useLidoSWRImmutable } from '@lido-sdk/react'
import {
  ContractAragonAcl,
  ContractSDVTRegistry,
} from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useCallback, useState } from 'react'
import { getSDVTOperatorManager } from '../utils/getManagerAddressesMap'

export const useGetSDVTOperatorManager = () => {
  const { chainId } = useWeb3()
  const registry = ContractSDVTRegistry.useRpc()
  const aragonAcl = ContractAragonAcl.useRpc()
  const { getRpcUrl } = useConfig()

  const [isManagerAddressLoading, setIsLoading] = useState(false)

  const { data: currentBlock } = useLidoSWRImmutable(
    `block-number-manager-${chainId}`,
    async () => {
      const provider = getStaticRpcBatchProvider(chainId, getRpcUrl(chainId))
      return provider.getBlockNumber()
    },
  )

  const getManagerAddress = useCallback(
    async (nodeOperatorId: number) => {
      setIsLoading(true)
      try {
        if (typeof currentBlock !== 'number') {
          throw new Error('getManagerAddress: Block number is undefined')
        }

        const address = await getSDVTOperatorManager({
          aragonAcl,
          chainId,
          registryAddress: registry.address,
          currentBlock,
          nodeOperatorId,
        })

        if (!address) {
          throw new Error(`Manager address not found for ID: ${nodeOperatorId}`)
        }
        return address
      } catch (error) {
        console.error('Error fetching manager address:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [aragonAcl, chainId, currentBlock, registry.address],
  )

  return { getManagerAddress, isManagerAddressLoading }
}
