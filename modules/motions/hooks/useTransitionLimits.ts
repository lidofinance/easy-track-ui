import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import {
  ContractFinance,
  ContractAragonAcl,
  ContractEVMScriptExecutor,
} from 'modules/blockChain/contracts'

import { utils, constants, BigNumber } from 'ethers'
import { Big } from 'modules/shared/utils/bigNumber'
import { DEFAULT_DECIMALS } from 'modules/blockChain/constants'
import { MAX_PROVIDER_BATCH } from 'modules/config'
import { processInBatches } from 'modules/blockChain/utils/processInBatches'
import { useConnectErc20Contract } from './useConnectErc20Contract'

// Data structure reference
// https://github.com/lidofinance/scripts/blob/bda3568d1291bdc7ba422fb20150313f2d1778c3/scripts/vote_2024_01_16.py#L106
const STETH_INDEX = 1
const DAI_INDEX = 4
const LDO_INDEX = 7
const USDC_INDEX = 10
const USDT_INDEX = 13
const ETH_INDEX = 16

const TOKEN_INDEXES = [
  STETH_INDEX,
  DAI_INDEX,
  LDO_INDEX,
  USDC_INDEX,
  USDT_INDEX,
  ETH_INDEX,
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
  const connectErc20Contract = useConnectErc20Contract()
  const finance = ContractFinance.useRpc()
  const aragonAcl = ContractAragonAcl.useRpc()

  const result = useSWR<LimitsMap>(`permission-param-${chainId}`, async () => {
    const evmScriptExecutorAddress = ContractEVMScriptExecutor.address[chainId]!
    const role = await finance.CREATE_PAYMENTS_ROLE()
    const paramsLength = await aragonAcl.getPermissionParamsLength(
      evmScriptExecutorAddress,
      finance.address,
      role,
    )

    const indexes = Array.from({ length: Number(paramsLength) }, (_, i) => i)

    const batchResults = await processInBatches(
      indexes,
      MAX_PROVIDER_BATCH,
      async i =>
        aragonAcl.getPermissionParam(
          evmScriptExecutorAddress,
          finance.address,
          role,
          i,
        ),
    )

    // Build the params map directly from fulfilled results
    const params: Record<number, any> = {}

    batchResults.forEach((res, i) => {
      if (res.status === 'fulfilled') {
        params[indexes[i]] = res.value
      } else {
        console.error(
          `Failed to fetch permission param at index ${indexes[i]}`,
          res.reason,
        )
      }
    })

    const limits: LimitsMap = {}

    for (const index of TOKEN_INDEXES) {
      const rawAddress: string | undefined =
        index === ETH_INDEX
          ? constants.AddressZero
          : params[index]?.[2].toHexString()
      const address = rawAddress ? utils.getAddress(rawAddress) : null

      if (address) {
        let decimals: number | null = null
        if (address === constants.AddressZero) {
          decimals = DEFAULT_DECIMALS
        } else {
          const tokenContract = connectErc20Contract(address)
          try {
            decimals = await tokenContract.decimals()
          } catch {
            decimals = null
          }
        }

        limits[address] = decodeLimit(params[index + 1]?.[2], decimals)
      }
    }

    return limits
  })

  return result
}
