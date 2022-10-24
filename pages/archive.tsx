import styled from 'styled-components'

import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWRInfinite } from 'modules/network/hooks/useSwr'

import { Button, Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { WarningBox } from 'modules/shared/ui/Common/WarningBox'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { MotionsGrid } from 'modules/motions/ui/MotionsGrid'
import { MotionCardPreview } from 'modules/motions/ui/MotionCardPreview'

import {
  fetchMotionsSubgraphList,
  getQuerySubgraphMotions,
} from 'modules/motions/network/motionsSubgraphFetchers'

const LoadMoreWrap = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PAGE_SIZE = 8

export default function ArchivePage() {
  const { chainId } = useWeb3()

  const { initialLoading, isValidating, data, size, setSize, error } =
    useSWRInfinite(
      (pageIndex, previousPageData) =>
        !previousPageData || previousPageData.length === PAGE_SIZE
          ? [
              chainId,
              getQuerySubgraphMotions({
                first: PAGE_SIZE,
                skip: pageIndex * PAGE_SIZE,
              }),
            ]
          : null,
      fetchMotionsSubgraphList,
    )

  const motions = data?.flat()
  const hasMore = data && data[data.length - 1].length === PAGE_SIZE

  return (
    <Container as="main" size="full">
      <Title
        title="Archive Motions"
        subtitle="Select the card to see details"
      />
      {initialLoading && <PageLoader />}
      {!initialLoading && motions && (
        <MotionsGrid>
          {motions.map(motion => (
            <MotionCardPreview key={motion.id} motion={motion!} />
          ))}
        </MotionsGrid>
      )}
      {!initialLoading && hasMore && (
        <LoadMoreWrap>
          <Button
            type="button"
            onClick={() => setSize(size + 1)}
            children="Load more"
            loading={isValidating}
          />
        </LoadMoreWrap>
      )}
      {error?.message === 'indexing_error' && (
        <WarningBox>
          Failed to fetch data from the Subgraph.
          <br />
          Maintainers are notified and working on a fix.
        </WarningBox>
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
