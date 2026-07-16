import { StonksPageContainer } from 'modules/stonks/ui/StonksPageContainer'
import { MessageBox, StonksOrderForm } from 'modules/stonks/ui/StonksOrderForm'
import { useRouter } from 'next/router'
import { useStonksData } from 'modules/stonks/hooks/useStonksData'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'

export default function StonksDetailsPage() {
  const router = useRouter()
  const addressParam = String(router.query.stonksAddress)
  const { stonksData, isStonksDataLoading } = useStonksData(addressParam)

  const selectedStonksPair = stonksData?.[0]

  if (isStonksDataLoading) {
    return (
      <StonksPageContainer>
        <PageLoader />
      </StonksPageContainer>
    )
  }

  if (!selectedStonksPair) {
    return (
      <StonksPageContainer>
        <MessageBox>Stonks pair not found</MessageBox>
      </StonksPageContainer>
    )
  }

  return (
    <StonksPageContainer>
      <StonksOrderForm stonksPairData={selectedStonksPair} />
    </StonksPageContainer>
  )
}
