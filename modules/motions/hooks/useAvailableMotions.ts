import { useMemo } from 'react'
import { utils } from 'ethers'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  EvmTypesByAdress,
  parseEvmSupportedChainId,
} from 'modules/motions/evmAddresses'

import { useNodeOperatorsList } from './useNodeOperatorsList'
import { EVM_CONTRACTS } from './useContractEvmScript'
import { MotionTypeForms } from 'modules/motions/types'
import { useSWR } from 'modules/network/hooks/useSwr'

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

  const { data: nodeOperators, initialLoading: isNodeOperatorsDataLoading } =
    useNodeOperatorsList('curated')

  const {
    data: sandboxNodeOperators,
    initialLoading: isSandboxNodeOperatorsDataLoading,
  } = useNodeOperatorsList('sandbox')

  const { data: availableMotions, initialLoading } = useSWR<AvailableMotions>(
    walletAddress && nodeOperators && sandboxNodeOperators
      ? `available-motions-${chainId}-${walletAddress}`
      : null,
    async () => {
      if (
        !walletAddress ||
        nodeOperators === undefined ||
        sandboxNodeOperators === undefined
      ) {
        return {} as AvailableMotions
      }

      const parsedChainId = parseEvmSupportedChainId(chainId)
      const nodeOperatorIncreaseLimitAddress =
        EVM_CONTRACTS[MotionTypeForms.NodeOperatorIncreaseLimit].address[
          parsedChainId
        ]
      const sandboxNodeOperatorIncreaseLimitAddress =
        EVM_CONTRACTS[MotionTypeForms.SandboxNodeOperatorIncreaseLimit].address[
          parsedChainId
        ]

      const promiseResult = await Promise.allSettled(
        Object.values(EVM_CONTRACTS).map(async contract => {
          const contractAddress = contract.address[chainId]

          if (
            !contractAddress ||
            contractAddress === nodeOperatorIncreaseLimitAddress ||
            contractAddress === sandboxNodeOperatorIncreaseLimitAddress
          ) {
            return null
          }

          const connectedContract = contract.connectRpc({ chainId })

          if (!isHasTrustedCaller(connectedContract)) {
            return null
          }

          const trustedCaller = await connectedContract.trustedCaller()

          return { contractAddress, trustedCaller }
        }),
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
            EvmTypesByAdress[parseEvmSupportedChainId(chainId)][contractAddress]

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
    isLoading:
      initialLoading ||
      isNodeOperatorsDataLoading ||
      isSandboxNodeOperatorsDataLoading,
    notHaveAvailableMotions,
  }
}
