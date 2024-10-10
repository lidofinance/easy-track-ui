import { CHAINS } from '@lido-sdk/constants'
import type { ChainAddressMap, ChainAddressListMap } from './types'

export const NodeOperatorsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5',
  [CHAINS.Holesky]: '0x595F64Ddc3856a3b5Ff4f4CC1d1fb4B46cFd2bAC',
}

export const EasyTrack: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xF0211b7660680B49De1A7E9f25C65660F0a13Fea',
  [CHAINS.Holesky]: '0x1763b9ED3586B08AE796c7787811a2E1bc16163a',
}

export const GovernanceToken: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
  [CHAINS.Holesky]: '0x14ae7daeecdf57034f3E9db8564e46Dba8D97344',
}

export const RewardProgramRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3129c041b372ee93a5a8756dc4ec6f154d85bc9a',
}

export const ReferralPartnersRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xfCaD241D9D2A2766979A2de208E8210eDf7b7D4F',
}

export const STETH: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  [CHAINS.Holesky]: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
}

export const DAI: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  [CHAINS.Holesky]: '0x2eb8e9198e647f80ccf62a5e291bcd4a5a3ca68c',
}

export const Finance: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xB9E5CBB9CA5b0d659238807E84D0176930753d86',
  [CHAINS.Holesky]: '0xf0F281E5d7FBc54EAFcE0dA225CDbde04173AB16',
}

export const AllowedRecipientRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xAa47c268e6b2D4ac7d7f7Ffb28A39484f5212c2A',
}

export const AllowedRecipientReferralDaiRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xa295C212B44a48D07746d70d32Aa6Ca9b09Fb846',
}

export const AllowedRecipientTrpLdoRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x231Ac69A1A37649C6B06a71Ab32DdD92158C80b8',
  [CHAINS.Holesky]: '0x5f4E9A917d6556dB91Cf351f49b0edCc5A255bAE',
}

export const LegoLDORegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x97615f72c3428A393d65A84A3ea6BBD9ad6C0D74',
  [CHAINS.Holesky]: '0x77CF728329920E4191a6Edd9b009cD055D3cD29A',
}

export const LegoStablesRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xb0FE4D300334461523D9d61AaD90D0494e1Abb43',
  [CHAINS.Holesky]: '0x10Ff9c02C65775379D9E20BFF9AC92Cbaf15Ab8F',
}

export const RccStablesRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xDc1A0C7849150f466F07d48b38eAA6cE99079f80',
  [CHAINS.Holesky]: '0x17Ab17290bcDbea381500525A58e16e29093523c',
}

export const PmlStablesRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xDFfCD3BF14796a62a804c1B16F877Cf7120379dB',
  [CHAINS.Holesky]: '0x580B23a97F827F2b6E51B3DEc270Ef522Ccf520c',
}

export const AtcStablesRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xe07305F43B11F230EaA951002F6a55a16419B707',
  [CHAINS.Holesky]: '0x37675423796D39C19351c5C322C3692b23a3d9bd',
}

export const gasFunderETHRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xCf46c4c7f936dF6aE12091ADB9897E3F2363f16F',
  [CHAINS.Holesky]: '0x0000000000000000000000000000000000000000',
}

export const StethRewardProgramRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x48c4929630099b217136b64089E8543dB0E5163a',
  [CHAINS.Holesky]: '0x55B304a585D540421F1fD3579Ef12Abab7304492',
}

export const StethGasSupplyRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x49d1363016aA899bba09ae972a1BF200dDf8C55F',
  [CHAINS.Holesky]: '0x1B68a7BeE396e2eaAD9D2716E0A271A4BB568BCd',
}

export const AragonACL: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb',
  [CHAINS.Holesky]: '0xfd1E42595CeC3E83239bf8dFc535250e7F48E0bC',
}

export const EVMScriptExecutor: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977',
  [CHAINS.Holesky]: '0x2819B65021E13CEEB9AC33E77DB32c7e64e7520D',
}

