import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { useStonksRecentOrders } from './useStonksRecentOrders'

export const StonksRecentOrdersList = () => {
  const { data: recentOrders, initialLoading } = useStonksRecentOrders()

  if (initialLoading) {
    return <div>Loading orders...</div>
  }

  if (!recentOrders?.length) {
    return <div>No recent orders found.</div>
  }

  return (
    <div>
      {recentOrders.map(order => (
        <div key={order.address}>
          <AddressInlineWithPop address={order.address} /> (
          {order.tokenFromLabel} → {order.tokenToLabel})
        </div>
      ))}
    </div>
  )
}
