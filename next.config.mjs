const basePath = process.env.BASE_PATH || ''
const infuraApiKey = process.env.INFURA_API_KEY
const alchemyApiKey = process.env.ALCHEMY_API_KEY

const rpcUrls_1 =
  (process.env.EL_RPC_URLS_1 && process.env.EL_RPC_URLS_1.split(',')) ||
  [
    alchemyApiKey && `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`,
    infuraApiKey && `https://mainnet.infura.io/v3/${infuraApiKey}`,
  ].filter(Boolean)

const rpcUrls_5 =
  (process.env.EL_RPC_URLS_5 && process.env.EL_RPC_URLS_5.split(',')) ||
  [
    alchemyApiKey && `https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`,
    infuraApiKey && `https://goerli.infura.io/v3/${infuraApiKey}`,
  ].filter(Boolean)

const rpcUrls_17000 =
  (process.env.EL_RPC_URLS_17000 && process.env.EL_RPC_URLS_17000.split(',')) ||
  [
    alchemyApiKey && `https://eth-holesky.alchemyapi.io/v2/${alchemyApiKey}`,
    infuraApiKey && `https://holesky.infura.io/v3/${infuraApiKey}`,
  ].filter(Boolean)

const rpcUrls_560048 =
  process.env.EL_RPC_URLS_560048 && process.env.EL_RPC_URLS_560048.split(',')

const defaultChain = process.env.DEFAULT_CHAIN || '1'
const supportedChains = process.env.SUPPORTED_CHAINS || '1,5'

const cspTrustedHosts = process.env.CSP_TRUSTED_HOSTS
const cspReportOnly = process.env.CSP_REPORT_ONLY
const cspReportUri = process.env.CSP_REPORT_URI

const subgraphMainnet = process.env.SUBGRAPH_MAINNET
const subgraphGoerli = process.env.SUBGRAPH_GOERLI
const subgraphHolesky = process.env.SUBGRAPH_HOLESKY
const subgraphHoodi = process.env.SUBGRAPH_HOODI

const walletconnectProjectId = process.env.WALLETCONNECT_PROJECT_ID

export default {
  basePath,
  webpack5: true,
  experimental: {
    // Fixes a build error with importing Pure ESM modules, e.g. reef-knot
    // Some docs are here:
    // <https://github.com/vercel/next.js/pull/27069>
    // You can see how it is actually used in v12.3.4 here:
    // <https://github.com/vercel/next.js/blob/v12.3.4/packages/next/build/webpack-config.ts#L417>
    // Presumably, it is true by default in next v13 and won't be needed
    esmExternals: true,
  },
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
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    })

    return config
  },
  // WARNING: Vulnerability fix, don't remove until default Next.js image loader is patched
  images: {
    loader: 'custom',
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
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
    rpcUrls_1,
    rpcUrls_5,
    rpcUrls_17000,
    rpcUrls_560048,
    cspTrustedHosts,
    cspReportOnly,
    cspReportUri,
    subgraphMainnet,
    subgraphGoerli,
    subgraphHolesky,
    subgraphHoodi,
  },
  publicRuntimeConfig: {
    defaultChain,
    supportedChains,
    walletconnectProjectId,
  },
}
