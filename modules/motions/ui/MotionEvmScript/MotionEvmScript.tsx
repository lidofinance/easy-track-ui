import { useMemo, useState } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useEVMScriptDecoder } from 'modules/motions/hooks/useEVMScriptDecoder'

import { Button } from '@lidofinance/lido-ui'
import { ScriptBox, Actions } from './MotionEvmScriptStyle'

import type { Motion } from 'modules/motions/types'
import { getMotionCreatedEvent } from 'modules/motions/utils'
import { ContractEasyTrack } from 'modules/blockChain/contracts'

type Props = {
  motion: Motion
}

const DisplayTypes = ['Parsed', 'JSON', 'Raw'] as const
type DisplayType = typeof DisplayTypes[number]

const stringifyArray = (arr: any[], separator = ',\n'): string => {
  const result = arr
    .map(item => {
      if (Array.isArray(item)) {
        return `[${stringifyArray(item, ', ')}]`
      }
      return item.toString()
    })
    .join(separator)

  return result
}

export function MotionEvmScript({ motion }: Props) {
  const [currentDisplayType, setDisplayType] = useState<DisplayType>(
    DisplayTypes[0],
  )
  const easyTrack = ContractEasyTrack.useRpc()

  const decoder = useEVMScriptDecoder()

  const { data: scriptData, initialLoading: isScriptLoading } = useSWR(
    `script-${motion.id}`,
    async () => {
      const motionCreatedEvent = await getMotionCreatedEvent(
        easyTrack,
        motion.id,
        motion.snapshotBlock,
      )

      const decoded = await decoder.decodeEVMScript(
        motionCreatedEvent._evmScript,
      )

      return {
        raw: motionCreatedEvent._evmScript,
        decoded,
      }
    },
  )

  const formattedScript = useMemo(() => {
    if (!scriptData) return ''
    switch (currentDisplayType) {
      case 'Parsed':
        return scriptData.decoded.calls
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
              res += '[abi not found]'
            }

            res += '\n\nCall data:\n'
            if (decodedCallData) {
              res += decodedCallData
                .map((data, i) => {
                  if (Array.isArray(data)) {
                    return `[${i}] [${stringifyArray(data)}]`
                  }
                  return `[${i}] ${data}`
                })
                .join('\n')
            } else {
              res += '[call data not found]'
            }

            res += '\n'

            return res
          })
          .join('\n')

      case 'JSON':
        return JSON.stringify(scriptData.decoded, null, 2)

      case 'Raw':
        return scriptData.raw

      default:
        return ''
    }
  }, [currentDisplayType, scriptData])

  if (isScriptLoading) {
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
