import { useCallback, useEffect, useState, useMemo } from 'react'
import { utils } from 'ethers'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  EvmAddressesByType,
  EvmTypesByAdress,
  parseEvmSupportedChainId,
} from 'modules/motions/evmAddresses'

import { useNodeOperatorsList } from './useNodeOperatorsList'
import { EVM_CONTRACTS } from './useContractEvmScript'
import { MotionTypeForms } from 'modules/motions/types'

const isHasTrustedCaller = (
  contract: unknown,
): contract is { trustedCaller: () => string } => {
  if (typeof contract !== 'object' || contract === null) return false
  if ('trustedCaller' in contract) return true
  return false
}

type NodeOperatorsList = ReturnType<typeof useNodeOperatorsList>['data']

const getIsNodeOperatorConnected = (
  walletAddress: string | null | undefined,
  nodeOperatorsList: NodeOperatorsList,
) => {
  if (!walletAddress || !nodeOperatorsList) return false
  const isWalletInList = nodeOperatorsList.some(
    o => utils.getAddress(o.rewardAddress) === utils.getAddress(walletAddress),
  )

  return isWalletInList
}

export const useAvailableMotions = () => {
  const { chainId, walletAddress } = useWeb3()
  const [availableMotions, setAvailableMotions] =
    useState<Record<MotionTypeForms, boolean>>()

  const nodeOperators = useNodeOperatorsList('curated')
  const isNodeOperatorConnected = useMemo(
    () => getIsNodeOperatorConnected(walletAddress, nodeOperators.data),
    [walletAddress, nodeOperators.data],
  )
  const sandboxNodeOperators = useNodeOperatorsList('sandbox')
  const isSandboxNodeOperatorConnected = useMemo(
    () => getIsNodeOperatorConnected(walletAddress, sandboxNodeOperators.data),
    [walletAddress, sandboxNodeOperators.data],
  )

  const nodeOperatorIncreaseLimitAddressMap =
    EvmAddressesByType[MotionTypeForms.NodeOperatorIncreaseLimit]
  const nodeOperatorIncreaseLimitAddress =
    nodeOperatorIncreaseLimitAddressMap[parseEvmSupportedChainId(chainId)]

  const contracts = useMemo(() => {
    return Object.values(EVM_CONTRACTS).filter(
      contract =>
        contract.address[chainId] &&
        contract.address[chainId] !== nodeOperatorIncreaseLimitAddress,
    )
  }, [chainId, nodeOperatorIncreaseLimitAddress])

  const getTrustedConnectionInfo = useCallback(async () => {
    const promiseResult = await Promise.allSettled(
      contracts.map(contract => {
        const connectedContract = contract.connectRpc({ chainId })

        if (!isHasTrustedCaller(connectedContract)) return null

        return connectedContract.trustedCaller()
      }),
    )

    const trustedCallerConnectedMap = promiseResult.reduce(
      (acc, cur, index) => {
        if (cur.status !== 'fulfilled') return acc
        const contractAddress = contracts[index].address[chainId]

        if (!contractAddress) return acc
        const contractType =
          EvmTypesByAdress[parseEvmSupportedChainId(chainId)][contractAddress]

        if (
          !contractType ||
          !Object.keys(MotionTypeForms).includes(contractType)
        )
          return acc

        acc[contractType as MotionTypeForms] = cur.value === walletAddress

        return acc
      },
      {
        [MotionTypeForms.NodeOperatorIncreaseLimit]: isNodeOperatorConnected,
        [MotionTypeForms.SandboxNodeOperatorIncreaseLimit]:
          isSandboxNodeOperatorConnected,
      } as Record<MotionTypeForms, boolean>,
    )
    setAvailableMotions(trustedCallerConnectedMap)
  }, [
    chainId,
    contracts,
    isNodeOperatorConnected,
    walletAddress,
    isSandboxNodeOperatorConnected,
  ])

  useEffect(() => {
    getTrustedConnectionInfo()
  }, [getTrustedConnectionInfo])

  const notHaveAvailableMotions = useMemo(() => {
    if (!availableMotions) return true
    return Object.values(availableMotions).every(value => !value)
  }, [availableMotions])

  return { availableMotions, notHaveAvailableMotions }
}
