import { CHAINS } from '@lido-sdk/constants'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { REGISTRY_WITH_LIMITS_MAP } from 'modules/motions/hooks/useRegistryWithLimits'
import { ContractGovernanceToken } from 'modules/blockChain/contracts'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'

const TOKEN: Record<
  keyof typeof REGISTRY_WITH_LIMITS_MAP,
  { label: string; value: (chainId: CHAINS) => string }
> = {
  LegoLDO: {
    label: 'LDO',
    value: (chainId: CHAINS) =>
      ContractGovernanceToken.address[chainId] as string,
  },
  LegoDAI: {
    label: 'DAI',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.DAI[chainId],
  },
  RccDAI: {
    label: 'DAI',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.DAI[chainId],
  },
  PmlDAI: {
    label: 'DAI',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.DAI[chainId],
  },
  AtcDAI: {
    label: 'DAI',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.DAI[chainId],
  },
  GasFunderETH: {
    label: 'ETH',
    value: () => '0x0000000000000000000000000000000000000000',
  },
}

export const useTokenBytTopUpType = ({
  registryType,
}: {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_MAP
}) => {
  const { chainId } = useWeb3()

  const { data: governanceSymbol } = ContractGovernanceToken.useSwrRpc(
    'symbol',
    [],
  )
  const governanceAddress = ContractGovernanceToken.address[chainId] as string

  if (registryType === 'LegoLDO')
    return { label: governanceSymbol, address: governanceAddress }

  const label = TOKEN[registryType].label
  const address = TOKEN[registryType].value(chainId)

  return { label, address }
}
