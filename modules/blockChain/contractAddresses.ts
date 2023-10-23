import { CHAINS } from '@lido-sdk/constants'
import type { ChainAddressMap } from './types'

export const NodeOperatorsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5',
  [CHAINS.Goerli]: '0x9D4AF1Ee19Dad8857db3a45B0374c81c8A1C6320',
  [CHAINS.Holesky]: '0x595F64Ddc3856a3b5Ff4f4CC1d1fb4B46cFd2bAC',
}

export const EasyTrack: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xF0211b7660680B49De1A7E9f25C65660F0a13Fea',
  [CHAINS.Goerli]: '0xAf072C8D368E4DD4A9d4fF6A76693887d6ae92Af',
  [CHAINS.Holesky]: '0x1763b9ED3586B08AE796c7787811a2E1bc16163a',
}

export const GovernanceToken: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
  [CHAINS.Goerli]: '0x56340274fB5a72af1A3C6609061c451De7961Bd4',
  [CHAINS.Holesky]: '0x14ae7daeecdf57034f3E9db8564e46Dba8D97344',
}

export const RewardProgramRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3129c041b372ee93a5a8756dc4ec6f154d85bc9a',
  [CHAINS.Goerli]: '0x28a08f61AE129d0d8BD4380Ae5647e7Add0527ca',
}

export const ReferralPartnersRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xfCaD241D9D2A2766979A2de208E8210eDf7b7D4F',
  [CHAINS.Goerli]: '0x4CB0c9987fd670069e4b24c653981E86b261A2ca',
}

export const STETH: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  [CHAINS.Goerli]: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
  [CHAINS.Holesky]: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
}

export const DAI: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  [CHAINS.Goerli]: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
}

export const Finance: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xB9E5CBB9CA5b0d659238807E84D0176930753d86',
  [CHAINS.Goerli]: '0x75c7b1D23f1cad7Fb4D60281d7069E46440BC179',
  [CHAINS.Holesky]: ' 0xf0F281E5d7FBc54EAFcE0dA225CDbde04173AB16',
}

export const AllowedRecipientRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xAa47c268e6b2D4ac7d7f7Ffb28A39484f5212c2A',
  [CHAINS.Goerli]: '0xaDA19288575f611A6487365f0fE2A742a90BB2C6',
}

export const AllowedRecipientReferralDaiRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xa295C212B44a48D07746d70d32Aa6Ca9b09Fb846',
  [CHAINS.Goerli]: '0x8fB566b1e78e603a86b97ada5FcA858764dF4088',
}

export const AllowedRecipientTrpLdoRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x231Ac69A1A37649C6B06a71Ab32DdD92158C80b8',
  [CHAINS.Goerli]: '0x8C96a6522aEc036C4a384f8B7e05D93d6f3Dae39',
}

export const LegoLDORegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x97615f72c3428A393d65A84A3ea6BBD9ad6C0D74',
  [CHAINS.Goerli]: '0x6342213719839c56fEe817539863aFB9821B03cb',
}

export const LegoDAIRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xb0FE4D300334461523D9d61AaD90D0494e1Abb43',
  [CHAINS.Goerli]: '0x5884f5849414D4317d175fEc144e2F87f699B082',
}

export const RccDAIRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xDc1A0C7849150f466F07d48b38eAA6cE99079f80',
  [CHAINS.Goerli]: '0x1440E8aDbE3a42a9EDB4b30059df8F6c35205a15',
}

export const PmlDAIRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xDFfCD3BF14796a62a804c1B16F877Cf7120379dB',
  [CHAINS.Goerli]: '0xAadfBd1ADE92d85c967f4aE096141F0F802F46Db',
}

export const AtcDAIRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xe07305F43B11F230EaA951002F6a55a16419B707',
  [CHAINS.Goerli]: '0xedD3B813275e1A88c2283FAfa5bf5396938ef59e',
}

export const gasFunderETHRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xCf46c4c7f936dF6aE12091ADB9897E3F2363f16F',
  [CHAINS.Goerli]: '0x0000000000000000000000000000000000000000',
  [CHAINS.Holesky]: '0x0000000000000000000000000000000000000000',
}

export const StethRewardProgramRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x48c4929630099b217136b64089E8543dB0E5163a',
  [CHAINS.Goerli]: '0x78797efCca6C537BF92FA6b25cBb14A6f1c128A0',
}

export const StethGasSupplyRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x49d1363016aA899bba09ae972a1BF200dDf8C55F',
  [CHAINS.Goerli]: '0xF08a5f00824D4554a1FBebaE726609418dc819fb',
}

export const AragonACL: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb',
  [CHAINS.Goerli]: '0xb3cf58412a00282934d3c3e73f49347567516e98',
  [CHAINS.Holesky]: '0xfd1E42595CeC3E83239bf8dFc535250e7F48E0bC',
}

export const EVMScriptExecutor: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xF0211b7660680B49De1A7E9f25C65660F0a13Fea',
  [CHAINS.Goerli]: '0x3c9AcA237b838c59612d79198685e7f20C7fE783',
  [CHAINS.Holesky]: '0x2819B65021E13CEEB9AC33E77DB32c7e64e7520D',
}

export const RewardsShareProgramRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xdc7300622948a7AdaF339783F6991F9cdDD79776',
  [CHAINS.Goerli]: '0x8b59609f4bEa230E565Ae0C3C7b6913746Df1cF2',
}

export const SDVTRegistry: ChainAddressMap = {
  [CHAINS.Goerli]: '0x6370FA71b9Fd83aFC4196ee189a0d348C90E93b0',
}
