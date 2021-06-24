import { useConfig } from 'modules/config'
import { useSWR } from 'modules/hooks/useSwr'
import { standardFetcher } from 'modules/utils/standardFetcher'

import { Title } from 'modules/ui/Common/Title'
import { MotionCard } from 'modules/motions/ui/MotionCard'
import { MotionsGrid } from 'modules/motions/ui/MotionsGrid'

import type { Motion } from 'modules/motions/types'

export default function HomePage() {
  const { currentChain } = useConfig()
  const { initialLoading, data } = useSWR<{ motions: Motion[] }>(
    `/api/motions?chainId=${currentChain}`,
    standardFetcher,
  )

  return (
    <div>
      <Title>Active Motions</Title>
      <br />
      {initialLoading && <div>Loading...</div>}
      {!initialLoading && data && (
        <MotionsGrid>
          {data.motions.map((motion, i) => (
            <MotionCard key={i} motion={motion} />
          ))}
        </MotionsGrid>
      )}
    </div>
  )
}
