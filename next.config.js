const basePath = process.env.BASE_PATH || ''
const infuraApiKey = process.env.INFURA_API_KEY
const alchemyApiKey = process.env.ALCHEMY_API_KEY

const defaultChain = process.env.DEFAULT_CHAIN
const supportedChains = process.env.SUPPORTED_CHAINS

module.exports = {
  basePath,
  webpack5: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg.react$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: { plugins: [{ removeViewBox: false }] },
            titleProp: true,
          },
        },
      ],
    })

    return config
  },
  devServer(configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost)

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      }

      return config
    }
  },
  serverRuntimeConfig: {
    basePath,
    infuraApiKey,
    alchemyApiKey,
  },
  publicRuntimeConfig: {
    defaultChain,
    supportedChains,
  },
}
