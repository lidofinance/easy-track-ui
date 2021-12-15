import { METRICS_PREFIX } from 'modules/config'
import { registry } from 'modules/shared/metrics'
// import {
//   collectBuildInfo,
//   collectChainConfig,
//   collectCspConfig,
//   timeAlchemy,
//   timeInfura,
// } from 'modules/shared/utils/metrics'
import { NextApiRequest, NextApiResponse } from 'next'
import { collectDefaultMetrics } from 'prom-client'

type Metrics = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

collectDefaultMetrics({ prefix: METRICS_PREFIX, register: registry })

const metrics: Metrics = async (req, res) => {
  const collectedMetrics = await registry.metrics()
  res.send(collectedMetrics)
  // if (process.env.NODE_ENV === 'development') {
  //   // Clear the register to avoid errors on Hot Reload
  //   register.clear()
  // }
  // collectCspConfig()
  // collectChainConfig()
  // await timeInfura()
  // await timeAlchemy()
  // res.setHeader('Content-type', register.contentType)
  // const allMetrics = await register.metrics()
  // res.send(allMetrics)
}

export default metrics
