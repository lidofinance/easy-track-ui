import { Chains } from 'modules/blockChain/chains'
import * as CONTRACT_ADDRESSES from 'modules/blockChain/contractAddresses'

export const getLegoTokenOptions = (chainId: Chains) => [
  {
    label: 'ETH',
    value: '0x0000000000000000000000000000000000000000',
  },
  {
    label: 'LDO',
    value: CONTRACT_ADDRESSES.LDO[chainId],
  },
  {
    label: 'stETH',
    value: CONTRACT_ADDRESSES.STETH[chainId],
  },
]
