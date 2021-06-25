import { AddressWithPop } from 'modules/ui/Common/AddressWithPop'
import { Text } from 'modules/ui/Common/Text'
import { FormattedDate } from 'modules/ui/Utils/FormattedDate'
import { FormattedDuration } from 'modules/ui/Utils/FormattedDuration'
import { Wrap, Row, FieldWrap, FieldLabel, FieldText } from './MotionCardStyle'
import type { Motion } from 'modules/motions/types'
import { getMotionType } from 'modules/motions/utils/getMotionType'

type FieldProps = {
  label: React.ReactNode
  text: React.ReactNode
  isHoverable?: boolean
}

function Field({ label, text, isHoverable }: FieldProps) {
  return (
    <FieldWrap>
      <FieldLabel size={14} weight={400} children={label} />
      <FieldText isHoverable={isHoverable}>
        <Text size={16} weight={500} children={text} />
      </FieldText>
    </FieldWrap>
  )
}

type Props = {
  motion: Motion
}

export function MotionCard({ motion }: Props) {
  return (
    <Wrap>
      <Row>
        <Text size={14} weight={500}>
          #{motion.id} {getMotionType(motion.evmScriptFactory)}
        </Text>
        <AddressWithPop diameter={20} symbols={4} address={motion.creator} />
      </Row>

      <Field label="Snapshot" text={motion.snapshotBlock} />
      <Field label="ObjectionsThreshold" text={motion.objectionsThreshold} />
      <Field label="ObjectionsAmount" text={motion.objectionsAmount} />
      <Field label="ObjectionsAmountPct" text={motion.objectionsAmountPct} />
      <Field label="EvmScriptHash" text={motion.evmScriptHash} isHoverable />
      <Field label="EvmScriptCallData" text={motion.evmScriptCallData} />

      <Row>
        <Text size={14} weight={500}>
          <FormattedDate date={motion.startDate} format="DD MMM h:mma" />
          <span> –</span>
          <br />
          <span>
            <FormattedDate
              date={motion.startDate + motion.duration}
              format="DD MMM h:mma"
            />{' '}
            <Text as="span" size={14} weight={400}>
              (<FormattedDuration value={motion.duration} unit="seconds" />)
            </Text>
          </span>
        </Text>
      </Row>
    </Wrap>
  )
}
