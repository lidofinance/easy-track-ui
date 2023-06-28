import { useSupportedChains, useConnectorError } from 'reef-knot/web3-react'
import { CHAINS } from '@lido-sdk/constants'
import { useMemo } from 'react'

export const useErrorMessage = (): string | undefined => {
  const error = useConnectorError()
  const { isUnsupported, supportedChains } = useSupportedChains()

  const chains = useMemo(() => {
    const chainNames = supportedChains.map(
      ({ chainId, name }) => CHAINS[chainId] || name,
    )
    const lastChain = chainNames.pop()
    const chainsArray = [chainNames.join(', '), lastChain]

    return chainsArray.filter(chain => chain).join(' or ')
  }, [supportedChains])

  if (isUnsupported) {
    return `Unsupported chain. Please switch to ${chains} in your wallet`
  }

  return error?.message
}
