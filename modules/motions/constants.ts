import { CHAINS } from '@lido-sdk/constants'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'

export const MOTION_ATTENTION_PERIOD = 1 / 24

// https://snapshot.org/#/lido-snapshot.eth/proposal/0x75b331e650af1dc6bc98d4e705cfe19c74c55c02a53ad2ae85e207c6004ce847
export const TRANSITION_LIMITS = [
  CHAINS.Mainnet,
  CHAINS.Rinkeby,
  CHAINS.Goerli,
].reduce(
  (res, chain) => ({
    ...res,
    [chain]: {
      '0x0000000000000000000000000000000000000000': 1000,
      [CONTRACT_ADDRESSES.STETH[chain]]: 1000,
      [CONTRACT_ADDRESSES.GovernanceToken[chain]]: 5000000,
    },
  }),
  {} as Record<CHAINS, Record<string, number>>,
)

export const tokenLimitError = (
  governanceSymbol: string | undefined,
  transitionLimit: number,
) =>
  `${governanceSymbol} transition is limited by ${transitionLimit.toLocaleString()}`

export const periodLimitError = (
  governanceSymbol: string | undefined,
  transitionLimit: number,
) =>
  `Insuffisient motion top-up limit. Amount available for the program ${transitionLimit.toLocaleString()} ${governanceSymbol} `
