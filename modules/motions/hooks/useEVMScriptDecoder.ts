import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { EVMScriptDecoder } from '@lidofinance/evm-script-decoder/lib/EVMScriptDecoder'
import { ABIProviderLocal } from '@lidofinance/evm-script-decoder/lib/ABIProviderLocal'

import ReferralPartnersRegistry from 'abi/ReferralPartnersRegistry.abi.json'
import RewardProgramRegistryAbi from 'abi/RewardProgramRegistry.abi.json'
import NodeOperatorsRegistryAbi from 'abi/NodeOperators.abi.json'
import AllowedRecipientsRegistryLDOAbi from 'abi/LDO/AllowedRecipientsRegistryLDO.abi.json'
import RegistryWithLimitsAbi from 'abi/TopUp/RegistryWithLimits.abi.json'
import FinanceAbi from 'abi/Finance.abi.json'
import AllowedRecipientsRegistryLDOAbi from 'abi/newReward/AllowedRecipientsRegistryLDO.abi.json'
import RegistryWithLimitsAbi from 'abi/topUp/RegistryWithLimits.abi.json'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'

export function useEVMScriptDecoder() {
  const { chainId } = useWeb3()

  return useGlobalMemo(
    () =>
      new EVMScriptDecoder(
        new ABIProviderLocal({
          [CONTRACT_ADDRESSES.ReferralPartnersRegistry[chainId]]:
            ReferralPartnersRegistry as any,
          [CONTRACT_ADDRESSES.RewardProgramRegistry[chainId]]:
            RewardProgramRegistryAbi as any,
          [CONTRACT_ADDRESSES.NodeOperatorsRegistry[chainId]]:
            NodeOperatorsRegistryAbi as any,
          [CONTRACT_ADDRESSES.Finance[chainId]]: FinanceAbi as any,
          [CONTRACT_ADDRESSES.AllowedRecipientRegistry[chainId]]:
            AllowedRecipientsRegistryLDOAbi as any,
          [CONTRACT_ADDRESSES.LegoLDORegistry[chainId]]:
            RegistryWithLimitsAbi as any,
          [CONTRACT_ADDRESSES.LegoDAIRegistry[chainId]]:
            RegistryWithLimitsAbi as any,
          [CONTRACT_ADDRESSES.RccDAIRegistry[chainId]]:
            RegistryWithLimitsAbi as any,
          [CONTRACT_ADDRESSES.PmlDAIRegistry[chainId]]:
            RegistryWithLimitsAbi as any,
          [CONTRACT_ADDRESSES.AtcDAIRegistry[chainId]]:
            RegistryWithLimitsAbi as any,
          [CONTRACT_ADDRESSES.gasFunderETHRegistry[chainId]]:
            RegistryWithLimitsAbi as any,
        }),
      ),
    `evm-script-decoder-${chainId}`,
  )
}
