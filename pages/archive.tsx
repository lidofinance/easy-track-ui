import { useSWR } from 'modules/shared/hooks/useSwr'

import { Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { MotionsGrid } from 'modules/motions/ui/MotionsGrid'
import { MotionCardPreview } from 'modules/motions/ui/MotionCardPreview'

import { fetchMotionsArchiveList } from 'modules/motions/utils/motionsArchiveFetchers'

export default function ArchivePage() {
  const { initialLoading, data: motions } = useSWR(
    'motions-archive',
    fetchMotionsArchiveList,
  )

  return (
    <Container as="main" size="full">
      <Title>Archive</Title>
      {initialLoading && <div>Loading...</div>}
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
