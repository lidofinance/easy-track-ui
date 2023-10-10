import { createNextConnect } from 'modules/shared/utils/createNextConnect'
import { parseChainId } from 'modules/blockChain/chains'
import { fetch } from '@lido-sdk/fetch'
import { CHAINS } from '@lido-sdk/constants'
import { KeysInfo } from 'modules/motions/types'

export type Module = {
  id: number
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

const requestMainNet = async (chainId: number) => {
  const data = await fetch(
    `https://operators.li.fi/api/operators?chainId=${chainId}`,
  )
  return data.json()
}
const requestTestNet = async (chainId: number) => {
  const data = await fetch(
    `https://operators.testnet.fi/api/operators?chainId=${chainId}`,
  )
  return data.json()
}

const requestHoleskyNet = async (chainId: number, walletAddress: string) => {
  const api = 'https://operators-holesky.testnet.fi/api'
  const modulesResp = await fetch(`${api}/modules?chainId=${chainId}`)
  const modules = (await modulesResp.json()) as Module[]

  const moduleStatisticsReq = modules.map(item =>
    fetch(`${api}/moduleStatistics?moduleId=${item.id}&chainId=${chainId}`),
  )
  const moduleStatisticsResp = await Promise.all(moduleStatisticsReq)
  const moduleStatistics = (await Promise.all(
    moduleStatisticsResp.map(item => item.json()),
  )) as KeysInfoNew[]

  let moduleId = NaN
  let operatorId = NaN

  moduleStatistics.forEach(module =>
    module.operators?.forEach(operator => {
      if (operator.rewardAddress === walletAddress) {
        moduleId = module.summary.moduleId
        operatorId = operator.id
      }
    }),
  )

  const result: KeysInfo = {}

  if (isNaN(moduleId) || isNaN(operatorId)) {
    return result
  }

  const operatorStatisticsResp = await fetch(
    `${api}/operatorStatistics?moduleId=${moduleId}&operatorId=${operatorId}&chainId=${chainId}`,
  )
  const operatorStatistics =
    (await operatorStatisticsResp.json()) as KeysInfoOperatorNew

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

    let result
    if (chainId === CHAINS.Mainnet) {
      result = await requestMainNet(chainId)
    } else if (chainId === CHAINS.Holesky) {
      result = await requestHoleskyNet(chainId, walletAddress)
    } else {
      result = await requestTestNet(chainId)
    }

    res.json(result)
  } catch (e) {
    console.error(e)
    res.status(500).send({ error: 'Something went wrong!' })
  }
})
