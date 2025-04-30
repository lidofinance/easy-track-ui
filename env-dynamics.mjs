// Keep fallback as in 'config/get-secret-config.ts'
/** @type number */
export const defaultChain = parseInt(process.env.DEFAULT_CHAIN, 10) || 1;
/** @type number[] */
export const supportedChains = process.env?.SUPPORTED_CHAINS?.split(',').map(
  (chainId) => parseInt(chainId, 10),
) ?? [17000];


export const walletconnectProjectId = process.env.WALLETCONNECT_PROJECT_ID;