export const RewardsShareProgramRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xdc7300622948a7AdaF339783F6991F9cdDD79776',
  [CHAINS.Holesky]: '0xAc2F596191c75B77c2835Afe83c3a9097f0AC071',
}

export const SDVTRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433',
  [CHAINS.Holesky]: '0x11a93807078f8BB880c1BD0ee4C387537de4b4b6',
}

export const SandboxNodeOperatorsRegistry: ChainAddressMap = {
  [CHAINS.Holesky]: '0xD6C2ce3BB8bea2832496Ac8b5144819719f343AC',
}

export const AllowedTokensRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x4AC40c34f8992bb1e5E856A448792158022551ca',
  [CHAINS.Holesky]: '0x091c0ec8b4d54a9fcb36269b5d5e5af43309e666',
}

export const SandboxStablesAllowedRecipientRegistry: ChainAddressMap = {
  [CHAINS.Holesky]: '0xF8a63a36B954D72de197097377aa00C238c653Cf',
}

export const RccStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xAAC4FcE2c5d55D1152512fe5FAA94DB267EE4863',
  [CHAINS.Holesky]: '0x916B909300c4aB5ADC4247cebd840C9278683e78',
}

export const PmlStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x7b9B8d00f807663d46Fb07F87d61B79884BC335B',
  [CHAINS.Holesky]: '0xC2Ec8a9285D111de54725FAD1AC6a3B7E3BC6225',
}

export const AtcStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xd3950eB3d7A9B0aBf8515922c0d35D13e85a2c91',
  [CHAINS.Holesky]: '0x955bA61676dAd6091Ff3F9BC498219D6DbD49107',
}

export const Stonks: ChainAddressListMap = {
  [CHAINS.Mainnet]: [
    '0x3e2D251275A92a8169A3B17A2C49016e2de492a7',
    '0xf4F6A03E3dbf0aA22083be80fDD340943d275Ea5',
    '0x7C2a1E25cA6D778eCaEBC8549371062487846aAF',
    '0x79f5E20996abE9f6a48AF6f9b13f1E55AED6f06D',
    '0x8Ba6D367D15Ebc52f3eBBdb4a8710948C0918d42',
    '0x281e6BB6F26A94250aCEb24396a8E4190726C97e',
    '0x64B6aF9A108dCdF470E48e4c0147127F26221A7C',
    '0x278f7B6CBB3Cc37374e6a40bDFEBfff08f65A5C7',
    '0x2B5a3944A654439379B206DE999639508bA2e850',
  ],
  [CHAINS.Holesky]: [
    '0x7949418C1C8a45b453114568fD3a5526100Eb0D9',
    '0x1939e7466c21703620F672D994ad1Df03d418B66',
    '0x28b91E39A7E67C473d7886BD1284231e99bE7939',
    '0x1305492Fd4677349Ca335EaD9127D2BDEAD7fd6f',
    '0xeFd6014CbE75D782Cd672e8A1a7bA6FCAB0572EC',
    '0x43E190221729c223B453d75ADC8548679EcC222a',
    '0x8f86792A0C1F1AecF87C5e4E2f01fCAF3E9360a0',
    '0xDCBC0AE0141aEdEec14e418a173A6b3fA3724AE4',
    '0x507D0971ffd5de64Ba1fb30Ee6Bb93376035DD00',
  ],
}

export const StonksStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x1a7cFA9EFB4D5BfFDE87B0FaEb1fC65d653868C0',
  [CHAINS.Holesky]: '0x4283839a5a92A3A6ed39E48cAD5e4c180b97800B',
}

export const StonksStablesAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3f0534CCcFb952470775C516DC2eff8396B8A368',
  [CHAINS.Holesky]: '0xDd553C1F88EDCFc2033141Cb908eFf9189988A90',
}

export const CSMRegistry: ChainAddressMap = {
  [CHAINS.Holesky]: '0x4562c3e63c2e586cd1651b958c22f88135acad4f',
}

export const AllianceOpsAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3b525f4c059f246ca4aa995d21087204f30c9e2f',
  [CHAINS.Holesky]: '0xe1ba8dee84a4df8e99e495419365d979cdb19991',
}
