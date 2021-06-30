import { formatEther } from '@ethersproject/units'
import { useMemo } from 'react'
import { useLDOTotalSupply } from 'modules/tokens/hooks/useLDOTotalSupply'

import { Text } from 'modules/shared/ui/Common/Text'
import { Bar, Progress, Row, Col } from './MotionObjectionsBarStyle'

import type { Motion } from 'modules/motions/types'

type Props = {
  motion: Motion
}

export function MotionObjectionsBar({ motion }: Props) {
  const { data: totalSupply, initialLoading: isLoadingSupply } =
    useLDOTotalSupply()

  const formatted = useMemo(() => {
    if (!totalSupply || isLoadingSupply) {
      return false
    }

    const thresholdPct = motion.objectionsThreshold / 100
    const totalSupplyNumber = Number(formatEther(totalSupply))
    const objectionsAmount = Number(formatEther(motion.objectionsAmount))
    const thresholdAmount = (totalSupplyNumber * thresholdPct) / 100
    const objectionsPct = (objectionsAmount / thresholdAmount) * 100

    return {
      thresholdPct,
      thresholdAmount,
      objectionsPct,
      objectionsAmount,
    }
  }, [isLoadingSupply, motion, totalSupply])

  if (!formatted) return <>Loading..</>

  return (
    <>
      <Bar>
        <Progress style={{ width: `${formatted.objectionsPct}%` }} />
      </Bar>
      <Row>
        <Col>
          <Text size={14} weight={400}>
            {formatted.objectionsPct}% / {formatted.objectionsAmount} LDO
          </Text>
        </Col>
        <Col>
          <Text size={14} weight={400}>
            {formatted.thresholdAmount} LDO / {formatted.thresholdPct}%
          </Text>
        </Col>
      </Row>
    </>
  )
}
