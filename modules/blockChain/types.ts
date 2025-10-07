import { ContractTransaction } from '@ethersproject/contracts'
import * as TypeChain from 'generated'
import { CHAINS } from './chains'

export type SafeTx = {
  safeTxHash: string
}

export type ResultTx =
  | {
      type: 'safe'
      tx: SafeTx
    }
  | {
      type: 'regular'
      tx: ContractTransaction
    }

export type TxStatus = 'empty' | 'pending' | 'failed' | 'success'

export type ChainAddressMap = Partial<Record<CHAINS, string>>

export type ChainAddressListMap = Partial<Record<CHAINS, string[]>>

export type ContractTypeEasyTrack = TypeChain.EasyTrackAbi

export type ContractTypeReferralPartnersRegistry =
  TypeChain.ReferralPartnersRegistryAbi
export type ContractTypeAllowedRecipientRegistry =
  TypeChain.AllowedRecipientsRegistryAbi
export type ContractTypeRegistryWithLimits = TypeChain.RegistryWithLimitsAbi
