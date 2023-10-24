export const nodeOperatorsKeysInfo = (
  chainId: number,
  walletAddress: string,
  moduleAddress: string,
) =>
  `/api/node-operators/keys-info?chainId=${chainId}&walletAddress=${walletAddress}&moduleAddress=${moduleAddress}`
