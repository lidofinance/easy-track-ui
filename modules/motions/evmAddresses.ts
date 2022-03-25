import { flow, map, toPairs, fromPairs, mapValues } from 'lodash/fp'
import { CHAINS } from '@lido-sdk/constants'
import { MotionType } from './types'
import type { Invert } from 'modules/shared/utils/utilTypes'

//
// Addresses should be lower cased
//

export const EvmAddressesByChain = {
  // Mainnet
  [CHAINS.Mainnet]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0xFeBd8FAC16De88206d4b18764e826AF38546AfE0',
    [MotionType.LEGOTopUp]: '0x648C8Be548F43eca4e482C0801Ebccccfb944931',
    [MotionType.RewardProgramAdd]: '0x9D15032b91d01d5c1D940eb919461426AB0dD4e3',
    [MotionType.RewardProgramRemove]:
      '0xc21e5e72Ffc223f02fC410aAedE3084a63963932',
    [MotionType.RewardProgramTopUp]:
      '0x77781A93C4824d2299a38AC8bBB11eb3cd6Bc3B7',
    [MotionType.ReferralPartnerAdd]:
      '0x929547490Ceb6AeEdD7d72F1Ab8957c0210b6E51',
    [MotionType.ReferralPartnerRemove]:
      '0xE9eb838fb3A288bF59E9275Ccd7e124fDff88a9C',
    [MotionType.ReferralPartnerTopUp]:
      '0x54058ee0E0c87Ad813C002262cD75B98A7F59218',
  },

  // Rinkeby
  [CHAINS.Rinkeby]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977',
    [MotionType.LEGOTopUp]: '0xdA53fF207966b3946facaC52dD22B130D507d276',
    [MotionType.RewardProgramAdd]: '0x3129C041B372eE93a5A8756dc4EC6f154D85Bc9a',
    [MotionType.RewardProgramRemove]:
      '0xc21e5e72Ffc223f02fC410aAedE3084a63963932',
    [MotionType.RewardProgramTopUp]:
      '0xbb0f594143208eCd04DC7AAe48955902A716F9F7',
    [MotionType.ReferralPartnerAdd]: '0x',
    [MotionType.ReferralPartnerRemove]: '0x',
    [MotionType.ReferralPartnerTopUp]: '0x',
  },

  // Goerli
  [CHAINS.Goerli]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0xE033673D83a8a60500BcE02aBd9007ffAB587714',
    [MotionType.LEGOTopUp]: '0xb2bcf211F103d7F13789394DD475c2274e044C4C',
    [MotionType.RewardProgramAdd]: '0x5560d40b00EA3a64E9431f97B3c79b04e0cdF6F2',
    [MotionType.RewardProgramRemove]:
      '0x31B68d81125E52fE1aDfe4076F8945D1014753b5',
    [MotionType.RewardProgramTopUp]:
      '0x8180949ac41EF18e844ff8dafE604a195d86Aea9',
    [MotionType.ReferralPartnerAdd]:
      '0xe54ca3e867C52a34d262E94606C7A9371AB820c9',
    [MotionType.ReferralPartnerRemove]:
      '0x2A0c343087c6cFB721fFa20608A6eD0473C71275',
    [MotionType.ReferralPartnerTopUp]:
      '0xB1E898faC74c377bEF16712Ba1CD4738606c19Ee',
  },
}

export const parseEvmSupportedChainId = (
  chainId: CHAINS,
): EvmSupportedChain => {
  const numChainId = Number(chainId)

  if (!(numChainId in EvmAddressesByChain)) {
    throw new Error(`Chain ${chainId} is not supported`)
  }

  return numChainId
}

export const EvmSupportedChains = Object.keys(EvmAddressesByChain)
  .map(v => Number(v))
  .filter(v => Number.isFinite(v)) as EvmSupportedChain[]

export type EvmSupportedChain = keyof EvmAddresses

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
  [key in EvmSupportedChain]: Invert<EvmAddresses[key]>
}

export const EvmAddressesByType = Object.values(MotionType).reduce(
  (res, motionType) => ({
    ...res,
    [motionType]: EvmSupportedChains.reduce(
      (resIn, chainId) => ({
        ...resIn,
        [chainId]: EvmAddressesByChain[chainId][motionType],
      }),
      {} as { [C in EvmSupportedChain]: EvmAddresses[C][typeof motionType] },
    ),
  }),
  {} as {
    [M in MotionType]: { [C in EvmSupportedChain]: EvmAddresses[C][M] }
  },
)
