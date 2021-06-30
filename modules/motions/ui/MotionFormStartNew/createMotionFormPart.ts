import { MotionType } from '../../types'
import { getScriptFactoryByMotionType } from '../../utils/getMotionType'
import type { ContractEasyTrack } from 'modules/blockChain/contracts'

type Args<FormData> = {
  motionType: MotionType

  getSubmitter: (args: {
    evmScriptFactory: string
  }) => (args: {
    formData: FormData
    contract: ContractEasyTrack
  }) => Promise<void>

  getDefaultFormData: () => FormData

  getComponent: (getComponent: {
    getFieldName: (name: keyof FormData) => string
  }) => React.ComponentType
}

export function createMotionFormPart<FormData>({
  motionType,
  getSubmitter,
  getComponent,
  getDefaultFormData,
}: Args<FormData>) {
  const getFieldName = (name: keyof FormData) => `[${motionType}][${name}]`
  const evmScriptFactory = getScriptFactoryByMotionType(motionType)
  return {
    onSubmit: getSubmitter({ evmScriptFactory }),
    getDefaultFormData,
    Component: getComponent({ getFieldName }),
  }
}
