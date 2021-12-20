import { ethereumResponse } from 'modules/network/utils/fetchWithFallback'
import { collectDefaultMetrics, Registry } from 'prom-client'
import { buildInfo } from './buildInfo'
import { chainInfo } from './chainInfo'
import { METRICS_PREFIX } from './constants'

const registry = new Registry()

registry.registerMetric(buildInfo)
registry.registerMetric(chainInfo)
registry.registerMetric(ethereumResponse)

collectDefaultMetrics({ prefix: METRICS_PREFIX, register: registry })

export { registry }
