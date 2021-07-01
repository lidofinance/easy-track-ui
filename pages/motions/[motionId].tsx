import { useRouter } from 'next/dist/client/router'
import { useSWR } from 'modules/shared/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { MotionCardDetailed } from 'modules/motions/ui/MotionCardDetailed'

import type { Motion } from 'modules/motions/types'
import { standardFetcher } from 'modules/shared/utils/standardFetcher'
import * as urlsApi from 'modules/shared/utils/urlsApi'

export default function MotionDetailsPage() {
  const router = useRouter()
  const currentChain = useCurrentChain()
  const motionId = Number(router.query.motionId)
  const { initialLoading, data } = useSWR<{ motion: Motion }>(
    urlsApi.motionDetails(motionId, currentChain),
    standardFetcher,
  )

  if (initialLoading) {
    return 'Loading...'
  }

  if (!data?.motion) {
    return 'Nothing found'
  }

  return (
    <Container as="main" size="full">
      <Title>Motion #{motionId}</Title>
      <MotionCardDetailed motion={data.motion} />
    </Container>
  )
}
