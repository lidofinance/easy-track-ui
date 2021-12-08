const basePath = process.env.BASE_PATH || ''
const infuraApiKey = process.env.INFURA_API_KEY
const alchemyApiKey = process.env.ALCHEMY_API_KEY

const defaultChain = process.env.DEFAULT_CHAIN
const supportedChains = process.env.SUPPORTED_CHAINS

const cspTrustedHosts = process.env.CSP_TRUSTED_HOSTS ?? 'https://*.lido.fi'

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
  // webpack(config) {
  //   const fileLoaderRule = config.module.rules.find(
  //     rule => rule.test && rule.test.test('.svg'),
  //   )
  //   fileLoaderRule.exclude = /\.svg$/
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     loader: require.resolve('@svgr/webpack'),
  //   })
  //   return config

  //   // config.module.rules.push({
  //   //   test: /\.svg$/,
  //   //   use: ['@svgr/webpack', 'url-loader'],
  //   // })

  //   // return config
  // },
  async headers() {
    // 'unsafe-inline' for styled-components
    const stylePolicy = "style-src 'self' 'unsafe-inline'"
    const fontPolicy =
      "font-src 'self' https://fonts.gstatic.com " + cspTrustedHosts
    const imagePolicy = "img-src 'self' data: " + cspTrustedHosts
    const scriptSrc = "script-src 'self' " + cspTrustedHosts
    const defaultPolicy = "default-src 'self' " + cspTrustedHosts

    const cspPolicies = [
      stylePolicy,
      fontPolicy,
      imagePolicy,
      scriptSrc,
      defaultPolicy,
    ].join('; ')

    // https://nextjs.org/docs/advanced-features/security-headers
    const _headers = [
      {
        source: '/(.*)',
        headers: [
          // DNS pre-fetching for external resources
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // HTTPS connections only, 2 years
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Explicit MIME types
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]

    if (process.env.NODE_ENV !== 'development') {
      _headers[0].headers.push({
        key: 'Content-Security-Policy-Report-Only',
        value: cspPolicies,
      })
    }

    return _headers
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
