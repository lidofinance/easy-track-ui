import { Button } from '@lidofinance/lido-ui'
import { stonksInstance } from 'modules/network/utils/urls'
import { Text } from 'modules/shared/ui/Common/Text'
import { StonksData } from 'modules/stonks/types'
import { formatValue } from 'modules/stonks/utils/formatValue'
import { useRouter } from 'next/router'
import { Card, Grid } from './StonksGridStyle'

type Props = {
  stonksData: StonksData[]
}

export function StonksGrid({ stonksData }: Props) {
  const router = useRouter()

  return (
    <Grid>
      {stonksData.map(stonks => {
        const isZero = parseFloat(stonks.currentBalance) === 0
        return (
          <Card key={stonks.address}>
            <Text size={14} weight={800}>
              {stonks.tokenFrom.label}
              {'->'}
              {stonks.tokenTo.label}
            </Text>
            <Text size={12} color="textSecondary">
              Balance: {formatValue(stonks.currentBalance)}{' '}
              {stonks.tokenFrom.label}
            </Text>
            <Button
              size="xs"
              variant={isZero ? 'outlined' : 'filled'}
              onClick={() => router.push(stonksInstance(stonks.address))}
            >
              {isZero ? 'Inspect' : 'Create Order'}
            </Button>
          </Card>
        )
      })}
    </Grid>
  )
}
