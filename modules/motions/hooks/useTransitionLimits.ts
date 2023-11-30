import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import {
  ContractFinance,
  ContractAragonAcl,
  ContractEVMScriptExecutor,
} from 'modules/blockChain/contracts'

import { utils, constants, BigNumber } from 'ethers'
import { Big } from 'modules/shared/utils/bigNumber'
import { connectERC20Contract } from '../utils/connectTokenContract'
import { DEFAULT_DECIMALS } from 'modules/blockChain/constants'

// Data structure reference
// https://github.com/lidofinance/scripts/blob/2a30b9654abc90b20debf837f99cd02f248d6644/scripts/setup_easytrack_limits.py#L67-L100
const LDO_INDEX = 1
const ETH_INDEX = 4
const DAI_INDEX = 7
const STETH_INDEX = 10
const USDC_INDEX = 13
const USDT_INDEX = 16

const TOKEN_INDEXES = [
  LDO_INDEX,
  ETH_INDEX,
  DAI_INDEX,
  STETH_INDEX,
  USDC_INDEX,
  USDT_INDEX,
]

const decodeLimit = (val: BigNumber, decimals = DEFAULT_DECIMALS) =>
  new Big(Number(val)).div(10 ** decimals).toNumber()

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

      const limits: Record<string, number | undefined> = {}

      for (const index of TOKEN_INDEXES) {
        const rawAddress: string | undefined =
          // literal definition because params[4][2].toHexString() === '0x00
          index === ETH_INDEX
            ? constants.AddressZero
            : params[index]?.[2].toHexString()
        const address = rawAddress ? utils.getAddress(rawAddress) : null

        if (address) {
          let decimals = DEFAULT_DECIMALS
          if (address !== constants.AddressZero) {
            const tokenContract = connectERC20Contract(address, chainId)

            decimals = await tokenContract.decimals()
          }

          limits[address] = decodeLimit(params[index + 1][2], decimals)
        }
      }

      return limits
    },
  )

  return result
}
