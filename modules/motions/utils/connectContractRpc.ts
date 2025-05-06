import { CHAINS } from '@lido-sdk/constants'
import { Factory } from '@lido-sdk/contracts'
import { getJsonRpcBatchProvider } from 'modules/blockChain/utils/limitedJsonRpcBatchProvider'
import { BaseContract } from 'ethers'

export function connectContractRpc<T extends BaseContract>(
  contractFactory: Factory<T>,
  contractAddress: string,
  chainId: CHAINS,
  rpcUrl: string,
): T {
  const library = getJsonRpcBatchProvider(chainId, rpcUrl)

  return contractFactory.connect(contractAddress, library)
}
