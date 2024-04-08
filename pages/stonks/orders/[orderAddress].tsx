import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  ContentContainer,
  ErrorMessageBox,
  StonksOrderCard,
  MessageBox,
} from 'modules/stonks/ui/StonksOrderCard'
import { useRouter } from 'next/dist/client/router'
import { useOrderData } from 'modules/stonks/hooks/useOrderData'

export default function StonksOrderDetailsPage() {
  const router = useRouter()
  const orderAddress = String(router.query.orderAddress)

  const {
    data: order,
    error,
    initialLoading,
    isValidating,
    mutate,
  } = useOrderData(orderAddress)

  if (error) {
    return (
      <ContentContainer>
        <ErrorMessageBox>{error?.message ?? 'Unknown Error'}</ErrorMessageBox>
      </ContentContainer>
    )
  }

  if (initialLoading) {
    return (
      <ContentContainer>
        <PageLoader />
      </ContentContainer>
    )
  }

  if (!order) {
    return (
      <ContentContainer>
        <MessageBox>Order not found</MessageBox>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <StonksOrderCard
        order={order}
        isDataValidating={isValidating}
        onInvalidate={() => mutate(undefined, { revalidate: true })}
      />
    </ContentContainer>
  )
}
