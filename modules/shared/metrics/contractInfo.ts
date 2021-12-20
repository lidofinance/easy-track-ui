import { Gauge } from 'prom-client'
import { METRICS_PREFIX } from './constants'
import getConfig from 'next/config'
import { Chains, getChainName } from 'modules/blockChain/chains'
import { getAddressList } from 'modules/config/utils/getAddressList'

const { publicRuntimeConfig } = getConfig()
const { defaultChain } = publicRuntimeConfig

const chainId = +defaultChain as Chains

const addressList = getAddressList(chainId)
const contractNames = addressList.map(({ contractName }) => contractName)
const contractAddrs = addressList.map(({ address }) => address)

export const contractInfo = new Gauge({
  name: METRICS_PREFIX + 'contract_info',
  help: `Contract configuration for default chain (${getChainName(chainId)})`,
  labelNames: contractNames,
})

contractInfo.labels(...contractAddrs).set(1)
