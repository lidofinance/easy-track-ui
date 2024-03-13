export const home = '/'
export const motionDetails = (id: string | number) => `/motions/${id}`
export const archive = '/archive'
export const startMotion = '/start-motion'
export const about = '/about'

export const stonks = '/stonks'
export const stonksInstance = (stonksAddress: string) =>
  `/stonks/${stonksAddress}`
export const stonksOrder = (orderAddress: string) =>
  `/stonks/orders/${orderAddress}`
