import styled from 'styled-components'
import { useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { MotionDetailedProvider } from 'modules/motions/providers/motionDetailed'

import { Container } from '@lidofinance/lido-ui'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MotionCardDetailed } from 'modules/motions/ui/MotionDetailed'

import type { Motion } from 'modules/motions/types'
import { fetchMotionsSubgraphItem } from 'modules/motions/network/motionsSubgraphFetchers'
import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { formatMotionDataOnchain } from 'modules/motions/utils/formatMotionDataOnchain'
import { getMotionCreatedEvent } from 'modules/motions/utils'

const ContentContainer = styled(Container).attrs({
  as: 'main',
})`
  margin: 0 auto;
  max-width: 600px;
`

export default function MotionDetailsPage() {
  const router = useRouter()
  const { chainId } = useWeb3()
  const motionId = Number(router.query.motionId)
  const easyTrack = ContractEasyTrack.useRpc()
  const {
    initialLoading,
    data: motion,
    mutate,
  } = useSWR<Motion | null>(`motion-${chainId}-${motionId}`, async () => {
    try {
      const onChainMotionData = await easyTrack.getMotion(motionId)
      let evmScriptCallData: string | undefined = undefined
      try {
        const event = await getMotionCreatedEvent(
          easyTrack,
          onChainMotionData.id.toNumber(),
          onChainMotionData.snapshotBlock.toNumber(),
        )
        evmScriptCallData = event._evmScriptCallData
      } catch (error) {}

      return formatMotionDataOnchain(onChainMotionData, evmScriptCallData)
    } catch {
      const subgraphMotionData = await fetchMotionsSubgraphItem(
        chainId,
        motionId,
      )
      return subgraphMotionData
    }
  })

  const revalidate = useCallback(() => mutate(), [mutate])

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
      <MotionDetailedProvider motion={motion} onInvalidate={revalidate}>
        <MotionCardDetailed motion={motion} onInvalidate={revalidate} />
      </MotionDetailedProvider>
    </ContentContainer>
  )
}
