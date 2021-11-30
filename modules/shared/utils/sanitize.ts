import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()
const { infuraApiKey, alchemyApiKey } = serverRuntimeConfig

const SECRETS = {
  infuraApiKey: infuraApiKey ? new RegExp(infuraApiKey, 'ig') : null,
  alchemyApiKey: alchemyApiKey ? new RegExp(alchemyApiKey, 'ig') : null,
  address: new RegExp('0x[a-fA-F0-9]{40}', 'ig'),
  txHash: new RegExp('0x[a-fA-F0-9]{64}', 'ig'),
  ensAddress: new RegExp('[a-zA-Z.]+\\.eth', 'gi'),
}

const secretEntries = Object.entries(SECRETS)

export const sanitizeMessage = (message: string) => {
  let result = message

  for (let [key, re] of secretEntries) {
    if (re) {
      if (key === 'ensAddress') {
        console.log(re.test(result))
      }
      result = result.replace(re, `%${key}%`)
    }
  }

  return result
}
