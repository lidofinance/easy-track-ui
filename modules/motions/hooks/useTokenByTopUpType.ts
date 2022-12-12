import { CHAINS } from '@lido-sdk/constants'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { REGISTRY_WITH_LIMITS_BY_MOTION_TYPE } from 'modules/motions/hooks/useRegistryWithLimits'
import { ContractGovernanceToken } from 'modules/blockChain/contracts'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'
import { MotionType } from 'modules/motions/types'

const TOKEN = {
  [MotionType.LegoLDOTopUp]: {
    label: 'LDO',
    value: (chainId: CHAINS) =>
      ContractGovernanceToken.address[chainId] as string,
  },
  [MotionType.LegoDAITopUp]: {
    label: 'DAI',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.DAI[chainId],
  },
  [MotionType.RccDAITopUp]: {
    label: 'DAI',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.DAI[chainId],
  },
  [MotionType.PmlDAITopUp]: {
    label: 'DAI',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.DAI[chainId],
  },
  [MotionType.AtcDAITopUp]: {
    label: 'DAI',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.DAI[chainId],
  },
  [MotionType.GasFunderETHTopUp]: {
    label: 'ETH',
    value: () => '0x0000000000000000000000000000000000000000',
  },
  [MotionType.AllowedRecipientTopUp]: {
    label: 'LDO',
    value: (chainId: CHAINS) =>
      ContractGovernanceToken.address[chainId] as string,
  },
}

export const useTokenBytTopUpType = ({
  registryType,
}: {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_BY_MOTION_TYPE
}) => {
  const { chainId } = useWeb3()

  const { data: governanceSymbol } = ContractGovernanceToken.useSwrRpc(
    'symbol',
    [],
  )
  const governanceAddress = ContractGovernanceToken.address[chainId] as string

  if (registryType === MotionType.LegoLDOTopUp)
    return { label: governanceSymbol, address: governanceAddress }

  const label = TOKEN[registryType].label
  const address = TOKEN[registryType].value(chainId)

  return { label, address }
}
