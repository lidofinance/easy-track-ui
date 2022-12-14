import { LimitCheckerAbi } from 'generated'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'

export type PeriodDataType = {
  alreadySpentAmount: string
  spendableBalanceInPeriod: string
  periodStartTimestamp: number
  periodEndTimestamp: number
}

export async function getPeriodData<
  T extends {
    getPeriodState: LimitCheckerAbi['getPeriodState']
  },
>(contract: T): Promise<PeriodDataType> {
  const [
    alreadySpentAmount,
    spendableBalanceInPeriod,
    periodStartTimestamp,
    periodEndTimestamp,
  ] = await contract.getPeriodState()

  return {
    alreadySpentAmount: formatBalance(alreadySpentAmount),
    spendableBalanceInPeriod: formatBalance(spendableBalanceInPeriod),
    periodStartTimestamp: periodStartTimestamp.toNumber(),
    periodEndTimestamp: periodEndTimestamp.toNumber(),
  }
}
