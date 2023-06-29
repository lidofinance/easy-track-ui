import { useGlobalMemo } from 'modules/shared/hooks/useGlobalMemo'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { EVMScriptDecoder } from '@lidofinance/evm-script-decoder/lib/EVMScriptDecoder'
import { ABIProviderLocal } from '@lidofinance/evm-script-decoder/lib/ABIProviderLocal'

import * as abis from 'generated'
import * as ADDR from 'modules/blockChain/contractAddresses'

export function useEVMScriptDecoder() {
  const { chainId } = useWeb3()

  return useGlobalMemo(() => {
    const KEYS = Object.keys(ADDR).reduce(
      (keys, contractName: keyof typeof ADDR) => ({
        ...keys,
        [contractName]: ADDR[contractName][chainId]!,
      }),
      {} as Record<keyof typeof ADDR, string>,
    )

    return new EVMScriptDecoder(
      new ABIProviderLocal({
        [KEYS.ReferralPartnersRegistry]: abis
          .ReferralPartnersRegistryAbi__factory.abi as any,
        [KEYS.RewardProgramRegistry]:
          abis.RewardProgramRegistryAbi__factory.abi,
        [KEYS.NodeOperatorsRegistry]: abis.NodeOperatorsAbi__factory.abi,
        [KEYS.Finance]: abis.FinanceAbi__factory.abi,
        [KEYS.AllowedRecipientRegistry]:
          abis.AllowedRecipientsRegistryAbi__factory.abi,
        [KEYS.AllowedRecipientReferralDaiRegistry]:
          abis.AllowedRecipientsRegistryAbi__factory.abi,
        [KEYS.AllowedRecipientTrpLdoRegistry]:
          abis.AllowedRecipientsRegistryAbi__factory.abi,
        [KEYS.LegoLDORegistry]: abis.RegistryWithLimitsAbi__factory.abi,
        [KEYS.LegoDAIRegistry]: abis.RegistryWithLimitsAbi__factory.abi,
        [KEYS.RccDAIRegistry]: abis.RegistryWithLimitsAbi__factory.abi,
        [KEYS.PmlDAIRegistry]: abis.RegistryWithLimitsAbi__factory.abi,
        [KEYS.AtcDAIRegistry]: abis.RegistryWithLimitsAbi__factory.abi,
        [KEYS.gasFunderETHRegistry]: abis.RegistryWithLimitsAbi__factory.abi,
        [KEYS.StethRewardProgramRegistry]:
          abis.RegistryWithLimitsAbi__factory.abi,
        [KEYS.StethGasSupplyRegistry]: abis.RegistryWithLimitsAbi__factory.abi,
      }),
    )
  }, `evm-script-decoder-${chainId}`)
}
