import { Registry } from 'prom-client'
import { buildInfo } from './buildInfo'
import { chainInfo } from './chainInfo'

const registry = new Registry()

registry.registerMetric(buildInfo)
registry.registerMetric(chainInfo)

export { registry }
