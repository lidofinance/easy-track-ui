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
      '0x1ABE1418148dEeBFC2e286e0e963A2C94428843d',
    [MotionType.LEGOTopUp]: '0x416aBfE68A17c7AaAe1d52165796E0A31443b83D',
    [MotionType.RewardProgramAdd]: '0xb4A1e61b4F9150ec85910b966b9eF536860738D5',
    [MotionType.RewardProgramRemove]:
      '0xD9Fa5976D60DDc3e7A311bF0bBC39d7619D61b0C',
    [MotionType.RewardProgramTopUp]:
      '0xA2E5860C209D533d58824a5235f66bB20C5aCcF2',
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
