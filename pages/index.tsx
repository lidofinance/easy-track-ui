import orderBy from 'lodash/orderBy'

import { Container } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { Title } from 'modules/shared/ui/Common/Title'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MotionsGrid } from 'modules/motions/ui/MotionsGrid'
import { MotionCardPreview } from 'modules/motions/ui/MotionCardPreview'

import { ContractEasyTrack } from 'modules/blockChain/contracts'
import { formatMotionDataOnchain } from 'modules/motions/utils/formatMotionDataOnchain'
import { Motion } from 'modules/motions/types'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { getMotionCreatedEvent } from 'modules/motions/utils'

export default function HomePage() {
  const { chainId } = useWeb3()
  const easyTrack = ContractEasyTrack.useRpc()

  const { data: activeMotions, initialLoading } = useSWR(
    `active-motions-${chainId}`,
    async () => {
      const motions = await easyTrack.getMotions()
      let parsedMotionsWithScripts: Motion[] = []
      for (const motion of motions) {
        try {
          const event = await getMotionCreatedEvent(
            easyTrack,
            motion.id.toNumber(),
            motion.snapshotBlock.toNumber(),
          )

          parsedMotionsWithScripts.push(
            formatMotionDataOnchain(motion, event._evmScriptCallData),
          )
        } catch (error) {
          parsedMotionsWithScripts.push(
            formatMotionDataOnchain(motion, undefined),
          )
        }
      }

      return orderBy(parsedMotionsWithScripts, ['id'], ['desc'])
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return (
    <Container as="main" size="full">
      <Title title="Active Motions" subtitle="Select the card to see details" />
      {initialLoading && <PageLoader />}
      {!initialLoading && (!activeMotions || activeMotions.length === 0) && (
        <Text size={16} weight={500} isCentered color="textSecondary">
          No active motions at the moment
        </Text>
      )}
      {!initialLoading && activeMotions && activeMotions.length > 0 && (
        <MotionsGrid>
          {activeMotions.map(motion => (
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
