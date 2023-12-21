import { OrderStatus } from '../types'

export function getOrderStatusText(status: OrderStatus) {
  switch (status) {
    case 'open':
      return 'Active'
    case 'fulfilled':
      return 'Fulfilled'
    case 'cancelled':
      return 'Cancelled'
    case 'expired':
      return 'Expired'
    default:
      return 'Pending'
  }
}
