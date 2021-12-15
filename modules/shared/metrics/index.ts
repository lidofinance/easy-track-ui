import { ethereumResponse } from 'modules/network/utils/fetchWithFallback'
import { Registry } from 'prom-client'
import { buildInfo } from './buildInfo'
import { chainInfo } from './chainInfo'

const registry = new Registry()

registry.registerMetric(buildInfo)
registry.registerMetric(chainInfo)
registry.registerMetric(ethereumResponse)

export { registry }
