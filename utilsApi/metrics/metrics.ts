import { collectDefaultMetrics, Registry } from 'prom-client'

import { collectStartupMetrics } from './startup-metrics'
import { RequestMetrics } from './request'
import { METRICS_PREFIX } from './constants'

class Metrics {
  registry = new Registry()

  // compositions of metric types
  request = new RequestMetrics(this.registry)

  constructor() {
    void collectStartupMetrics(this.registry)
    collectDefaultMetrics({ prefix: METRICS_PREFIX, register: this.registry })
  }
}

export const metricsInstance = new Metrics()
