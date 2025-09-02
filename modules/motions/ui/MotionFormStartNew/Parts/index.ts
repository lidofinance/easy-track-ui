import { MotionTypeForms } from 'modules/motions/types'

import * as formAllowedRecipientAdd from './StartNewAllowedRecipientAdd'
import * as formAllowedRecipientRemove from './StartNewAllowedRecipientRemove'
import * as formAllowedRecipientTopUp from './StartNewAllowedRecipientTopUp'
import * as StartNewTopUpWithLimits from './StartNewTopUpWithLimits'
import * as StartNewTopUpWithLimitsAndCustomToken from './StartNewTopUpWithLimitsAndCustomToken'
import * as StartSDVTNodeOperatorsAdd from './StartSDVTNodeOperatorsAdd'
import * as StartNewSDVTNodeOperatorsActivate from './StartNewSDVTNodeOperatorsActivate'
import * as StartNewSDVTNodeOperatorsDeactivate from './StartNewSDVTNodeOperatorsDeactivate'
import * as StartNewSDVTVettedValidatorsLimitsSet from './StartNewSDVTVettedValidatorsLimitsSet'
import * as StartNewSDVTTargetValidatorLimitsUpdateV2 from './StartNewSDVTTargetValidatorLimitsUpdateV2'
import * as StartNewSDVTNodeOperatorRewardAddressesSet from './StartNewSDVTNodeOperatorRewardAddressesSet'
import * as StartNewSDVTNodeOperatorNamesSet from './StartNewSDVTNodeOperatorNamesSet'
import * as StartNewSDVTNodeOperatorManagersChange from './StartNewSDVTNodeOperatorManagersChange'
import * as StartNewNodeOperatorLimitIncrease from './StartNewNodeOperatorLimitIncrease'
import * as StartNewCSMSettleElStealingPenalty from './StartNewCSMSettleElStealingPenalty'
import * as StartNewMEVBoostRelaysAdd from './StartNewMEVBoostRelaysAdd'
import * as StartNewMEVBoostRelaysRemove from './StartNewMEVBoostRelaysRemove'
import * as StartNewMEVBoostRelaysEdit from './StartNewMEVBoostRelaysEdit'
import * as StartNewCSMSetVettedGateTree from './StartNewCSMSetVettedGateTree'

export const formParts = {
  [MotionTypeForms.NodeOperatorIncreaseLimit]:
    StartNewNodeOperatorLimitIncrease.formParts({
      motionType: MotionTypeForms.NodeOperatorIncreaseLimit,
    }),
  [MotionTypeForms.AllowedRecipientTopUpTrpLdo]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.AllowedRecipientTopUpTrpLdo,
    }),
  [MotionTypeForms.LegoLDOTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.LegoLDOTopUp,
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
  [MotionTypeForms.RewardsShareProgramAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.RewardsShareProgramAdd,
  }),
  [MotionTypeForms.RewardsShareProgramRemove]:
    formAllowedRecipientRemove.formParts({
      registryType: MotionTypeForms.RewardsShareProgramRemove,
    }),
  [MotionTypeForms.RewardsShareProgramTopUp]:
    formAllowedRecipientTopUp.formParts({
      registryType: MotionTypeForms.RewardsShareProgramTopUp,
    }),
  [MotionTypeForms.SDVTNodeOperatorsAdd]: StartSDVTNodeOperatorsAdd.formParts(),
  [MotionTypeForms.SDVTNodeOperatorsActivate]:
    StartNewSDVTNodeOperatorsActivate.formParts,
  [MotionTypeForms.SDVTNodeOperatorsDeactivate]:
    StartNewSDVTNodeOperatorsDeactivate.formParts,
  [MotionTypeForms.SDVTVettedValidatorsLimitsSet]:
    StartNewSDVTVettedValidatorsLimitsSet.formParts,
  [MotionTypeForms.SDVTTargetValidatorLimitsUpdateV2]:
    StartNewSDVTTargetValidatorLimitsUpdateV2.formParts,
  [MotionTypeForms.SDVTNodeOperatorRewardAddressesSet]:
    StartNewSDVTNodeOperatorRewardAddressesSet.formParts,
  [MotionTypeForms.SDVTNodeOperatorNamesSet]:
    StartNewSDVTNodeOperatorNamesSet.formParts,
  [MotionTypeForms.SDVTNodeOperatorManagerChange]:
    StartNewSDVTNodeOperatorManagersChange.formParts,
  [MotionTypeForms.SandboxNodeOperatorIncreaseLimit]:
    StartNewNodeOperatorLimitIncrease.formParts({
      motionType: MotionTypeForms.SandboxNodeOperatorIncreaseLimit,
    }),
  [MotionTypeForms.SandboxStablesAdd]: formAllowedRecipientAdd.formParts({
    registryType: MotionTypeForms.SandboxStablesAdd,
  }),
  [MotionTypeForms.SandboxStablesRemove]: formAllowedRecipientRemove.formParts({
    registryType: MotionTypeForms.SandboxStablesRemove,
  }),
  [MotionTypeForms.SandboxStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.SandboxStablesTopUp,
    }),
  [MotionTypeForms.LegoStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.LegoStablesTopUp,
    }),
  [MotionTypeForms.StonksStethTopUp]: StartNewTopUpWithLimits.formParts({
    registryType: MotionTypeForms.StonksStethTopUp,
  }),
  [MotionTypeForms.StonksStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.StonksStablesTopUp,
    }),
  [MotionTypeForms.CSMSettleElStealingPenalty]:
    StartNewCSMSettleElStealingPenalty.formParts,
  [MotionTypeForms.AllianceOpsStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.AllianceOpsStablesTopUp,
    }),
  [MotionTypeForms.EcosystemOpsStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.EcosystemOpsStablesTopUp,
    }),
  [MotionTypeForms.LabsOpsStablesTopUp]:
    StartNewTopUpWithLimitsAndCustomToken.formParts({
      registryType: MotionTypeForms.LabsOpsStablesTopUp,
    }),
  [MotionTypeForms.MEVBoostRelaysAdd]: StartNewMEVBoostRelaysAdd.formParts,
  [MotionTypeForms.MEVBoostRelaysRemove]:
    StartNewMEVBoostRelaysRemove.formParts,
  [MotionTypeForms.MEVBoostRelaysEdit]: StartNewMEVBoostRelaysEdit.formParts,
  [MotionTypeForms.CSMSetVettedGateTree]:
    StartNewCSMSetVettedGateTree.formParts,
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
