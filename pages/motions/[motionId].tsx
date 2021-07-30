import { useRouter } from 'next/dist/client/router'
import { useSWR } from 'modules/shared/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MotionCardDetailed } from 'modules/motions/ui/MotionCardDetailed'

import type { Motion } from 'modules/motions/types'
import { fetcherStandard } from 'modules/shared/utils/fetcherStandard'
import { fetchMotionsSubgraphItem } from 'modules/motions/utils/motionsSubgraphFetchers'
import * as urlsApi from 'modules/shared/utils/urlsApi'

export default function MotionDetailsPage() {
  const router = useRouter()
  const currentChain = useCurrentChain()
  const motionId = Number(router.query.motionId)
  const { initialLoading, data: motion } = useSWR<Motion | null>(
    `motion-${currentChain}-${motionId}`,
    async () => {
      try {
        const tryActive = await fetcherStandard<Motion>(
          urlsApi.motionDetails(motionId, currentChain),
        )
        return tryActive
      } catch {
        const tryArchive = await fetchMotionsSubgraphItem(motionId)
        return tryArchive
      }
    },
  )

  if (initialLoading) {
    return (
      <Container as="main" size="content">
        <PageLoader />
      </Container>
    )
  }

  if (!motion) {
    return (
      <Container as="main" size="content">
        Nothing found
      </Container>
    )
  }

  return (
    <Container as="main" size="content">
      <Title>Motion #{motionId}</Title>
      <MotionCardDetailed motion={motion} />
    </Container>
  )
}
