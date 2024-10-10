import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()
const { infuraApiKey, alchemyApiKey, subgraphMainnet, subgraphHolesky } =
  serverRuntimeConfig

const SECRETS = {
  INFURA_API_KEY: infuraApiKey ? new RegExp(infuraApiKey, 'ig') : null,
  ALCHEMY_API_KEY: alchemyApiKey ? new RegExp(alchemyApiKey, 'ig') : null,
  SANITIZED_HEX: new RegExp('0x[a-fA-F0-9]+', 'ig'),
  ENS_ADDRESS: new RegExp('[a-zA-Z.]+\\.eth', 'gi'),
  SUBGRAPH_MAINNET: subgraphMainnet ? new RegExp(subgraphMainnet, 'ig') : null,
  SUBGRAPH_HOLESKY: subgraphHolesky ? new RegExp(subgraphHolesky, 'ig') : null,
}

const secretEntries = Object.entries(SECRETS)

export const sanitizeMessage = (message: string) => {
  let result = message

  for (let [key, re] of secretEntries) {
    if (re) {
      result = result.replace(re, `%${key}%`)
    }
  }

  return result
}
