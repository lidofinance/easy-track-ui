import { useSWR } from 'modules/network/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Container } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { Title } from 'modules/shared/ui/Common/Title'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MotionsGrid } from 'modules/motions/ui/MotionsGrid'
import { MotionCardPreview } from 'modules/motions/ui/MotionCardPreview'

import type { Motion } from 'modules/motions/types'
import { fetcherStandard } from 'modules/network/utils/fetcherStandard'
import * as urlsApi from 'modules/network/utils/urlsApi'

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
      {!initialLoading && (!motions || !motions.length) && (
        <Text size={16} weight={500} isCentered color="textSecondary">
          No active motions at the moment
        </Text>
      )}
      {!initialLoading && motions && motions.length && (
        <MotionsGrid>
          {motions.map(motion => (
            <MotionCardPreview key={motion.id} motion={motion} />
          ))}
        </MotionsGrid>
      )}
    </Container>
  )
}
