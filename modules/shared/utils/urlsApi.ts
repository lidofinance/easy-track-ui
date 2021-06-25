export const motionsListActive = (chainId: number) =>
  `/api/motions/list-active?chainId=${chainId}`

export const motionDetails = (motionId: string | number, chainId: number) =>
  `/api/motions/${motionId}?chainId=${chainId}`
