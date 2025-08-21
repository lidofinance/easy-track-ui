export const validatePublicKey = (
  value: string | null | undefined,
): string | false => {
  const trimmedValue = value?.trim()
  if (!trimmedValue?.length) {
    return 'Key must not be empty'
  }

  if (!trimmedValue.startsWith('0x') || trimmedValue.length !== 98) {
    return 'Invalid key'
  }

  return false
}
