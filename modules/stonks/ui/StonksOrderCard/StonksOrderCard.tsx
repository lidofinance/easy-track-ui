import { getEtherscanLink } from 'modules/blockChain/utils/etherscan'
import { trimAddress } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import { Text } from 'modules/shared/ui/Common/Text'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { OrderDetailed } from 'modules/stonks/types'
import { getOffChainOrderUrl } from 'modules/stonks/utils/getOffChainOrderUrl'
import { getOrderStatusText } from 'modules/stonks/utils/getOrderStatusText'
import moment from 'moment'
import { StonksOrderCardCreateButton } from './StonksOrderCardCreateButton'
import { StonksOrderCardRecoverButton } from './StonksOrderCardRecoverButton'
import {
  Card,
  Row,
  OrderTitle,
  StatusLabel,
  StatusValue,
  ButtonsRow,
  OrderUid,
  Link,
} from './StonksOrderCardStyle'

type Props = {
  order: OrderDetailed
  isDataValidating?: boolean
  onInvalidate?: () => void
}

export function StonksOrderCard({
  order,
  isDataValidating,
  onInvalidate,
}: Props) {
  const { chainId } = useWeb3()

  const orderLink = getOffChainOrderUrl(order.uid, chainId)
  return (
    <Card>
      <OrderTitle>
        <div>
          <OrderUid>
            Stonks order <AddressInlineWithPop address={order.address} />
          </OrderUid>
          <Text size={14} weight={800}>
            {order.sellTokenLabel} → {order.buyTokenLabel}
          </Text>
        </div>

        <div>
          <StatusLabel>Status</StatusLabel>
          <StatusValue value={order.status}>
            {getOrderStatusText(order.status)}
          </StatusValue>
        </div>
      </OrderTitle>
      {order.uid ? (
        <Row>
          <div>Off-Chain Order</div>
          {orderLink ? (
            <Link href={orderLink} target="_blank" rel="noreferrer">
              {trimAddress(order.uid, 6)}
            </Link>
          ) : (
            <div>{trimAddress(order.uid, 6)}</div>
          )}
        </Row>
      ) : null}
      <Row>
        <div>Stonks Contract</div>
        <AddressWithPop address={order.stonks} />
      </Row>
      <Row>
        <div>Receiver</div>
        <AddressWithPop address={order.receiver} />
      </Row>
      {order.creationDate ? (
        <Row>
          <div>Created at</div>
          <div>
            <FormattedDate
              date={moment(order.creationDate).unix()}
              format="MMM DD, YYYY hh:mma"
            />
          </div>
        </Row>
      ) : null}
      <Row>
        <div>Valid to</div>
        <div>
          <FormattedDate date={order.validTo} format="MMM DD, YYYY hh:mma" />
        </div>
      </Row>
      <Row>
        <div>Sell amount (executed/initial)</div>
        <div>
          {order.executedSellAmount}/{order.sellAmount} {order.sellTokenLabel} (
          {order.sellAmountFulfillment}%)
        </div>
      </Row>
      <Row>
        <div>Buy amount (executed/initial)</div>
        <div>
          {order.executedBuyAmount}/{order.buyAmount} {order.buyTokenLabel} (
          {order.buyAmountFulfillment}%)
        </div>
      </Row>

      {order.transactions?.length ? (
        <>
          {order.transactions.length > 1 ? (
            <>
              <Row>
                <div>Swap transactions:</div>
              </Row>
              {order.transactions.map(tx => (
                <Link
                  key={tx.txHash}
                  href={getEtherscanLink(chainId, tx.txHash, 'tx')}
                  target="_blank"
                  rel="noreferrer"
                >
                  {trimAddress(tx.txHash, 12)}
                </Link>
              ))}
            </>
          ) : (
            <Row>
              <div>Swap transaction hash</div>{' '}
              <Link
                href={getEtherscanLink(
                  chainId,
                  order.transactions[0].txHash,
                  'tx',
                )}
                target="_blank"
                rel="noreferrer"
              >
                {trimAddress(order.transactions[0].txHash, 6)}
              </Link>
            </Row>
          )}
        </>
      ) : null}
      {order.isRecoverable && (
        <Row>
          <div>Recoverable amount</div>
          <div>
            {order.recoverableAmount} {order.sellTokenLabel}
          </div>
        </Row>
      )}
      {order.isCreatable || order.isRecoverable ? (
        <ButtonsRow>
          {order.isCreatable && (
            <StonksOrderCardCreateButton
              order={order}
              isDisabled={isDataValidating}
              onSuccess={onInvalidate}
            />
          )}
          {order.isRecoverable && (
            <StonksOrderCardRecoverButton
              orderAddress={order.address}
              variant={order.isCreatable ? 'outlined' : 'filled'}
              onFinish={onInvalidate}
            />
          )}
        </ButtonsRow>
      ) : null}
    </Card>
  )
}
