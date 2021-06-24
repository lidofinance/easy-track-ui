import { useSWR } from 'modules/hooks/useSwr'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Title } from 'modules/ui/Common/Title'
import { MotionCard } from 'modules/motions/ui/MotionCard'
import { MotionsGrid } from 'modules/motions/ui/MotionsGrid'

import type { Motion } from 'modules/motions/types'
import { standardFetcher } from 'modules/utils/standardFetcher'

export default function HomePage() {
  const currentChain = useCurrentChain()
  const { initialLoading, data } = useSWR<{ motions: Motion[] }>(
    `/api/motions?chainId=${currentChain}`,
    standardFetcher,
  )

  return (
    <>
      <Title>Active Motions</Title>
      {initialLoading && <div>Loading...</div>}
      {!initialLoading && data && (
        <MotionsGrid>
          {data.motions.map((motion, i) => (
            <MotionCard key={i} motion={motion} />
          ))}
        </MotionsGrid>
      )}
    </>
  )
}
