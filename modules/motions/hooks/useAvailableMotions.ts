import { useMemo } from 'react'
import { utils } from 'ethers'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  EvmTypesByAddress,
  parseEvmSupportedChainId,
} from 'modules/motions/evmAddresses'

import { useNodeOperatorsList } from './useNodeOperatorsList'
import { EVM_CONTRACTS } from './useContractEvmScript'
import { MotionTypeForms } from 'modules/motions/types'
import { useSWR } from 'modules/network/hooks/useSwr'
import { processInBatches } from 'modules/blockChain/utils/processInBatches'
import { MAX_PROVIDER_BATCH } from 'modules/config'
import { useConfig } from 'modules/config/hooks/useConfig'

const isHasTrustedCaller = (
  contract: unknown,
): contract is { trustedCaller: () => string } => {
  if (typeof contract !== 'object' || contract === null) return false
  if ('trustedCaller' in contract) return true
  return false
}

type NodeOperatorsList = ReturnType<typeof useNodeOperatorsList>['data']

type AvailableMotions = Record<MotionTypeForms, boolean>

const getIsNodeOperatorConnected = (
  walletAddress: string | null | undefined,
  nodeOperatorsList: NodeOperatorsList,
) => {
  if (!walletAddress || !nodeOperatorsList) return false
  return nodeOperatorsList.some(
    o => utils.getAddress(o.rewardAddress) === utils.getAddress(walletAddress),
  )
}

export const useAvailableMotions = () => {
  const { chainId, walletAddress } = useWeb3()
  const { getRpcUrl } = useConfig()

  const { data: nodeOperators, initialLoading: isNodeOperatorsDataLoading } =
    useNodeOperatorsList('curated')

  const {
    data: sandboxNodeOperators,
    initialLoading: isSandboxNodeOperatorsDataLoading,
  } = useNodeOperatorsList('sandbox')

  const {
    data: availableMotions,
    initialLoading: isAvailableMotionsDataLoading,
  } = useSWR<AvailableMotions>(
    walletAddress && nodeOperators && sandboxNodeOperators
      ? `available-motions-${chainId}-${walletAddress}`
      : null,
    async () => {
      const parsedChainId = parseEvmSupportedChainId(chainId)
      const rpcUrl = getRpcUrl(parsedChainId)
      const nodeOperatorIncreaseLimitAddress =
        EVM_CONTRACTS[MotionTypeForms.NodeOperatorIncreaseLimit].address[
          parsedChainId
        ]
      const sandboxNodeOperatorIncreaseLimitAddress =
        EVM_CONTRACTS[MotionTypeForms.SandboxNodeOperatorIncreaseLimit].address[
          parsedChainId
        ]

      const relevantContracts = Object.values(EVM_CONTRACTS).filter(
        contract => {
          const contractAddress = contract.address[chainId]
          return (
            contractAddress &&
            contractAddress !== nodeOperatorIncreaseLimitAddress &&
            contractAddress !== sandboxNodeOperatorIncreaseLimitAddress
          )
        },
      )

      const promiseResult = await processInBatches(
        relevantContracts,
        MAX_PROVIDER_BATCH,
        async contract => {
          const connectedContract = contract.connectRpc({
            chainId,
            rpcUrl,
            cacheSeed: `available-motions-${chainId}`,
          })

          if (!isHasTrustedCaller(connectedContract)) return null

          const trustedCaller = await connectedContract.trustedCaller()
          return { contractAddress: connectedContract.address, trustedCaller }
        },
      )

      const isNodeOperatorConnected = getIsNodeOperatorConnected(
        walletAddress,
        nodeOperators,
      )
      const isSandboxNodeOperatorConnected = getIsNodeOperatorConnected(
        walletAddress,
        sandboxNodeOperators,
      )

      return promiseResult.reduce(
        (acc, cur) => {
          if (cur.status !== 'fulfilled' || !cur.value) {
            return acc
          }

          const { contractAddress, trustedCaller } = cur.value

          const contractType =
            EvmTypesByAddress[parseEvmSupportedChainId(chainId)][
              contractAddress
            ]

          if (
            !contractType ||
            !Object.keys(MotionTypeForms).includes(contractType)
          ) {
            return acc
          }

          acc[contractType as MotionTypeForms] = trustedCaller === walletAddress

          return acc
        },
        {
          [MotionTypeForms.NodeOperatorIncreaseLimit]: isNodeOperatorConnected,
          [MotionTypeForms.SandboxNodeOperatorIncreaseLimit]:
            isSandboxNodeOperatorConnected,
        } as AvailableMotions,
      )
    },
    { revalidateOnReconnect: false, revalidateOnFocus: false },
  )

  const notHaveAvailableMotions = useMemo(() => {
    if (!availableMotions) return true
    return Object.values(availableMotions).every(value => !value)
  }, [availableMotions])

  return {
    availableMotions,
    initialLoading:
      isAvailableMotionsDataLoading ||
      isNodeOperatorsDataLoading ||
      isSandboxNodeOperatorsDataLoading,
    notHaveAvailableMotions,
  }
}
