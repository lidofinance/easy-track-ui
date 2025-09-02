export const openKeys = [
  'SUPPORTED_CHAINS',
  'DEFAULT_CHAIN',

  'CSP_TRUSTED_HOSTS',
  'CSP_REPORT_ONLY',
  'CSP_REPORT_URI',

  'RATE_LIMIT',
  'RATE_LIMIT_TIME_FRAME',

  'WALLETCONNECT_PROJECT_ID',

  'SUBGRAPH_MAINNET',
  'SUBGRAPH_HOODI',
]

export const secretKeys = [
  'EL_RPC_URLS_1',
  'EL_RPC_URLS_5',
  'EL_RPC_URLS_17000',
]

export const logOpenEnvironmentVariables = () => {
  console.log('---------------------------------------------')
  console.log('Log environment variables (without secrets):')
  console.log('---------------------------------------------')

  for (const key of openKeys) {
    if (!process.env.hasOwnProperty(key)) {
      console.error(`${key} - ERROR (not exist in process.env)`)
      continue
    }

    console.info(`${key} = ${process.env[key]}`)
  }

  console.log('---------------------------------------------')
  console.log('')
}

export const logSecretEnvironmentVariables = () => {
  console.log('---------------------------------------------')
  console.log('Log secret environment variables:')
  console.log('---------------------------------------------')

  // console.log('process.env:', process.env)
  for (const key of secretKeys) {
    if (!process.env.hasOwnProperty(key)) {
      console.error(`Secret ${key} - ERROR (not exist in process.env)`)
      continue
    }

    if (process.env[key].length > 0) {
      console.info(`Secret ${key} - OK (exist and not empty)`)
    } else {
      console.warn(`Secret ${key} - WARN (exist but empty)`)
    }
  }

  console.log('---------------------------------------------')
}

export const logEnvironmentVariables = () => {
  logOpenEnvironmentVariables()
  logSecretEnvironmentVariables()
}
