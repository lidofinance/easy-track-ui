import { registry } from 'modules/shared/metrics'

import { NextApiRequest, NextApiResponse } from 'next'
// import { collectDefaultMetrics } from 'prom-client'

type Metrics = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

// collectDefaultMetrics({ prefix: METRICS_PREFIX, register: registry })

const metrics: Metrics = async (req, res) => {
  const collectedMetrics = await registry.metrics()
  res.send(collectedMetrics)
}

export default metrics
