import { flow, map, orderBy } from 'lodash/fp'
import { useMemo } from 'react'

import { Container } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { Title } from 'modules/shared/ui/Common/Title'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MotionsGrid } from 'modules/motions/ui/MotionsGrid'
import { MotionCardPreview } from 'modules/motions/ui/MotionCardPreview'

import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { formatMotionDataOnchain } from 'modules/motions/utils/formatMotionDataOnchain'
import { Motion } from 'modules/motions/types'

export default function HomePage() {
  const { initialLoading, data: motionsRaw } = ContractEasyTrack.useSwrRpc(
    'getMotions',
    [],
  )

  const motions = useMemo(
    () =>
      motionsRaw
        ? (flow(
            map(formatMotionDataOnchain),
            orderBy('id', 'desc'),
          )(motionsRaw) as Motion[])
        : null,
    [motionsRaw],
  )

  return (
    <Container as="main" size="full">
      <Title title="Active Motions" subtitle="Select the card to see details" />
      {initialLoading && <PageLoader />}
      {!initialLoading && (!motions || motions.length === 0) && (
        <Text size={16} weight={500} isCentered color="textSecondary">
          No active motions at the moment
        </Text>
      )}
      {!initialLoading && motions && motions.length > 0 && (
        <MotionsGrid>
          {motions.map(motion => (
            <MotionCardPreview key={motion.id} motion={motion} />
          ))}
        </MotionsGrid>
      )}
    </Container>
  )
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
