import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import {
  ContractFinance,
  ContractAragonAcl,
  ContractEVMScriptExecutor,
} from 'modules/blockChain/contracts'

import { utils, constants } from 'ethers'
import { Big } from 'modules/shared/utils/bigNumber'

// Data structure reference
// https://github.com/lidofinance/scripts/blob/2a30b9654abc90b20debf837f99cd02f248d6644/scripts/setup_easytrack_limits.py#L67-L100
const TOKEN_INDEXES = [
  // LDO
  1,
  // ETH
  4,
  // DAI
  7,
  // STETH
  10,
  // USDC
  13,
  // USDT
  16,
]

export const useTransitionLimits = () => {
  const { chainId } = useWeb3()

  const result = useSWR<Record<string, number | undefined>>(
    `permission-param-${chainId}`,
    async () => {
      const contractFinance = ContractFinance.connectRpc({ chainId })
      const contractAragonAcl = ContractAragonAcl.connectRpc({ chainId })
      const evmScriptExecutorAddress =
        ContractEVMScriptExecutor.address[chainId]!

      const role = await contractFinance.CREATE_PAYMENTS_ROLE()

      const paramsLength = await contractAragonAcl.getPermissionParamsLength(
        evmScriptExecutorAddress,
        contractFinance.address,
        role,
      )

      const paramRequests = Array.from(Array(Number(paramsLength))).map(
        (_, i) => {
          return contractAragonAcl.getPermissionParam(
            evmScriptExecutorAddress,
            contractFinance.address,
            role,
            i,
          )
        },
      )

      const params = await Promise.all(paramRequests)

      const limits = TOKEN_INDEXES.reduce((acc, index) => {
        const rawAddress: string | undefined =
          // literal definition because params[4][2].toHexString() === '0x00
          index === 4 ? constants.AddressZero : params[index]?.[2].toHexString()
        const address = rawAddress ? utils.getAddress(rawAddress) : null

        if (address) {
          acc[address] = new Big(Number(params[index + 1][2]))
            .div(10 ** 18)
            .toNumber()
        }
        return acc
      }, {} as Record<string, number | undefined>)

      return limits
    },
  )

  return result
}
