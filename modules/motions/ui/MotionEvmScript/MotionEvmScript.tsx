import { useMemo, useState } from 'react'
import { useSWR } from 'modules/shared/hooks/useSwr'
import { useMotionCreatedEvent } from 'modules/motions/hooks/useMotionCreatedEvent'
import { useEVMScriptDecoder } from 'modules/motions/hooks/useEVMScriptDecoder'

import { Button } from '@lidofinance/lido-ui'
import { ScriptBox, Actions } from './MotionEvmScriptStyle'

import type { Motion } from 'modules/motions/types'

type Props = {
  motion: Motion
}

const DisplayTypes = ['Parsed', 'JSON', 'Raw'] as const
type DisplayType = typeof DisplayTypes[number]

export function MotionEvmScript({ motion }: Props) {
  const [currentDisplayType, setDisplayType] = useState<DisplayType>(
    DisplayTypes[0],
  )

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

  const formattedScript = useMemo(() => {
    if (!script || !decoded) return ''
    switch (currentDisplayType) {
      case 'Parsed':
        return decoded.calls
          .map(callInfo => {
            const { address, abi, decodedCallData } = callInfo

            let res = `Calls on address:\n${address}`

            res += '\n\nCode:\n'

            if (abi) {
              let inputsFormatted = abi.inputs
                ?.map(input => `\n\t${input.type} ${input.name}`)
                .join(',')
              if (inputsFormatted) inputsFormatted += '\n'

              res += `${abi.type} ${abi.name} (${inputsFormatted})`
            } else {
              res += '[abi data not found]'
            }

            res += '\n\nCall data:\n'
            if (decodedCallData) {
              res += decodedCallData
                .map((data, i) => `[${i}] ${data}`)
                .join('\n')
            } else {
              res += '[call data not found]'
            }

            res += '\n'

            return res
          })
          .join('\n')

      case 'JSON':
        return JSON.stringify(decoded, null, 2)

      case 'Raw':
        return script

      default:
        return ''
    }
  }, [currentDisplayType, decoded, script])

  if (isLoading) {
    return <>Loading...</>
  }

  return (
    <>
      <Actions>
        {DisplayTypes.map(displayType => (
          <Button
            key={displayType}
            variant={currentDisplayType === displayType ? 'filled' : 'outlined'}
            size="xxs"
            children={displayType}
            onClick={() => setDisplayType(displayType)}
          />
        ))}
      </Actions>
      <ScriptBox value={formattedScript} />
    </>
  )
}
