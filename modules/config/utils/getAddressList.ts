import { CHAINS } from '@lido-sdk/constants'
import * as addressMaps from 'modules/blockChain/contractAddresses'

const contractAddresses = addressMaps as Record<
  string,
  Record<number, string | string[]>
>

export function getAddressList(chainId: CHAINS): {
  contractName: string
  address: string
}[] {
  const contractNames = Object.keys(addressMaps)
  return contractNames.flatMap(contractName => {
    const addressOrArr = contractAddresses[contractName][chainId]

    if (Array.isArray(addressOrArr)) {
      return addressOrArr.map((address, index) => ({
        contractName: `${contractName}_${index}`,
        address,
      }))
    }

    return {
      contractName,
      address: addressOrArr,
    }
  })
}
