import { Subtitle } from 'modules/stonks/ui/StonksOrderForm'
import { Title } from 'modules/shared/ui/Common/Title'
import { StonksOrderResolverForm } from 'modules/stonks/ui/StonksOrderResolverForm'
import { StonksGridWrapper } from 'modules/stonks/ui/StonksGridWrapper'
import { StonksPageContainer } from 'modules/stonks/ui/StonksPageContainer'

export default function StonksCreateOrderPage() {
  return (
    <StonksPageContainer>
      <Title title="Do stonks" />
      <Subtitle size={20} weight={800} isCentered>
        Manage existing order
      </Subtitle>
      <StonksOrderResolverForm />
      <Subtitle size={20} weight={800} isCentered>
        Create on-chain order
      </Subtitle>
      <StonksGridWrapper />
    </StonksPageContainer>
  )
}
