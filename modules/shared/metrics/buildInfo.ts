import { Gauge } from 'prom-client'
import { METRICS_PREFIX } from './constants'
import { branch, commit } from 'build-info.json'

export const buildInfo = new Gauge({
  name: METRICS_PREFIX + 'build_info',
  help: 'Version, branch and commit of the current build',
  labelNames: ['version', 'branch', 'commit'],
})

const version = process.env.npm_package_version ?? 'unversioned'

buildInfo.labels(version, branch, commit).set(1)
