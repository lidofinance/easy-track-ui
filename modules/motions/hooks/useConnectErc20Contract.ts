import { getLimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'
import { Erc20Abi__factory } from 'generated'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useCallback } from 'react'

export const useConnectErc20Contract = () => {
  const { chainId } = useWeb3()
  const { getRpcUrl } = useConfig()

  return useCallback(
    (address: string) => {
      const library = getLimitedJsonRpcBatchProvider(
        chainId,
        getRpcUrl(chainId),
      )

      return Erc20Abi__factory.connect(address, library)
    },
    [chainId, getRpcUrl],
  )
}
