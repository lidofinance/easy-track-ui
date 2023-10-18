export const MOTION_ATTENTION_PERIOD = 1 / 24

export const tokenLimitError = (
  governanceSymbol: string | undefined,
  transitionLimit: number,
) =>
  `${governanceSymbol} transition is limited by ${transitionLimit.toLocaleString()}`

export const periodLimitError = () =>
  'The top-up is higher than the remaining current period limit'

export const noSigningKeysRoleError =
  'Address is not allowed to manage signing keys'
