export const validateTransitionLimit = (
  value: string,
  limit: number | '' | null | undefined,
  tokenLabel: string | undefined,
): string | null => {
  if (typeof limit !== 'number') {
    if (!tokenLabel) {
      return 'Per transaction limit is not defined'
    }

    return `Per transaction limit for ${tokenLabel} is not defined`
  }

  if (Number(value) > limit) {
    return `${
      tokenLabel ?? 'Token'
    } per transaction limit is ${limit.toLocaleString()}`
  }

  return null
}
