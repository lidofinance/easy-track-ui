import { CHAINS } from 'modules/blockChain/chains'
import { getLimitedJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'
import { BaseContract } from 'ethers'
import { Provider } from '@ethersproject/providers'
import { Signer } from '@ethersproject/abstract-signer'

/**
 *  Local copy of the same type form the "@lido-sdk/contracts"
 */
interface Factory<C extends BaseContract> {
  connect(address: string, signerOrProvider: Signer | Provider): C
}

export function connectContractRpc<T extends BaseContract>(
  contractFactory: Factory<T>,
  contractAddress: string,
  chainId: CHAINS,
  rpcUrl: string,
): T {
  const provider = getLimitedJsonRpcBatchProvider(chainId, rpcUrl)

  return contractFactory.connect(contractAddress, provider)
}
