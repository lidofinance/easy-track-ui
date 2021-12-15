import { Registry } from 'prom-client'
import { buildInfo } from './buildInfo'

const registry = new Registry()

registry.registerMetric(buildInfo)

export { registry }
