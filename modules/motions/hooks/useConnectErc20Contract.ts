import { Erc20Abi__factory } from 'generated'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useCallback } from 'react'

export const useConnectErc20Contract = () => {
  const { rpcProvider } = useWeb3()

  return useCallback(
    (address: string) => {
      return Erc20Abi__factory.connect(address, rpcProvider)
    },
    [rpcProvider],
  )
}
