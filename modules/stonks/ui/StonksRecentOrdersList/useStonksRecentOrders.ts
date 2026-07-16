import { StonksAbi__factory, StonksOrderAbi__factory } from 'generated'
import { Stonks } from 'modules/blockChain/contractAddresses'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { getLimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'
import { GET_LOG_BLOCK_LIMIT } from 'modules/config'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useConnectErc20Contract } from 'modules/motions/hooks/useConnectErc20Contract'
import { useSWR } from 'modules/network/hooks/useSwr'

export const useStonksRecentOrders = () => {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()
  const connectErc20Contract = useConnectErc20Contract()

  return useSWR(`stonks-recent-orders-${chainId}`, async () => {
    const stonksContracts = Stonks[chainId]
    if (!stonksContracts) return []
    const provider = getLimitedJsonRpcBatchProvider(chainId, getRpcUrl(chainId))
    const blockNumber = await provider.getBlockNumber()
    const results = await Promise.all(
      stonksContracts.map(async contractAddress => {
        const contract = StonksAbi__factory.connect(contractAddress, provider)
        const filter = contract.filters.OrderContractCreated()
        const events = await contract.queryFilter(
          filter,
          blockNumber - GET_LOG_BLOCK_LIMIT,
          blockNumber,
        )

        return events.map(event => ({
          orderAddress: event.args.orderContract,
          stonksAddress: contractAddress,
        }))
      }),
    )

    return Promise.all(
      results.flat().map(async ({ orderAddress, stonksAddress }) => {
        const orderContract = StonksOrderAbi__factory.connect(
          orderAddress,
          provider,
        )
        const details = await orderContract.getOrderDetails()
        const tokenToContract = connectErc20Contract(details.tokenTo_)
        const tokenFromContract = connectErc20Contract(details.tokenFrom_)
        const [tokenToLabel, tokenFromLabel] = await Promise.all([
          tokenToContract.symbol(),
          tokenFromContract.symbol(),
        ])

        return {
          address: orderAddress,
          stonksAddress,
          tokenFromLabel,
          tokenToLabel,
        }
      }),
    )
  })
}
