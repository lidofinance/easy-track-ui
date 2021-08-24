import styled from 'styled-components'

import { useSWRInfinite } from 'modules/network/hooks/useSwr'
import { useSubgraphUrl } from 'modules/network/hooks/useSubgraphUrl'

import { Button, Container } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
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
  const subgraphUrl = useSubgraphUrl()

  const { initialLoading, isValidating, data, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      !previousPageData || previousPageData.length === PAGE_SIZE
        ? [
            subgraphUrl,
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
    </Container>
  )
}
