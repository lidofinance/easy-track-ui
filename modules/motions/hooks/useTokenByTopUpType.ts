import { CHAINS } from '@lido-sdk/constants'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { ContractGovernanceToken } from 'modules/blockChain/contracts'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'
import { MotionType } from 'modules/motions/types'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'

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
  [MotionType.AllowedRecipientTopUpReferralDai]: {
    label: 'DAI',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.DAI[chainId],
  },
  [MotionType.AllowedRecipientTopUpTrpLdo]: {
    label: 'LDO',
    value: (chainId: CHAINS) =>
      ContractGovernanceToken.address[chainId] as string,
  },
  [MotionType.StethRewardProgramTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.STETH[chainId],
  },
  [MotionType.StethGasSupplyTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.STETH[chainId],
  },
  [MotionType.RewardsShareProgramTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.STETH[chainId],
  },
  [MotionType.RccStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.STETH[chainId],
  },
  [MotionType.PmlStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.STETH[chainId],
  },
  [MotionType.AtcStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.STETH[chainId],
  },
  [MotionType.StonksStethTopUp]: {
    label: 'stETH',
    value: (chainId: CHAINS) => CONTRACT_ADDRESSES.STETH[chainId],
  },
}

const isTopUpType = (type: unknown): type is keyof typeof TOKEN => {
  if (typeof type !== 'string') return false
  if (type in TOKEN) return true
  return false
}

export const useTokenByTopUpType = ({
  registryType,
}: {
  registryType: MotionType | EvmUnrecognized
}) => {
  const { chainId } = useWeb3()

  const { data: governanceSymbol } = ContractGovernanceToken.useSwrRpc(
    'symbol',
    [],
  )
  const governanceAddress = ContractGovernanceToken.address[chainId] as string

  if (
    registryType === MotionType.LegoLDOTopUp ||
    registryType === MotionType.AllowedRecipientTopUp
  )
    return { label: governanceSymbol, address: governanceAddress }

  if (!isTopUpType(registryType)) return { label: '', address: '' }

  const label = TOKEN[registryType].label
  const address = TOKEN[registryType].value(chainId)!

  return { label, address }
}
