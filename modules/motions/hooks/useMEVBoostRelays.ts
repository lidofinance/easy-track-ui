import { useLidoSWR } from '@lido-sdk/react'
import { ContractMEVBoostRelayList } from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

export const useMEVBoostRelays = () => {
  const { chainId } = useWeb3()
  const mevBoostRelayListContract = ContractMEVBoostRelayList.useRpc()

  const result = useLidoSWR(
    `mev-boost-relays-list-${chainId}`,
    async () => {
      const relays = await mevBoostRelayListContract.get_relays()

      const parsedRelaysList = relays.map(relay => {
        return {
          uri: relay.uri,
          name: relay.operator,
          isMandatory: relay.is_mandatory,
          description: relay.description,
        }
      })

      const relaysMap = new Map(
        parsedRelaysList.map(relay => {
          return [relay.uri, relay]
        }),
      )

      return {
        relaysList: parsedRelaysList,
        relaysMap: relaysMap,
        relaysCount: relays.length,
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    relaysList: result.data?.relaysList,
    relaysMap: result.data?.relaysMap,
    relaysCount: result.data?.relaysCount ?? 0,
    error: result.error,
    isRelaysDataLoading: result.initialLoading,
  }
}
