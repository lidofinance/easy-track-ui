import { CHAINS, parseChainId } from 'modules/blockChain/chains'

const COWSWAP_API_ENDPOINTS: Partial<Record<CHAINS, string | undefined>> = {
  [CHAINS.Mainnet]: 'https://api.cow.fi/mainnet/api/v1',
  [CHAINS.Goerli]: 'https://api.cow.fi/goerli/api/v1',
}

type Args = {
  chainId: string | string[] | CHAINS | undefined
  url: string
  method: 'GET' | 'POST'
  body?: BodyInit | null
}

export const fetchCowApi = async <T extends unknown>({
  chainId,
  url,
  method,
  body,
}: Args) => {
  const parsedChainId = parseChainId(String(chainId))

  const cowApiEndpoint = COWSWAP_API_ENDPOINTS[parsedChainId]

  if (!cowApiEndpoint) {
    throw new Error(`NO_CHAIN_${parsedChainId}`)
  }

  const requested = await fetch(`${cowApiEndpoint}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 0,
    },
    body,
  } as any)

  const data = await requested.json()

  if (requested.ok) {
    return data as T
  }

  throw new Error(data?.description || 'UNKNOWN_ERROR')
}
