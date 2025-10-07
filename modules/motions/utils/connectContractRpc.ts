import { BaseContract } from 'ethers'
import { Factory } from 'modules/blockChain/utils/createContractHelpers'
import { Provider } from '@ethersproject/providers'

export function connectContractRpc<T extends BaseContract>(
  contractFactory: Factory<T>,
  contractAddress: string,
  rpcProvider: Provider,
): T {
  return contractFactory.connect(contractAddress, rpcProvider)
}
