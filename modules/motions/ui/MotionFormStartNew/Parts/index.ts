import { MotionType } from 'modules/motions/types'

import * as formNodeOperators from './StartNewNodeOperators'
import * as formLEGO from './StartNewLEGO'
import * as formRewardProgramAdd from './StartNewRewardProgramAdd'
import * as formRewardProgramRemove from './StartNewRewardProgramRemove'
import * as formRewardProgramTopUp from './StartNewRewardProgramTopUp'

export const FormParts = {
  [MotionType.NodeOperatorLimit]: formNodeOperators.formParts,
  [MotionType.LEGOTopUp]: formLEGO.formParts,
  [MotionType.RewardProgramAdd]: formRewardProgramAdd.formParts,
  [MotionType.RewardProgramRemove]: formRewardProgramRemove.formParts,
  [MotionType.RewardProgramTopUp]: formRewardProgramTopUp.formParts,
} as const

export type FormData = {
  motionType: MotionType | null
} & {
  [key in MotionType]: ReturnType<typeof FormParts[key]['getDefaultFormData']>
}

export const getDefaultFormPartsData = () => {
  return Object.entries(FormParts).reduce(
    (res, [type, part]) => ({
      ...res,
      [type]: part.getDefaultFormData(),
    }),
    {} as { [key in MotionType]: FormData[key] },
  )
}
