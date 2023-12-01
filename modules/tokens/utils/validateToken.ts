import { utils } from 'ethers'

export const validateToken = (value: string) => {
  if (Number(value) <= 0) {
    return 'Must be positive'
  }
  try {
    utils.parseEther(value)
    return null
  } catch (_) {
    return 'Unable to parse'
  }
}
