import { get } from 'lodash'
import { CHAINS } from '@lido-sdk/constants'
import type { ContractTypeSingleAllowedRecipientRegistry } from 'modules/blockChain/contracts'

type SingleAllowedRecipientAddedEvent = [string, string] & {
  _recipient: string
  _title: string
  _evmScriptFactory: string
  _evmScriptCallData: string
  _evmScript: string
}

const FROM_BLOCK = {
  [CHAINS.Mainnet]: 13676800,
}

export async function getEventsSingleAllowedRecipientAdded(
  chainId: CHAINS,
  motionContract: ContractTypeSingleAllowedRecipientRegistry,
) {
  const filter = motionContract.filters.RecipientAdded()
  const events = await motionContract.queryFilter(
    filter,
    get(FROM_BLOCK, chainId, undefined),
  )
  return events.map(e =>
    e.decode!(e.data, e.topics),
  ) as SingleAllowedRecipientAddedEvent[]
}
