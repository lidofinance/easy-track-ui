// import { formatEther } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'
import { useLDOTotalSupply } from 'modules/tokens/hooks/useLDOTotalSupply'
import type { Motion } from 'modules/motions/types'
import { formatToken } from 'modules/tokens/utils/formatToken'

type Props = {
  motion: Motion
}

export function MotionObjectionsBar({ motion }: Props) {
  const { data: ldoSupply, initialLoading: isLoadingSupply } =
    useLDOTotalSupply()

  const thresholdPct = motion.objectionsThreshold / 100
  const thresholdAmount = ldoSupply
    ? ldoSupply.mul(BigNumber.from(thresholdPct))
    : 'Loading...'

  return (
    <>
      Threshold: {thresholdAmount}LDO {thresholdPct}%
      <br />
      Amount: {motion.objectionsAmount}LDO ({motion.objectionsAmountPct / 100}%)
      <br />
      Total supply:{' '}
      {isLoadingSupply || !ldoSupply
        ? 'Loading...'
        : formatToken(ldoSupply, 'LDO')}
    </>
  )
}
