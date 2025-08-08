export const validateBytes32 = (input: string) => {
  // Remove '0x' prefix if present
  const cleanInput = input.startsWith('0x') ? input.slice(2) : input

  // Check if it's exactly 64 hexadecimal characters
  const bytes32Regex = /^[0-9a-fA-F]{64}$/

  return bytes32Regex.test(cleanInput)
}
