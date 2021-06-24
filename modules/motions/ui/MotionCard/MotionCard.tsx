import { Wrap, FieldWrap, FieldLabel, FieldText } from './MotionCardStyle'
import type { Motion } from 'modules/motions/types'

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
      <Field label="ScriptFactory" text={motion.evmScriptFactory} />
      <Field label="Creator" text={motion.creator} />
      <Field label="Duration" text={motion.duration} />
      <Field label="StartDate" text={motion.startDate} />
      <Field label="SnapshotBlock" text={motion.snapshotBlock} />
      <Field label="ObjectionsThreshold" text={motion.objectionsThreshold} />
      <Field label="ObjectionsAmount" text={motion.objectionsAmount} />
      <Field label="ObjectionsAmountPct" text={motion.objectionsAmountPct} />
      <Field label="EvmScriptHash" text={motion.evmScriptHash} />
      <Field label="EvmScriptCallData" text={motion.evmScriptCallData} />
    </Wrap>
  )
}
