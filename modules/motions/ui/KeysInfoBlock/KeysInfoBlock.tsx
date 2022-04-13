import { useCallback } from 'react'

import { Button } from '@lidofinance/lido-ui'
import { Text } from 'modules/shared/ui/Common/Text'
import { Block } from 'modules/shared/ui/Common/Block'
import { Row, Col, ColValue, ErrorMessageWrap } from './KeysInfoBlockStyle'

import type { KeysInfoOperator } from 'modules/motions/types'

type ErrorMessageProps = {
  error: string
}

function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <ErrorMessageWrap>
      {error} is found! Please, refrain from submitting new keys or starting
      motions to increase the limit and contact @team-tooling & @team-nom in
      discord immediately
    </ErrorMessageWrap>
  )
}

type Props = {
  keys: KeysInfoOperator
}

export function KeysInfoBlock({ keys }: Props) {
  const hasInvalid = keys.invalid.length > 0
  const hasDuplicates = keys.duplicates.length > 0

  const handleClickTooling = useCallback(() => {
    window.open(
      'https://discord.com/channels/761182643269795850/931178060999442452',
      '_blank',
    )
  }, [])

  const handleClickNom = useCallback(() => {
    window.open(
      'https://discord.com/channels/761182643269795850/951800310488248381',
      '_blank',
    )
  }, [])

  return (
    <>
      <Block>
        <Row>
          <Col>
            <ColValue>
              <Text as="span" size={18} weight={800}>
                {keys.info.usedSigningKeys}
              </Text>
              <Text as="span" color="textSecondary" size={18} weight={800}>
                {' '}
                / {keys.info.totalSigningKeys}
              </Text>
            </ColValue>
            <Text color="textSecondary" size={12} weight={500}>
              Keys used
            </Text>
          </Col>

          <Col>
            <ColValue>
              <Text
                as="span"
                size={18}
                weight={800}
                color={hasInvalid ? 'error' : 'text'}
              >
                {keys.invalid.length}
              </Text>
            </ColValue>
            <Text
              size={12}
              weight={500}
              color={hasInvalid ? 'error' : 'textSecondary'}
            >
              Invalid signatures
            </Text>
          </Col>

          <Col>
            <ColValue>
              <Text
                as="span"
                size={18}
                weight={800}
                color={hasDuplicates ? 'error' : 'text'}
              >
                {keys.duplicates.length}
              </Text>
            </ColValue>
            <Text
              size={12}
              weight={500}
              color={hasDuplicates ? 'error' : 'textSecondary'}
            >
              Duplicate keys
            </Text>
          </Col>
        </Row>

        {hasInvalid && <ErrorMessage error="Invalid keys" />}
        {hasDuplicates && <ErrorMessage error="Duplicate keys" />}
      </Block>

      {(hasInvalid || hasDuplicates) && (
        <>
          <br />
          <Button fullwidth onClick={handleClickTooling}>
            Contact @team-tooling
          </Button>
          <br />
          <br />
          <Button fullwidth onClick={handleClickNom}>
            Contact @team-nom
          </Button>
        </>
      )}
    </>
  )
}
