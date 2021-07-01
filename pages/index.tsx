import { useSWR } from 'modules/shared/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { MotionsGrid } from 'modules/motions/ui/MotionsGrid'
import { MotionCardPreview } from 'modules/motions/ui/MotionCardPreview'

import type { Motion } from 'modules/motions/types'
import { standardFetcher } from 'modules/shared/utils/standardFetcher'
import * as urlsApi from 'modules/shared/utils/urlsApi'

export default function HomePage() {
  const currentChain = useCurrentChain()
  const { initialLoading, data } = useSWR<{ motions: Motion[] }>(
    urlsApi.motionsListActive(currentChain),
    standardFetcher,
  )

  return (
    <Container as="main" size="full">
      <Title>Active Motions</Title>
      {initialLoading && <div>Loading...</div>}
      {!initialLoading && data && (
        <MotionsGrid>
          {data.motions.map((motion, i) => (
            <MotionCardPreview key={i} motion={motion} />
          ))}
        </MotionsGrid>
      )}
    </Container>
  )
}
