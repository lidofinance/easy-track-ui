import {
  ContractAllowedTokensRegistry,
  ContractSandboxStablesAllowedTokensRegistry,
} from 'modules/blockChain/contracts'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { connectERC20Contract } from '../utils/connectTokenContract'
import { MotionType } from '../types'

const TOKENS_REGISTRY_BY_MOTION_TYPE = {
  [MotionType.AtcStablesTopUp]: ContractAllowedTokensRegistry,
  [MotionType.PmlStablesTopUp]: ContractAllowedTokensRegistry,
  [MotionType.RccStablesTopUp]: ContractAllowedTokensRegistry,
  [MotionType.SandboxStablesTopUp]: ContractSandboxStablesAllowedTokensRegistry,
}

type RegistryType = keyof typeof TOKENS_REGISTRY_BY_MOTION_TYPE

export function useAllowedTokens(registryType: RegistryType) {
  const { chainId, library } = useWeb3()
  const registry = TOKENS_REGISTRY_BY_MOTION_TYPE[registryType].useRpc()

  const { data, initialLoading } = useSWR(
    `allowed-tokens-${registryType}-${chainId}`,
    async () => {
      if (!library) {
        return
      }

      const tokensAddresses = await registry.getAllowedTokens()

      const allowedTokens = await Promise.all(
        tokensAddresses.map(async tokenAddress => {
          const tokenContract = connectERC20Contract(tokenAddress, chainId)

          const label = await tokenContract.symbol()
          const decimals = await tokenContract.decimals()

          return { address: tokenAddress, label, decimals }
        }),
      )

      const tokensDecimalsMap: Record<string, number | undefined> = {}

      for (const token of allowedTokens) {
        tokensDecimalsMap[token.address] = token.decimals
      }

      return { allowedTokens, tokensDecimalsMap }
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  return {
    allowedTokens: data?.allowedTokens,
    tokensDecimalsMap: data?.tokensDecimalsMap,
    initialLoading,
  }
}
