import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import {
  ContractFinance,
  ContractAragonAcl,
  ContractEVMScriptExecutor,
} from 'modules/blockChain/contracts'

import { BigNumber, utils } from 'ethers'
import { Big } from 'modules/shared/utils/bigNumber'

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

      const decodeLimit = (val: BigNumber) =>
        new Big(Number(val)).div(10 ** 18).toNumber()

      // Data structure reference
      // https://github.com/lidofinance/scripts/blob/2a30b9654abc90b20debf837f99cd02f248d6644/scripts/setup_easytrack_limits.py#L67-L100
      const LDO = utils.getAddress(params[1][2].toHexString())
      const ETH = '0x0000000000000000000000000000000000000000' // literal definition because params[4][2].toHexString() === '0x00
      const DAI = utils.getAddress(params[7][2].toHexString())
      const STETH = utils.getAddress(params[10][2].toHexString())
      const limits = {
        [LDO]: decodeLimit(params[2][2]),
        [ETH]: decodeLimit(params[5][2]),
        [DAI]: decodeLimit(params[8][2]),
        [STETH]: decodeLimit(params[11][2]),
      }

      return limits
    },
  )

  return result
}
