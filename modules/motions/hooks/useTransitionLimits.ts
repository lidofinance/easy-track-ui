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
const TOKEN_ARG_INDEX = 0
const AMOUNT_ARG_INDEX = 2

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

  const result = useSWR<LimitsMap>(
    `permission-param-${chainId}`,
    async () => {
      const evmScriptExecutorAddress =
        ContractEVMScriptExecutor.address[chainId]
      if (!evmScriptExecutorAddress) {
        throw new Error(
          `EVMScriptExecutor address not found for chainId ${chainId}`,
        )
      }

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

      const paramsArr: [number, number, BigNumber][] = []

      batchResults.forEach((res, i) => {
        if (res.status === 'fulfilled') {
          params[indexes[i]] = res.value
          paramsArr.push(res.value)
        } else {
          console.error(
            `Failed to fetch permission param at index ${indexes[i]}`,
            res.reason,
          )
        }
      })

      const limits: LimitsMap = {}

      let decimals: number | null = null
      for (let i = 0; i < paramsArr.length; i += 1) {
        const [argIndex, , value] = paramsArr[i]

        if (argIndex === TOKEN_ARG_INDEX) {
          const tokenAddress: string = value.toHexString()
          const limitParam = paramsArr[i + 1]

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!limitParam || limitParam[0] !== AMOUNT_ARG_INDEX) {
            console.warn(
              `Expected limit param at index ${
                i + 1
              } for token ${tokenAddress}, but not found.`,
            )
            continue
          }
          const [, , limitValue] = limitParam
          if (tokenAddress === constants.AddressZero) {
            decimals = DEFAULT_DECIMALS
          } else {
            const tokenContract = connectErc20Contract(tokenAddress)
            try {
              decimals = await tokenContract.decimals()
            } catch {
              decimals = null
            }
          }

          limits[utils.getAddress(tokenAddress)] = decodeLimit(
            limitValue,
            decimals,
          )
          i += 1 // Skip the next param as it's already processed
        }
      }

      return limits
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return result
}
