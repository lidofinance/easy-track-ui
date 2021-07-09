import { useMotionCreatedEvent } from 'modules/motions/hooks/useMotionCreatedEvent'
import type { Motion } from 'modules/motions/types'

type Props = {
  motion: Motion
}

export function MotionEvmScript({ motion }: Props) {
  const { initialLoading: isLoading, data: motionEvent } =
    useMotionCreatedEvent(motion.id)

  const script = motionEvent?._evmScript

  if (isLoading) {
    return <>Loading...</>
  }

  return <>{script}</>
}
