import { useSWR } from 'modules/shared/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MotionsGrid } from 'modules/motions/ui/MotionsGrid'
import { MotionCardPreview } from 'modules/motions/ui/MotionCardPreview'

import type { Motion } from 'modules/motions/types'
import { fetcherStandard } from 'modules/shared/utils/fetcherStandard'
import * as urlsApi from 'modules/shared/utils/urlsApi'

export default function HomePage() {
  const currentChain = useCurrentChain()
  const { initialLoading, data: motions } = useSWR<Motion[]>(
    urlsApi.motionsListActive(currentChain),
    fetcherStandard,
  )

  return (
    <Container as="main" size="full">
      <Title title="Active Motions" subtitle="Select the card to see details" />
      {initialLoading && <PageLoader />}
      {!initialLoading && motions && (
        <MotionsGrid>
          {motions.map((motion, i) => (
            <MotionCardPreview key={i} motion={motion} />
          ))}
        </MotionsGrid>
      )}
    </Container>
  )
}
