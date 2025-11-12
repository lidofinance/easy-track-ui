import { StonksAbi } from 'generated'

export const getStonksVersion = async (
  stonks: StonksAbi,
): Promise<'v1' | 'v2'> => {
  try {
    await stonks.ORACLE_ROUTER()
    return 'v2'
  } catch (error) {
    return 'v1'
  }
}
