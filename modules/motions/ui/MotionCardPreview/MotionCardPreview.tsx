import { useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { AddressWithPop } from 'modules/shared/ui/Common/AddressWithPop'
import { Text } from 'modules/shared/ui/Common/Text'
import { MotionDate } from '../MotionDate'
import { MotionObjectionsBar } from '../MotionObjectionsBar'
import { MotionDescription } from '../MotionDescription'
import {
  Wrap,
  Row,
  FieldWrap,
  FieldLabel,
  FieldText,
} from './MotionCardPreviewStyle'

import * as urls from 'modules/shared/utils/urls'
import type { Motion } from 'modules/motions/types'
import { getMotionTypeByScriptFactory } from 'modules/motions/utils/getMotionType'
import { getMotionTypeDisplayName } from 'modules/motions/utils/getMotionTypeDisplayName'

type FieldProps = {
  label: React.ReactNode
  text: React.ReactNode
  isHoverable?: boolean
}

function Field({ label, text, isHoverable }: FieldProps) {
  return (
    <FieldWrap>
      <FieldLabel size={14} weight={400} children={label} />
      <FieldText isHoverable={isHoverable}>
        <Text size={16} weight={500} children={text} />
      </FieldText>
    </FieldWrap>
  )
}

type Props = {
  motion: Motion
}

export function MotionCardPreview({ motion }: Props) {
  const router = useRouter()
  const currentChainId = useCurrentChain()

  const goToDetails = useCallback(() => {
    router.push(urls.motionDetails(motion.id))
  }, [router, motion.id])

  return (
    <Wrap onClick={goToDetails}>
      <Row>
        <Text size={14} weight={500}>
          #{motion.id}{' '}
          {getMotionTypeDisplayName(
            getMotionTypeByScriptFactory(
              currentChainId,
              motion.evmScriptFactory,
            ),
          )}
        </Text>
        <AddressWithPop diameter={20} symbols={4} address={motion.creator} />
      </Row>

      <Field label="Status" text={motion.status} />

      <FieldWrap>
        <Text
          size={16}
          weight={400}
          children={<MotionDescription motion={motion} />}
        />
      </FieldWrap>

      <Row>
        <MotionDate fontSize={14} fontWeight={500} motion={motion} />
      </Row>

      <MotionObjectionsBar motion={motion} />
    </Wrap>
  )
}
