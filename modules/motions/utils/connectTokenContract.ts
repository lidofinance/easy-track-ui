import { CHAINS } from '@lido-sdk/constants'
import { getStaticRpcBatchProvider } from '@lido-sdk/providers'
import { Erc20Abi__factory } from 'generated'
import { getBackendRpcUrl } from 'modules/blockChain/utils/getBackendRpcUrl'

export function connectERC20Contract(contractAddress: string, chainId: CHAINS) {
  const library = getStaticRpcBatchProvider(chainId, getBackendRpcUrl(chainId))

  return Erc20Abi__factory.connect(contractAddress, library)
}
