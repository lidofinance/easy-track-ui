import { flow, map, toPairs, fromPairs, mapValues } from 'lodash/fp'
import { Chains, ChainId, parseChainId } from 'modules/blockChain/chains'
import { MotionType } from '../types'
import type { Invert } from 'modules/shared/utils/utilTypes'

export const MotionAddressesByType: Record<
  ChainId,
  Record<MotionType, string>
> = {
  // Mainnet
  [Chains.Mainnet]: {
    [MotionType.NodeOperatorLimit]: '0x01',
    [MotionType.LEGOTopUp]: '0x02',
    [MotionType.RewardProgramAdd]: '0x03',
    [MotionType.RewardProgramRemove]: '0x04',
    [MotionType.RewardProgramTopUp]: '0x05',
  } as const,

  // Ropsten
  [Chains.Ropsten]: {
    [MotionType.NodeOperatorLimit]: '0x01',
    [MotionType.LEGOTopUp]: '0x02',
    [MotionType.RewardProgramAdd]: '0x03',
    [MotionType.RewardProgramRemove]: '0x04',
    [MotionType.RewardProgramTopUp]: '0x05',
  } as const,

  // Rinkeby
  [Chains.Rinkeby]: {
    [MotionType.NodeOperatorLimit]:
      '0x6b59EcE035C876aA6eFE75E0702CFBdE9A535478',
    [MotionType.LEGOTopUp]: '0x457b38f8366A964E39Db284F57135fe6b81e0201',
    [MotionType.RewardProgramAdd]: '0xe5e9150d3ec886eB399A4c05E9710D822E15a9e6',
    [MotionType.RewardProgramRemove]:
      '0x5C4B1e63625A0AB78113fD79C2769B2838CeEe30',
    [MotionType.RewardProgramTopUp]:
      '0x9718e057cE4881Dbfb4929426DD2314C9656eD9f',
  } as const,

  // Goerli
  [Chains.Goerli]: {
    [MotionType.NodeOperatorLimit]:
      '0x81C2F1f181496089c4b93a378fe68614F609EB05',
    [MotionType.LEGOTopUp]: '0x02',
    [MotionType.RewardProgramAdd]: '0x03',
    [MotionType.RewardProgramRemove]: '0x04',
    [MotionType.RewardProgramTopUp]: '0x05',
  } as const,

  // Kovan
  [Chains.Kovan]: {
    [MotionType.NodeOperatorLimit]: '0x01',
    [MotionType.LEGOTopUp]: '0x02',
    [MotionType.RewardProgramAdd]: '0x03',
    [MotionType.RewardProgramRemove]: '0x04',
    [MotionType.RewardProgramTopUp]: '0x05',
  } as const,
} as const

// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionAddressesByType = typeof MotionAddressesByType

export const MotionTypesByAddress = mapValues(
  flow(
    toPairs,
    map(([type, address]) => [address, type]),
    fromPairs,
  ),
  MotionAddressesByType,
) as {
  [key in keyof MotionAddressesByType]: Invert<MotionAddressesByType[key]>
}

export const parseScriptFactory = (chainId: ChainId, scriptFactory: string) => {
  if (
    !MotionTypesByAddress[parseChainId(chainId)].hasOwnProperty(scriptFactory)
  ) {
    throw new Error(`Script factory ${scriptFactory} not recognized`)
  }
  return scriptFactory
}

export const getMotionTypeByScriptFactory = (
  chainId: ChainId,
  scriptFactory: string,
) => {
  try {
    return MotionTypesByAddress[parseChainId(chainId)][
      parseScriptFactory(chainId, scriptFactory)
    ]
  } catch {
    return 'unrecognized type'
  }
}

export const getScriptFactoryByMotionType = (
  chainId: ChainId,
  motionType: MotionType,
) => {
  return MotionAddressesByType[parseChainId(chainId)][motionType]
}
