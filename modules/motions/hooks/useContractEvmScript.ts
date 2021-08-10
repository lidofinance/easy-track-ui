import { JsonRpcProvider } from '@ethersproject/providers'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { getRpcUrl } from 'modules/blockChain/utils/getRpcUrls'
import { MotionType } from '../types'
import {
  ContractEvmNodeOperatorIncreaseLimit,
  ContractEvmLEGOTopUp,
  ContractEvmRewardProgramAdd,
  ContractEvmRewardProgramRemove,
  ContractEvmRewardProgramTopUp,
} from 'modules/blockChain/contracts'
import { EvmUnrecognized } from '../evmAddresses'

const EVM_CONNECTORS = {
  [MotionType.NodeOperatorIncreaseLimit]:
    ContractEvmNodeOperatorIncreaseLimit.connect,
  [MotionType.LEGOTopUp]: ContractEvmLEGOTopUp.connect,
  [MotionType.RewardProgramAdd]: ContractEvmRewardProgramAdd.connect,
  [MotionType.RewardProgramTopUp]: ContractEvmRewardProgramTopUp.connect,
  [MotionType.RewardProgramRemove]: ContractEvmRewardProgramRemove.connect,
} as const

export function useContractEvmScript<T extends MotionType | EvmUnrecognized>(
  motionType: T,
) {
  const chainId = useCurrentChain()

  const contract = useGlobalMemo(() => {
    if (motionType === EvmUnrecognized) return null
    const library = new JsonRpcProvider(getRpcUrl(chainId), chainId)
    return EVM_CONNECTORS[motionType as MotionType]({ chainId, library })
  }, `evm-contract-${chainId}-${motionType}`)

  type Contract = T extends MotionType
    ? ReturnType<typeof EVM_CONNECTORS[T]>
    : null
  return contract as Contract
}

export function useContractEvmNodeOperatorIncreaseLimit() {
  return useContractEvmScript(MotionType.NodeOperatorIncreaseLimit)
}

export function useContractEvmLEGOTopUp() {
  return useContractEvmScript(MotionType.LEGOTopUp)
}

export function useContractEvmRewardProgramAdd() {
  return useContractEvmScript(MotionType.RewardProgramAdd)
}

export function useContractEvmRewardProgramRemove() {
  return useContractEvmScript(MotionType.RewardProgramRemove)
}

export function useContractEvmRewardProgramTopUp() {
  return useContractEvmScript(MotionType.RewardProgramTopUp)
}
