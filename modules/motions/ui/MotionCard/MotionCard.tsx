import { FormattedDate } from 'modules/ui/Utils/FormattedDate'
import { Wrap, FieldWrap, FieldLabel, FieldText } from './MotionCardStyle'
import type { Motion } from 'modules/motions/types'
import { getMotionType } from 'modules/motions/utils/getMotionType'

type FieldProps = {
  label: React.ReactNode
  text: React.ReactNode
}

function Field({ label, text }: FieldProps) {
  return (
    <FieldWrap>
      <FieldLabel size={14} weight={500} children={label} />
      <FieldText size={16} weight={400} children={text} />
    </FieldWrap>
  )
}

type Props = {
  motion: Motion
}

export function MotionCard({ motion }: Props) {
  return (
    <Wrap>
      <Field label="#" text={motion.id} />
      <Field label="Type" text={getMotionType(motion.evmScriptFactory)} />
      <Field label="Creator" text={motion.creator} />
      <Field label="Duration" text={motion.duration} />
      <Field
        label="Started"
        text={<FormattedDate date={motion.startDate} format="DD MMM h:mma" />}
      />
      <Field label="SnapshotBlock" text={motion.snapshotBlock} />
      <Field label="ObjectionsThreshold" text={motion.objectionsThreshold} />
      <Field label="ObjectionsAmount" text={motion.objectionsAmount} />
      <Field label="ObjectionsAmountPct" text={motion.objectionsAmountPct} />
      <Field label="EvmScriptHash" text={motion.evmScriptHash} />
      <Field label="EvmScriptCallData" text={motion.evmScriptCallData} />
    </Wrap>
  )
}
