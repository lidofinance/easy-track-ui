import { get } from 'lodash'
import { CHAINS } from '@lido-sdk/constants'
import type {
  ContractTypeAllowedRecipientRegistry,
  ContractTypeRegistryWithLimits,
} from 'modules/blockChain/contracts'

const FROM_BLOCK = {
  [CHAINS.Mainnet]: 13676800,
}

export async function getEventsRecipientAdded(
  chainId: CHAINS,
  motionContract:
    | ContractTypeRegistryWithLimits
    | ContractTypeAllowedRecipientRegistry,
) {
  const filter = motionContract.filters.RecipientAdded()
  const events = await motionContract.queryFilter(
    filter,
    get(FROM_BLOCK, chainId, undefined),
  )
  const parsedEvents = events
    .sort((a, b) => b.blockNumber - a.blockNumber)
    .map(event => ({
      title: event.args._title,
      address: event.args._recipient,
    }))

  return parsedEvents
}
