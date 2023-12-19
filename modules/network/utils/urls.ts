export const home = '/'
export const motionDetails = (id: string | number) => `/motions/${id}`
export const archive = '/archive'
export const startMotion = '/start-motion'
export const about = '/about'

export const stonksPlaceOrder = '/stonks/place-order'
export const stonksOrder = (orderAddress: string) =>
  `/stonks/orders/${orderAddress}`
