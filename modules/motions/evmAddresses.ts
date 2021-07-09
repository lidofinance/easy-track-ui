import { flow, map, toPairs, fromPairs, mapValues } from 'lodash/fp'
import { Chains } from 'modules/blockChain/chains'
import { MotionType } from './types'
import type { Invert } from 'modules/shared/utils/utilTypes'

//
// Addresses should be lower cased
//

export const EvmAddressesByChain: Record<Chains, Record<MotionType, string>> = {
  // Mainnet
  [Chains.Mainnet]: {
    [MotionType.NodeOperatorIncreaseLimit]: '0x01',
    [MotionType.LEGOTopUp]: '0x02',
    [MotionType.RewardProgramAdd]: '0x03',
    [MotionType.RewardProgramRemove]: '0x04',
    [MotionType.RewardProgramTopUp]: '0x05',
  } as const,

  // Ropsten
  [Chains.Ropsten]: {
    [MotionType.NodeOperatorIncreaseLimit]: '0x01',
    [MotionType.LEGOTopUp]: '0x02',
    [MotionType.RewardProgramAdd]: '0x03',
    [MotionType.RewardProgramRemove]: '0x04',
    [MotionType.RewardProgramTopUp]: '0x05',
  } as const,

  // Rinkeby
  [Chains.Rinkeby]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0x6b59ece035c876aa6efe75e0702cfbde9a535478',
    [MotionType.LEGOTopUp]: '0x457b38f8366a964e39db284f57135fe6b81e0201',
    [MotionType.RewardProgramAdd]: '0xe5e9150d3ec886eb399a4c05e9710d822e15a9e6',
    [MotionType.RewardProgramRemove]:
      '0x5c4b1e63625a0ab78113fd79c2769b2838ceee30',
    [MotionType.RewardProgramTopUp]:
      '0x9718e057ce4881dbfb4929426dd2314c9656ed9f',
  } as const,

  // Goerli
  [Chains.Goerli]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0x81c2f1f181496089c4b93a378fe68614f609eb05',
    [MotionType.LEGOTopUp]: '0x02',
    [MotionType.RewardProgramAdd]: '0x03',
    [MotionType.RewardProgramRemove]: '0x04',
    [MotionType.RewardProgramTopUp]: '0x05',
  } as const,

  // Kovan
  [Chains.Kovan]: {
    [MotionType.NodeOperatorIncreaseLimit]: '0x01',
    [MotionType.LEGOTopUp]: '0x02',
    [MotionType.RewardProgramAdd]: '0x03',
    [MotionType.RewardProgramRemove]: '0x04',
    [MotionType.RewardProgramTopUp]: '0x05',
  } as const,
} as const

// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EvmAddresses = typeof EvmAddressesByChain

export const EvmUnrecognized = 'EvmUnrecognized'
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EvmUnrecognized = typeof EvmUnrecognized

export const EvmTypesByAdress = mapValues(
  flow(
    toPairs,
    map(([type, address]) => [address, type]),
    fromPairs,
  ),
  EvmAddressesByChain,
) as {
  [key in keyof EvmAddresses]: Invert<EvmAddresses[key]>
}

export const EvmAddressesByType = Object.values(MotionType).reduce(
  (res, motionType) => ({
    ...res,
    [motionType]: Object.values(Chains).reduce(
      (resIn, chainId) => ({
        ...resIn,
        [chainId]: EvmAddressesByChain[chainId][motionType],
      }),
      {} as { [C in Chains]: EvmAddresses[C][typeof motionType] },
    ),
  }),
  {} as {
    [M in MotionType]: { [C in Chains]: EvmAddresses[C][M] }
  },
)
