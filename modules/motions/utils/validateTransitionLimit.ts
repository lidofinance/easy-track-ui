export const validateTransitionLimit = (
  value: string,
  limit: number | '' | null | undefined,
  tokenLabel: string | undefined,
): string | null => {
  if (typeof limit !== 'number') {
    if (!tokenLabel) {
      return 'Transition limit is not defined'
    }

    return `Transition limit for ${tokenLabel} is not defined`
  }

  if (Number(value) > limit) {
    return `${
      tokenLabel ?? 'Token'
    } transition is limited by ${limit.toLocaleString()}`
  }

  return null
}
