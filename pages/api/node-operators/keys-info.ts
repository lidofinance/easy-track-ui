import getConfig from 'next/config'
import { createNextConnect } from 'modules/shared/utils/createNextConnect'
import { parseChainId } from 'modules/blockChain/chains'
import { fetch } from '@lido-sdk/fetch'
import { CHAINS } from '@lido-sdk/constants'
import { KeysInfo } from 'modules/motions/types'
import { utils } from 'ethers'

export type Module = {
  id: number
  stakingModuleAddress: string
}

export type KeysInfoOperatorNew = {
  id: number
  active: boolean
  name: string
  rewardAddress: string
  totalSigningKeys: number
  usedSigningKeys: number
  stakingLimit: number
  stoppedValidators: number
  unusedBellowStakingLimit: number
  unusedOverStakingLimit: number
  duplicates: string[]
  invalid: string[]
}

export type KeysInfoNew = {
  operators: undefined | KeysInfoOperatorNew[]
  summary: {
    moduleId: number
  }
}

const { serverRuntimeConfig } = getConfig()
const { operatorsWidgetBackendUrl } = serverRuntimeConfig

const requestGoerliOperators = async (chainId: number) => {
  const data = await fetch(
    `https://operators.testnet.fi/api/operators?chainId=${chainId}`,
  )
  return data.json()
}

const requestOperators = async (
  chainId: number,
  moduleAddress: string,
  walletAddress: string,
) => {
  const status = await fetch(`${operatorsWidgetBackendUrl}/v1/status`).then(
    (resp: any) => resp.json(),
  )

  if (status.chainId !== chainId) {
    throw new Error(
      `The server chain does not match the application chain ${status.chainId} !== ${chainId}`,
    )
  }

  const modulesResp = await fetch(`${operatorsWidgetBackendUrl}/v1/modules`)
  const modules: Module[] = await modulesResp.json()

  const module = modules.find(
    item =>
      utils.getAddress(item.stakingModuleAddress) ===
      utils.getAddress(moduleAddress),
  )
  const result: KeysInfo = {}
  if (!module) {
    return result
  }
  const moduleStatisticsResp = await fetch(
    `${operatorsWidgetBackendUrl}/v1/module-statistics/${module.id}`,
  )
  const moduleStatistics: KeysInfoNew = await moduleStatisticsResp.json()

  const operator = moduleStatistics.operators?.find(
    item =>
      utils.getAddress(item.rewardAddress) === utils.getAddress(walletAddress),
  )
  if (!operator) {
    return result
  }

  const operatorStatisticsResp = await fetch(
    `${operatorsWidgetBackendUrl}/v1/operator/${module.id}/${operator.id}`,
  )
  const operatorStatistics: KeysInfoOperatorNew =
    await operatorStatisticsResp.json()

  result.operators = [
    {
      invalid: operatorStatistics.invalid,
      duplicates: operatorStatistics.duplicates,
      info: {
        index: operatorStatistics.id,
        active: operatorStatistics.active,
        name: operatorStatistics.name,
        rewardAddress: operatorStatistics.rewardAddress,
        stakingLimit: operatorStatistics.stakingLimit,
        stoppedValidators: operatorStatistics.stoppedValidators,
        totalSigningKeys: operatorStatistics.totalSigningKeys,
        usedSigningKeys: operatorStatistics.usedSigningKeys,
      },
    },
  ]
  return result
}

export default createNextConnect().get(async (req, res) => {
  try {
    const chainId = parseChainId(String(req.query.chainId))
    const walletAddress = String(req.query.walletAddress)
    const moduleAddress = String(req.query.moduleAddress)

    let result
    if (chainId === CHAINS.Goerli) {
      result = await requestGoerliOperators(chainId)
    } else {
      result = await requestOperators(chainId, moduleAddress, walletAddress)
    }

    res.json(result)
  } catch (e) {
    console.error(e)
    res.status(500).send({ error: 'Something went wrong!' })
  }
})
