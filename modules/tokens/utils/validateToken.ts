import { utils } from 'ethers'

export const validateToken = (value: string) => {
  if (Number(value) < 0) {
    return 'Must not be negative'
  }
  try {
    utils.parseEther(value)
    return null
  } catch (_) {
    return 'Unable to parse'
  }
}
