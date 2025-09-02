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

const requestTestnetOperators = async (chainId: number) => {
  const data = await fetch(
    `https://operators.testnet.fi/api/operators?chainId=${chainId}`,
  )
  return data.json()
}

const requestOperators = async (
  api:
    | 'https://operators.lido.fi/api'
    | 'https://operators-hoodi.testnet.fi/api',
  chainId: number,
  moduleAddress: string,
  walletAddress: string,
) => {
  const modulesResp = await fetch(`${api}/modules?chainId=${chainId}`)
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
    `${api}/moduleStatistics?moduleId=${module.id}&chainId=${chainId}`,
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
    `${api}/operatorStatistics?moduleId=${module.id}&operatorId=${operator.id}&chainId=${chainId}`,
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
    switch (chainId) {
      case CHAINS.Mainnet:
        result = await requestOperators(
          'https://operators.lido.fi/api',
          chainId,
          moduleAddress,
          walletAddress,
        )
        break
      case CHAINS.Hoodi:
        result = await requestOperators(
          'https://operators-hoodi.testnet.fi/api',
          chainId,
          moduleAddress,
          walletAddress,
        )
        break
      default:
        result = await requestTestnetOperators(chainId)
    }

    res.json(result)
  } catch (e) {
    console.error(e)
    res.status(500).send({ error: 'Something went wrong!' })
  }
})
