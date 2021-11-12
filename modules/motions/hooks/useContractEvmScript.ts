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

const EVM_CONTRACTS = {
  [MotionType.NodeOperatorIncreaseLimit]: ContractEvmNodeOperatorIncreaseLimit,
  [MotionType.LEGOTopUp]: ContractEvmLEGOTopUp,
  [MotionType.RewardProgramAdd]: ContractEvmRewardProgramAdd,
  [MotionType.RewardProgramTopUp]: ContractEvmRewardProgramTopUp,
  [MotionType.RewardProgramRemove]: ContractEvmRewardProgramRemove,
} as const

export function useContractEvmScript<T extends MotionType | EvmUnrecognized>(
  motionType: T,
) {
  const chainId = useCurrentChain()

  const contract = useGlobalMemo(() => {
    if (motionType === EvmUnrecognized) return null
    const library = new JsonRpcProvider(getRpcUrl(chainId), chainId)
    return EVM_CONTRACTS[motionType as MotionType].connect({ chainId, library })
  }, `evm-contract-${chainId}-${motionType}`)

  type Contract = T extends MotionType
    ? ReturnType<typeof EVM_CONTRACTS[T]['connect']>
    : null
  return contract as Contract
}
