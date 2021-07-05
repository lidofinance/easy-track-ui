import { MotionType } from 'modules/motions/types'
import type { ContractEasyTrack } from 'modules/blockChain/contracts'

type Args<FormData> = {
  motionType: MotionType

  onSubmit: (args: {
    formData: FormData
    contract: ContractEasyTrack
    evmScriptFactory: string
  }) => Promise<void>

  getDefaultFormData: () => FormData

  getComponent: (getComponent: {
    getFieldName: (name: keyof FormData) => string
  }) => React.ComponentType
}

export function createMotionFormPart<FormData>({
  motionType,
  onSubmit,
  getComponent,
  getDefaultFormData,
}: Args<FormData>) {
  const getFieldName = (name: keyof FormData) => `[${motionType}][${name}]`
  return {
    onSubmit,
    getDefaultFormData,
    Component: getComponent({ getFieldName }),
  }
}
