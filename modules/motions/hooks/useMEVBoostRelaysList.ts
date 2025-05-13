import { useLidoSWR } from '@lido-sdk/react'
import { ContractMEVBoostRelayList } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export const useMEVBoostRelaysList = () => {
  const { chainId } = useWeb3()
  const mevBoostRelayList = ContractMEVBoostRelayList.useRpc()

  return useLidoSWR(
    `mev-boost-relays-list-${chainId}`,
    async () => {
      const relays = await mevBoostRelayList.get_relays()

      return relays.map(relay => ({
        uri: relay.uri,
        name: relay.operator,
        isMandatory: relay.is_mandatory,
        description: relay.description,
      }))
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
