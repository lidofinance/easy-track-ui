const basePath = process.env.BASE_PATH || ''
const infuraApiKey = process.env.INFURA_API_KEY
const alchemyApiKey = process.env.ALCHEMY_API_KEY

const defaultChain = process.env.DEFAULT_CHAIN
const supportedChains = process.env.SUPPORTED_CHAINS

const envDomain = process.env.ENV_DOMAIN

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
    const stylePolicy = "style-src 'self' 'unsafe-inline'"
    const envDomainWithLeadingSpace = envDomain ? ' ' + envDomain : ''
    const fontPolicy =
      "font-src 'self' https://fonts.gstatic.com https://*.lido.fi" +
      envDomainWithLeadingSpace
    const imagePolicy =
      "img-src 'self' data: https://*.lido.fi" + envDomainWithLeadingSpace
    const defaultPolicy =
      "default-src 'self' https://*.lido.fi" + envDomainWithLeadingSpace

    const cspPolicies = [
      stylePolicy,
      fontPolicy,
      imagePolicy,
      defaultPolicy,
    ].join('; ')

    const scpValue = process.env.NODE_ENV !== 'development' ? cspPolicies : ''

    // https://nextjs.org/docs/advanced-features/security-headers
    return [
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
          {
            key: 'Content-Security-Policy',
            value: scpValue,
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
    infuraApiKey,
    alchemyApiKey,
  },
  publicRuntimeConfig: {
    defaultChain,
    supportedChains,
  },
}
