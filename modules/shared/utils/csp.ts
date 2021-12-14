import { withSecureHeaders } from 'next-secure-headers'
import getConfig from 'next/config'
import { CustomAppProps } from './utilTypes'

const { serverRuntimeConfig } = getConfig()
const { cspTrustedHosts, cspReportOnly, cspReportUri } = serverRuntimeConfig

const trustedHosts = cspTrustedHosts
  ? cspTrustedHosts.split(',')
  : ['https://*.lido.fi']

const reportOnly = cspReportOnly === 'true'

export const contentSecurityPolicy = {
  directives: {
    styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', ...trustedHosts],
    imgSrc: ["'self'", 'data:', ...trustedHosts],
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", ...trustedHosts],
    connectSrc: ["'self'", 'https://api.thegraph.com', ...trustedHosts],
    defaultSrc: ["'self'", ...trustedHosts],
    reportURI: cspReportUri,
  },
  reportOnly: reportOnly,
}

export const withCsp = (
  app: ({ envConfig, ...appProps }: CustomAppProps) => JSX.Element,
) =>
  withSecureHeaders({
    contentSecurityPolicy,
  })(app)
