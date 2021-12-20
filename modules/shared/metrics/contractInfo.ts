import { Gauge } from 'prom-client'
import { METRICS_PREFIX } from './constants'
import getConfig from 'next/config'
import { getChainName } from 'modules/blockChain/chains'
import { getAddressList } from 'modules/config/utils/getAddressList'
import { CHAINS } from '@lido-sdk/constants'

const { publicRuntimeConfig } = getConfig()
const { defaultChain } = publicRuntimeConfig

const chainId = +defaultChain as CHAINS

const addressList = getAddressList(chainId)
const contractNames = addressList.map(({ contractName }) => contractName)
const contractAddrs = addressList.map(({ address }) => address)

export const contractInfo = new Gauge({
  name: METRICS_PREFIX + 'contract_info',
  help: `Contract configuration for default chain (${getChainName(chainId)})`,
  labelNames: contractNames,
  registers: [],
})

contractInfo.labels(...contractAddrs).set(1)
