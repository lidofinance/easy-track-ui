import { Chains } from 'modules/blockChain/chains'
import {
  contractAddressesLDO,
  contractAddressesSTETH,
} from 'modules/blockChain/contractAddresses'

export const getLegoTokenOptions = (chainId: Chains) => [
  {
    label: 'ETH',
    value: '0x0000000000000000000000000000000000000000',
  },
  {
    label: 'LDO',
    value: contractAddressesLDO[chainId],
  },
  {
    label: 'stETH',
    value: contractAddressesSTETH[chainId],
  },
]
