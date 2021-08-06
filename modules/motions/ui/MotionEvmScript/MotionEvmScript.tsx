import { useSWR } from 'modules/shared/hooks/useSwr'
import { useMotionCreatedEvent } from 'modules/motions/hooks/useMotionCreatedEvent'
import { useEVMScriptDecoder } from 'modules/motions/hooks/useEVMScriptDecoder'

import type { Motion } from 'modules/motions/types'

type Props = {
  motion: Motion
}

export function MotionEvmScript({ motion }: Props) {
  const { initialLoading: isLoadingEvent, data: motionEvent } =
    useMotionCreatedEvent(motion.id)

  const decoder = useEVMScriptDecoder()
  const script = motionEvent?._evmScript

  const { data: decoded, initialLoading: isLoadingDecoded } = useSWR(
    `script-${script}`,
    () => {
      if (!script) return null
      return decoder.decodeEVMScript(script)
    },
  )

  const isLoading = isLoadingEvent || isLoadingDecoded

  if (isLoading) {
    return <>Loading...</>
  }

  return (
    <>
      <div>
        <b>{script}</b>
      </div>
      <br />
      <pre
        style={{
          display: 'flex',
          maxWidth: '100%',
          whiteSpace: 'break-spaces',
        }}
      >
        {JSON.stringify(decoded, null, 2)}
      </pre>
    </>
  )
}
