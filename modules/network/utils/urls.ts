export const home = '/'
export const motionDetails = (id: string | number) => `/motions/${id}`
export const archive = '/archive'
export const startMotion = '/start-motion'
export const about = '/about'

export const stonksCreateOrder = '/stonks/create-order'
export const stonksOrder = (orderAddress: string) =>
  `/stonks/orders/${orderAddress}`
