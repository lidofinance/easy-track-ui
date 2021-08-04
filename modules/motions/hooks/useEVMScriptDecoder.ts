import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { EVMScriptDecoder } from 'evm-script-decoder'

import RewardProgramRegistryAbi from 'abi/RewardProgramRegistry.abi.json'
import NodeOperatorsRegistryAbi from 'abi/NodeOperators.abi.json'
import FinanceAbi from 'abi/Finance.abi.json'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'

export function useEVMScriptDecoder() {
  const chainId = useCurrentChain()

  return useGlobalMemo(
    () =>
      new EVMScriptDecoder({
        abi: {
          [CONTRACT_ADDRESSES.RewardProgramRegistry[chainId]]:
            RewardProgramRegistryAbi as any,
          [CONTRACT_ADDRESSES.NodeOperatorsRegistry[chainId]]:
            NodeOperatorsRegistryAbi as any,
          [CONTRACT_ADDRESSES.Finance[chainId]]: FinanceAbi as any,
        },
      }),
    `evm-script-decoder-${chainId}`,
  )
}
