import type { Signer } from '@ethersproject/abstract-signer'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Chains } from 'modules/blockChain/chains'
import { getRpcUrl } from 'modules/blockChain/utils/getRpcUrls'
import * as contracts from 'modules/blockChain/contracts'
import { TOKENS } from '../tokens'

const TOKEN_CONTRACT_CONNECTORS = {
  // [TOKENS.wsteth]: contracts.connectWSTETH,
  // [TOKENS.steth]: contracts.connectSTETH,
  // [TOKENS.weth]: contracts.connectWETH,
  [TOKENS.ldo]: contracts.connectLDO,
  // [TOKENS.ldopl]: contracts.LDOPL,
} as const

type ConnectorsList = typeof TOKEN_CONTRACT_CONNECTORS
export type ContractByToken<T extends TOKENS> = ReturnType<ConnectorsList[T]>

const getContractConnector = <T extends TOKENS>(token: T) => {
  if (!TOKEN_CONTRACT_CONNECTORS.hasOwnProperty(token)) {
    throw new Error(`Token connector not found for ${token}`)
  }
  return TOKEN_CONTRACT_CONNECTORS[token]
}

export const getTokenContractRpc = <T extends TOKENS>(
  chainId: Chains,
  token: T,
): ContractByToken<T> => {
  const connect = getContractConnector(token)
  const library = new JsonRpcProvider(getRpcUrl(chainId), chainId)
  return connect({ chainId, library }) as ContractByToken<T>
}

export const getTokenContractWeb3 = <T extends TOKENS>(
  chainId: Chains,
  token: T,
  library?: { getSigner: () => Signer } | null,
): ContractByToken<T> | null => {
  if (!library) return null
  const connect = getContractConnector(token)
  return connect({
    chainId,
    library: library.getSigner(),
  }) as ContractByToken<T>
}
