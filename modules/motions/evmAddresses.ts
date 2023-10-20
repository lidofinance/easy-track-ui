import { flow, map, toPairs, fromPairs, mapValues } from 'lodash/fp'
import { CHAINS } from '@lido-sdk/constants'
import { MotionType } from './types'
import { Invert } from 'modules/shared/utils/utilTypes'

const EvmSupportedChains = [CHAINS.Mainnet, CHAINS.Goerli] as const

export type EvmSupportedChain = typeof EvmSupportedChains[number]

type EvmAddresses = Record<
  EvmSupportedChain,
  Partial<Record<MotionType, string>>
>

export const EvmAddressesByChain: EvmAddresses = {
  // Mainnet
  [CHAINS.Mainnet]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0xFeBd8FAC16De88206d4b18764e826AF38546AfE0',
    [MotionType.AllowedRecipientTopUpTrpLdo]:
      '0xBd2b6dC189EefD51B273F5cb2d99BA1ce565fb8C',
    [MotionType.LegoLDOTopUp]: '0x00caAeF11EC545B192f16313F53912E453c91458',
    [MotionType.LegoDAITopUp]: '0x0535a67ea2D6d46f85fE568B7EaA91Ca16824FEC',
    [MotionType.RccDAITopUp]: '0x84f74733ede9bFD53c1B3Ea96338867C94EC313e',
    [MotionType.PmlDAITopUp]: '0x4E6D3A5023A38cE2C4c5456d3760357fD93A22cD',
    [MotionType.AtcDAITopUp]: '0x67Fb97ABB9035E2e93A7e3761a0d0571c5d7CD07',
    [MotionType.StethRewardProgramAdd]:
      '0x935cb3366Faf2cFC415B2099d1F974Fd27202b77',
    [MotionType.StethRewardProgramRemove]:
      '0x22010d1747CaFc370b1f1FBBa61022A313c5693b',
    [MotionType.StethRewardProgramTopUp]:
      '0x1F2b79FE297B7098875930bBA6dd17068103897E',
    [MotionType.StethGasSupplyAdd]:
      '0x48c135Ff690C2Aa7F5B11C539104B5855A4f9252',
    [MotionType.StethGasSupplyRemove]:
      '0x7E8eFfAb3083fB26aCE6832bFcA4C377905F97d7',
    [MotionType.StethGasSupplyTopUp]:
      '0x200dA0b6a9905A377CF8D469664C65dB267009d1',
    [MotionType.RewardsShareProgramAdd]:
      '0x1F809D2cb72a5Ab13778811742050eDa876129b6',
    [MotionType.RewardsShareProgramRemove]:
      '0xd30Dc38EdEfc21875257e8A3123503075226E14B',
    [MotionType.RewardsShareProgramTopUp]:
      '0xbD08f9D6BF1D25Cc7407E4855dF1d46C2043B3Ea',

    // next motion factories are @deprecated
    // we are keeping them here to display history data
    [MotionType.LEGOTopUp]: '0x648C8Be548F43eca4e482C0801Ebccccfb944931',
    [MotionType.GasFunderETHTopUp]:
      '0x41F9daC5F89092dD6061E59578A2611849317dc8',
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
    [MotionType.AllowedRecipientAdd]:
      '0x1dCFc37719A99d73a0ce25CeEcbeFbF39938cF2C',
    [MotionType.AllowedRecipientRemove]:
      '0x00BB68a12180a8f7E20D8422ba9F81c07A19A79E',
    [MotionType.AllowedRecipientTopUp]:
      '0x85d703B2A4BaD713b596c647badac9A1e95bB03d',
    [MotionType.AllowedRecipientAddReferralDai]:
      '0x8F06a7f244F6Bb4B68Cd6dB05213042bFc0d7151',
    [MotionType.AllowedRecipientRemoveReferralDai]:
      '0xd8f9B72Cd97388f23814ECF429cd18815F6352c1',
    [MotionType.AllowedRecipientTopUpReferralDai]:
      '0x009ffa22ce4388d2F5De128Ca8E6fD229A312450',
  },

  // Goerli
  [CHAINS.Goerli]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0xE033673D83a8a60500BcE02aBd9007ffAB587714',
    [MotionType.AllowedRecipientTopUpTrpLdo]:
      '0x43f33C52156d1Fb2eA24d82aBfD342E69835E79f',
    [MotionType.LegoLDOTopUp]: '0xc39Dd5B66968e364D99e0c9E7089049351AB89CA',
    [MotionType.LegoDAITopUp]: '0xbf44eC2b23cA105F8a62e0587900a09A473288c6',
    [MotionType.RccDAITopUp]: '0xd0411e7c4A24E7d4509D5F13AEd19aeb8e5644AB',
    [MotionType.PmlDAITopUp]: '0xc749aD24572263887Bc888d3Cb854FCD50eCCB61',
    [MotionType.AtcDAITopUp]: '0xF4b8b5760EE4b5c5Cb154edd0f0841465d821006',
    [MotionType.StethRewardProgramAdd]:
      '0x785A8B1CDC03Bb191670Ed4696e9ED5B11Af910A',
    [MotionType.StethRewardProgramRemove]:
      '0xEFEa524D1739800fF6F7d2532ED4C8508220239a',
    [MotionType.StethRewardProgramTopUp]:
      '0xF2f7FC1E8879c10D4579Bc82D5FEa923A5a228dE',
    [MotionType.StethGasSupplyAdd]:
      '0xa2286d37Af8F8e84428151bF72922c5Fe5c1EeED',
    [MotionType.StethGasSupplyRemove]:
      '0x48D01979eD9e6CE70a6496B111F5728f9a547C96',
    [MotionType.StethGasSupplyTopUp]:
      '0x960CcA0BE6419e9684796Ce3ABE980E8a2d0cd80',
    [MotionType.RewardsShareProgramAdd]:
      '0x51916FC3D24CbE19c5e981ae8650668A1F5cF19B',
    [MotionType.RewardsShareProgramRemove]:
      '0x932aab3D6057ed2Beef95471414831C4535600E9',
    [MotionType.RewardsShareProgramTopUp]:
      '0x5Bb391170899A7b8455A442cca65078ff3E1639C',
    [MotionType.SDVTNodeOperatorsAdd]:
      '0x69ab4BeD4D136F1e22c6072277BA5E52A246672B',
    [MotionType.SDVTNodeOperatorsActivate]:
      '0x4C0e79308f2E672b9dB9f2E6fD183Ec6025eFc37',
    [MotionType.SDVTNodeOperatorsDeactivate]:
      '0x2b956B578D0f44E0BD484d1A63c8A164BBEf6B58',
    // [MotionType.SDVTVettedValidatorsLimitsSet]:
    //   '0x7f5395AC6Ff3967CEd48e6a99029747B48239b31',
    [MotionType.SDVTTargetValidatorLimitsUpdate]:
      '0x3F65d94E804bfEF570A13FC6923855865098EEB6',
    [MotionType.SDVTNodeOperatorRewardAddressesSet]:
      '0x85350e579C71a78810305f860380a3315b3e6Ed9',
    [MotionType.SDVTNodeOperatorNamesSet]:
      '0xc8b9F2bfFFF2f2B8F9C32A7b39a5AAa0644Fe632',
    [MotionType.SDVTNodeOperatorManagerChange]:
      '0x2Ed0FB58ba7637f972100Db7427614C9E30Ed684',

    // next motion factories are @deprecated
    // we are keeping them here to display history data
    [MotionType.LEGOTopUp]: '0xb2bcf211F103d7F13789394DD475c2274e044C4C',
    [MotionType.GasFunderETHTopUp]: '0x',
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
    [MotionType.AllowedRecipientAdd]:
      '0x3Ef70849FdBEe7b1F0A43179A3f788A8949b8abe',
    [MotionType.AllowedRecipientRemove]:
      '0x6c2e12D9C1d6e3dE146A7519eCbcb79c96Fe3146',
    [MotionType.AllowedRecipientTopUp]:
      '0xD928dC9E4DaBeE939d3237A4f41983Ff5B6308dB',
    [MotionType.AllowedRecipientAddReferralDai]:
      '0x734458219BE229F6631F083ea574EBACa2f9bEaf',
    [MotionType.AllowedRecipientRemoveReferralDai]:
      '0x5FEC0bcd7519C4fE41eca5Fe1dD94345fA100A67',
    [MotionType.AllowedRecipientTopUpReferralDai]:
      '0x9534A77029D57E249c467E5A1E0854cc26Cd75A0',
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
    [motionType]: EvmSupportedChains.reduce((resIn, chainId) => {
      const address = EvmAddressesByChain[chainId][motionType]
      if (!address) {
        return resIn
      }

      return {
        ...resIn,
        [chainId]: address,
      }
    }, {} as { [C in EvmSupportedChain]: EvmAddresses[C][typeof motionType] }),
  }),
  {} as {
    [M in MotionType]: { [C in EvmSupportedChain]: EvmAddresses[C][M] }
  },
)
