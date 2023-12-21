import { CHAINS } from '@lido-sdk/constants'
import { Factory } from '@lido-sdk/contracts'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { BaseContract } from 'ethers'
import { getBackendRpcUrl } from 'modules/blockChain/utils/getBackendRpcUrl'

export function connectContractRpc<T extends BaseContract>(
  contractFactory: Factory<T>,
  contractAddress: string,
  chainId: CHAINS,
): T {
  const library = getStaticRpcBatchProvider(chainId, getBackendRpcUrl(chainId))

  return contractFactory.connect(contractAddress, library)
}
