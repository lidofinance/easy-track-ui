import { MotionTypeForms } from 'modules/motions/types'

import * as formNodeOperators from './StartNewNodeOperators'
import * as formLEGO from './StartNewLEGO'
import * as formAllowedRecipientAdd from './StartNewAllowedRecipientAdd'
import * as formAllowedRecipientRemove from './StartNewAllowedRecipientRemove'
import * as formAllowedRecipientTopUp from './StartNewAllowedRecipientTopUp'
import * as StartNewTopUpWithLimits from './StartNewTopUpWithLimits'

export const formParts = {
  [MotionTypeForms.NodeOperatorIncreaseLimit]: formNodeOperators.formParts,
  [MotionTypeForms.LEGOTopUp]: formLEGO.formParts,
  [MotionTypeForms.AllowedRecipientTopUpTrpLdo]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.AllowedRecipientTopUpTrpLdo,
    }),
  [MotionTypeForms.LegoLDOTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.LegoLDOTopUp,
  }),
  [MotionTypeForms.LegoDAITopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.LegoDAITopUp,
  }),
  [MotionTypeForms.RccDAITopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.RccDAITopUp,
  }),
  [MotionTypeForms.PmlDAITopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.PmlDAITopUp,
  }),
  [MotionTypeForms.AtcDAITopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.AtcDAITopUp,
  }),
  [MotionTypeForms.GasFunderETHTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.GasFunderETHTopUp,
  }),
  [MotionTypeForms.StethRewardProgramAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.StethRewardProgramAdd,
  }),
  [MotionTypeForms.StethRewardProgramRemove]:
    formAllowedRecipientRemove.formParts({
      registryType: MotionTypeForms.StethRewardProgramRemove,
    }),
  [MotionTypeForms.StethRewardProgramTopUp]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.StethRewardProgramTopUp,
    }),
  [MotionTypeForms.StethGasSupplyAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.StethGasSupplyAdd,
  }),
  [MotionTypeForms.StethGasSupplyRemove]: formAllowedRecipientRemove.formParts({
    registryType: MotionTypeForms.StethGasSupplyRemove,
  }),
  [MotionTypeForms.StethGasSupplyTopUp]: formAllowedRecipientTopUp.formParts({
    registryType: MotionTypeForms.StethGasSupplyTopUp,
  }),
} as const

export type FormData = {
  motionType: MotionTypeForms | null
} & {
  [key in MotionTypeForms]: ReturnType<
    typeof formParts[key]['getDefaultFormData']
  >
}

export const getDefaultFormPartsData = () => {
  return Object.entries(formParts).reduce(
    (res, [type, part]) => ({
      ...res,
      [type]: part.getDefaultFormData(),
    }),
    {} as { [key in MotionTypeForms]: FormData[key] },
  )
}
