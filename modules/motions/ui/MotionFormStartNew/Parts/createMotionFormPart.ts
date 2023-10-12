import type { PopulatedTransaction } from 'ethers'
import type { MotionType } from 'modules/motions/types'
import type { ContractTypeEasyTrack } from 'modules/blockChain/contracts'

type Args<FormData> = {
  motionType: MotionType

  populateTx: (args: {
    formData: FormData
    contract: ContractTypeEasyTrack
    evmScriptFactory: string
  }) => Promise<PopulatedTransaction>

  getDefaultFormData: () => FormData

  Component: React.ComponentType<{
    fieldNames: Record<keyof FormData, string>
    submitAction: React.ReactNode
    getValues: any
  }>
}

export function createMotionFormPart<FormData extends object>({
  motionType,
  populateTx,
  Component,
  getDefaultFormData,
}: Args<FormData>) {
  const fieldNames = Object.keys(getDefaultFormData()).reduce(
    (res, key) => ({
      ...res,
      [key]: `${motionType}.${key}`,
    }),
    {} as Record<keyof FormData, string>,
  )
  return {
    populateTx,
    getDefaultFormData,
    fieldNames,
    Component,
  }
}
