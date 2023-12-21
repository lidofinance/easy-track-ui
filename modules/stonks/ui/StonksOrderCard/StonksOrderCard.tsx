import { ButtonIcon, trimAddress, Copy } from '@lidofinance/lido-ui'
import { useCopyToClipboard } from 'modules/shared/hooks/useCopyToClipboard'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { OrderDetailed } from 'modules/stonks/types'
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
  const handleCopyUid = useCopyToClipboard(order.uid ?? '')

  return (
    <Card>
      <OrderTitle>
        <div>
          Stonks Order <AddressInlineWithPop address={order.address} />
        </div>

        <div>
          <StatusLabel>Status</StatusLabel>
          <StatusValue
            isActive={order.status === 'open'}
            isCancelled={
              order.status === 'cancelled' || order.status === 'expired'
            }
          >
            {getOrderStatusText(order.status)}
          </StatusValue>
        </div>
      </OrderTitle>
      {order.uid ? (
        <Row>
          <div>Off-Chain UID</div>
          <div>
            {trimAddress(order.uid, 6)}
            <ButtonIcon
              onClick={handleCopyUid}
              icon={<Copy />}
              size="xs"
              variant="translucent"
              children="Copy"
            />
          </div>
        </Row>
      ) : null}
      <Row>
        <div>Stonks</div>
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
      <Row>
        <div>Recoverable amount</div>
        <div>
          {order.recoverableAmount} {order.sellTokenLabel}
        </div>
      </Row>
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
