import styled from 'styled-components'
import { useRouter } from 'next/dist/client/router'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useSubgraphUrl } from 'modules/network/hooks/useSubgraphUrl'

import { Container } from '@lidofinance/lido-ui'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MotionCardDetailed } from 'modules/motions/ui/MotionDetailed'

import type { Motion } from 'modules/motions/types'
import { fetcherStandard } from 'modules/network/utils/fetcherStandard'
import { fetchMotionsSubgraphItem } from 'modules/motions/network/motionsSubgraphFetchers'
import * as urlsApi from 'modules/network/utils/urlsApi'

const ContentContainer = styled(Container).attrs({
  as: 'main',
})`
  margin: 0 auto;
  max-width: 600px;
`

export default function MotionDetailsPage() {
  const router = useRouter()
  const currentChain = useCurrentChain()
  const motionId = Number(router.query.motionId)
  const subgraphUrl = useSubgraphUrl()
  const { initialLoading, data: motion } = useSWR<Motion | null>(
    `motion-${currentChain}-${motionId}`,
    async () => {
      try {
        const tryActive = await fetcherStandard<Motion>(
          urlsApi.motionDetails(motionId, currentChain),
        )
        return tryActive
      } catch {
        const tryArchive = await fetchMotionsSubgraphItem(subgraphUrl, motionId)
        return tryArchive
      }
    },
  )

  if (initialLoading) {
    return (
      <ContentContainer>
        <PageLoader />
      </ContentContainer>
    )
  }

  if (!motion) {
    return <ContentContainer>Nothing found</ContentContainer>
  }

  return (
    <ContentContainer>
      <MotionCardDetailed motion={motion} />
    </ContentContainer>
  )
}
