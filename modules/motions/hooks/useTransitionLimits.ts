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

const decodeLimit = (val: BigNumber, decimals: number | null) => {
  if (!decimals) {
    return null
  }
  return new Big(Number(val)).div(10 ** decimals).toNumber()
}

type LimitsMap = Record<string, number | null | undefined>

export const useTransitionLimits = () => {
  const { chainId } = useWeb3()

  const result = useSWR<LimitsMap>(`permission-param-${chainId}`, async () => {
    const contractFinance = ContractFinance.connectRpc({ chainId })
    const contractAragonAcl = ContractAragonAcl.connectRpc({ chainId })
    const evmScriptExecutorAddress = ContractEVMScriptExecutor.address[chainId]!

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

    const limits: LimitsMap = {}

    for (const index of TOKEN_INDEXES) {
      const rawAddress: string | undefined =
        // literal definition because params[4][2].toHexString() === '0x00
        index === ETH_INDEX
          ? constants.AddressZero
          : params[index]?.[2].toHexString()
      const address = rawAddress ? utils.getAddress(rawAddress) : null

      if (address) {
        let decimals: number | null = null
        if (address === constants.AddressZero) {
          decimals = DEFAULT_DECIMALS
        } else {
          const tokenContract = connectERC20Contract(address, chainId)
          try {
            decimals = await tokenContract.decimals()
          } catch (error) {
            decimals = null
          }
        }

        limits[address] = decodeLimit(params[index + 1][2], decimals)
      }
    }

    console.log('limits', limits)

    return limits
  })

  return result
}
