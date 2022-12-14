import { LimitCheckerAbi } from 'generated'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'

export type LimitsType = {
  limit: string
  periodDurationMonths: number
}

export async function getLimits<
  T extends {
    getLimitParameters: LimitCheckerAbi['getLimitParameters']
  },
>(contract: T): Promise<LimitsType> {
  const [limit, periodDurationMonths] = await contract.getLimitParameters()

  return {
    limit: formatBalance(limit),
    periodDurationMonths: +periodDurationMonths,
  }
}
