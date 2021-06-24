import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'

const POLLING_INTERVAL = 12000

function getLibrary(provider: ConstructorParameters<typeof Web3Provider>[0]) {
  const library = new Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}

type Props = {
  children?: React.ReactNode
}

export const Web3AppProvider = ({ children }: Props) => (
  <Web3ReactProvider getLibrary={getLibrary} children={children} />
)
