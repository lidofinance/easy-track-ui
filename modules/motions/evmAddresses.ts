import { flow, map, toPairs, fromPairs, mapValues } from 'lodash/fp'
import { CHAINS } from '@lido-sdk/constants'
import { MotionType } from './types'
import { Invert } from 'modules/shared/utils/utilTypes'

const EvmSupportedChains = [CHAINS.Mainnet, CHAINS.Holesky] as const

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
    [MotionType.RccStethTopUp]: '0xcD42Eb8a5db5a80Dc8f643745528DD77cf4C7D35',
    [MotionType.PmlStethTopUp]: '0xc5527396DDC353BD05bBA578aDAa1f5b6c721136',
    [MotionType.AtcStethTopUp]: '0x87b02dF27cd6ec128532Add7C8BC19f62E6f1fB9',
    [MotionType.RccStablesTopUp]: '0x75bDecbb6453a901EBBB945215416561547dfDD4',
    [MotionType.PmlStablesTopUp]: '0x92a27C4e5e35cFEa112ACaB53851Ec70e2D99a8D',
    [MotionType.AtcStablesTopUp]: '0x1843Bc35d1fD15AbE1913b9f72852a79457C42Ab',
    [MotionType.LegoStablesTopUp]: '0x6AB39a8Be67D9305799c3F8FdFc95Caf3150d17c',
    [MotionType.SDVTNodeOperatorsAdd]:
      '0xcAa3AF7460E83E665EEFeC73a7a542E5005C9639',
    [MotionType.SDVTNodeOperatorsActivate]:
      '0xCBb418F6f9BFd3525CE6aADe8F74ECFEfe2DB5C8',
    [MotionType.SDVTNodeOperatorsDeactivate]:
      '0x8B82C1546D47330335a48406cc3a50Da732672E7',
    [MotionType.SDVTVettedValidatorsLimitsSet]:
      '0xD75778b855886Fc5e1eA7D6bFADA9EB68b35C19D',
    [MotionType.SDVTTargetValidatorLimitsUpdate]:
      '0x161a4552a625844c822954c5acbac928ee0f399b',
    [MotionType.SDVTNodeOperatorRewardAddressesSet]:
      '0x589e298964b9181D9938B84bB034C3BB9024E2C0',
    [MotionType.SDVTNodeOperatorNamesSet]:
      '0x7d509BFF310d9460b1F613e4e40d342201a83Ae4',
    [MotionType.SDVTNodeOperatorManagerChange]:
      '0xE31A0599A6772BCf9b2bFc9e25cf941e793c9a7D',
    [MotionType.StonksStethTopUp]: '0x6e04aED774B7c89BB43721AcDD7D03C872a51B69',
    [MotionType.StonksStablesTopUp]:
      '0x0d2aefA542aFa8d9D1Ec35376068B88042FEF5f6',

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
    [MotionType.RccDAITopUp]: '0x84f74733ede9bFD53c1B3Ea96338867C94EC313e',
    [MotionType.PmlDAITopUp]: '0x4E6D3A5023A38cE2C4c5456d3760357fD93A22cD',
    [MotionType.AtcDAITopUp]: '0x67Fb97ABB9035E2e93A7e3761a0d0571c5d7CD07',
    [MotionType.LegoDAITopUp]: '0x0535a67ea2D6d46f85fE568B7EaA91Ca16824FEC',
    [MotionType.AllianceOpsStablesTopUp]:
      '0xe5656eEe7eeD02bdE009d77C88247BC8271e26Eb',
    [MotionType.CSMSettleElStealingPenalty]:
      '0xF6B6E7997338C48Ea3a8BCfa4BB64a315fDa76f4',
  },

  // Holesky
  [CHAINS.Holesky]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0x18Ff3bD97739bf910cDCDb8d138976c6afDB4449',
    [MotionType.AllowedRecipientTopUpTrpLdo]:
      '0xD618F0CF48F057B5256e102dC18d8011e08c19D3',
    [MotionType.LegoLDOTopUp]: '0xCfaFcD35ACcc4383e2CCDf7DD3F58114914F1955',
    [MotionType.StethRewardProgramAdd]:
      '0xf0968B9bE18282dD23bbbC79a1c9C8996CE6984D',
    [MotionType.StethRewardProgramRemove]:
      '0xF0F34b82241cD49BB3952149BD30A08Eb9D8B54E',
    [MotionType.StethRewardProgramTopUp]:
      '0xBB06DD9a3C7eE8cE093860094e769a1E3D6F97F6',
    [MotionType.StethGasSupplyAdd]:
      '0x13dB9E1ddE54d2641f571EA288D9e79C0E8bce2e',
    [MotionType.StethGasSupplyRemove]:
      '0x64CE36D2DC7e7786BF56D2DF8A5F3c788977Fb19',
    [MotionType.StethGasSupplyTopUp]:
      '0xf97E048A952d170d5D5E817C8D9c8253f4D50F96',
    [MotionType.RewardsShareProgramAdd]:
      '0x49D3211203e8E18B4e60F74C1126934da2520987',
    [MotionType.RewardsShareProgramRemove]:
      '0x112c48c4659A9a1d42a3e45EBc8e37B6150F2B0C',
    [MotionType.RewardsShareProgramTopUp]:
      '0x089bc04630c056D76fF4Ec172e752A7d5B855e16',

    [MotionType.SDVTNodeOperatorsAdd]:
      '0xeF5233A5bbF243149E35B353A73FFa8931FDA02b',
    [MotionType.SDVTNodeOperatorsActivate]:
      '0x5b4A9048176D5bA182ceec8e673D8aA6927A40D6',
    [MotionType.SDVTNodeOperatorsDeactivate]:
      '0x88d247cdf4ff4A4AAA8B3DD9dd22D1b89219FB3B',
    [MotionType.SDVTVettedValidatorsLimitsSet]:
      '0x30Cb36DBb0596aD9Cf5159BD2c4B1456c18e47E8',
    [MotionType.SDVTTargetValidatorLimitsUpdate]:
      '0x431a156BEba95803a95452441C1959c4479710e1',
    [MotionType.SDVTNodeOperatorRewardAddressesSet]:
      '0x6Bfc576018C7f3D2a9180974E5c8e6CFa021f617',
    [MotionType.SDVTNodeOperatorNamesSet]:
      '0x4792BaC0a262200fA7d3b68e7622bFc1c2c3a72d',
    [MotionType.SDVTNodeOperatorManagerChange]:
      '0xb8C4728bc0826bA5864D02FA53148de7A44C2f7E',

    [MotionType.SandboxNodeOperatorIncreaseLimit]:
      '0xbD37e55748c6f4Ece637AeD3e278e7575346B587',
    [MotionType.SandboxStablesAdd]:
      '0xB238fB1e7c8da5da022140dA956Fc3052808fC56',
    [MotionType.SandboxStablesRemove]:
      '0x51c730af05777c4D3CcC8c8B80558F4D155bb7BF',
    [MotionType.SandboxStablesTopUp]:
      '0x71bcEf1f4E4945005e1D22d68F02085D5167ab43',
    [MotionType.RccStethTopUp]: '0xe3bCa174A8b031C61a58aa56a0f622D4FFCA47d7',
    [MotionType.PmlStethTopUp]: '0x8612A51e4914FfFb25D96d1A310D4C6342c2091E',
    [MotionType.AtcStethTopUp]: '0x1395970895282333dC914172944f52F15Df63620',
    [MotionType.LegoStablesTopUp]: '0x7Bb5C5965a63aFb6a05D19bB03e3f170E2d7d684',
    [MotionType.RccStablesTopUp]: '0xD497E7e039FeFBc64dBB7b75368afb06D07Bc73F',
    [MotionType.PmlStablesTopUp]: '0x5BAE56ECfB616eAbbDB048AC930FA1Db82f18900',
    [MotionType.AtcStablesTopUp]: '0xfa54cf78474cD4A7f4408Dd0efA36e44b6269813',
    [MotionType.StonksStethTopUp]: '0x1240775f1857fB8317bD9ba63f4A8A6A78D9af06',
    [MotionType.StonksStablesTopUp]:
      '0x65A9913467A9793Bb23726d72C99A470bb9294Ad',
    [MotionType.CSMSettleElStealingPenalty]:
      '0x07696EA8A5b53C3E35d9cce10cc62c6c79C4691D',
    [MotionType.AllianceOpsStablesTopUp]:
      '0x343FA5F0C79277E2d27e440F40420D619F962A23',

    // next motion factories are @deprecated
    // we are keeping them here to display history data
    [MotionType.LEGOTopUp]: '',
    [MotionType.GasFunderETHTopUp]: '0x',
    [MotionType.RewardProgramAdd]: '',
    [MotionType.RewardProgramRemove]: '',
    [MotionType.RewardProgramTopUp]: '',
    [MotionType.ReferralPartnerAdd]: '',
    [MotionType.ReferralPartnerRemove]: '',
    [MotionType.ReferralPartnerTopUp]: '',
    [MotionType.AllowedRecipientAdd]: '',
    [MotionType.AllowedRecipientRemove]: '',
    [MotionType.AllowedRecipientTopUp]: '',
    [MotionType.AllowedRecipientAddReferralDai]: '',
    [MotionType.AllowedRecipientRemoveReferralDai]: '',
    [MotionType.AllowedRecipientTopUpReferralDai]: '',
    [MotionType.LegoDAITopUp]: '0xBCcfe42cc3EF530db9888dC8F82B1B4A4DfB9DB4',
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
