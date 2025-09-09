import { useCallback } from 'react'

import { Button } from '@lidofinance/lido-ui'
import { Text, TextColor } from 'modules/shared/ui/Common/Text'
import { Block } from 'modules/shared/ui/Common/Block'
import { Row, Col, ColValue, ErrorMessageWrap } from './KeysInfoBlockStyle'

type ErrorMessageProps = {
  error: string
}

function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <ErrorMessageWrap>
      {error} found! Please, refrain from submitting new keys or starting
      motions to increase the limit and contact @team-nom in Discord immediately
    </ErrorMessageWrap>
  )
}

const getKeysColor = (
  keys: string[] | undefined,
  defaultColor?: TextColor,
): TextColor => {
  if (!keys) {
    return 'warning'
  }
  if (keys.length > 0) {
    return 'error'
  }
  return defaultColor ?? 'text'
}

type Props = {
  invalidKeys: string[] | undefined
  duplicateKeys: string[] | undefined
  usedSigningKeys: number
  totalSigningKeys: number
}

export function KeysInfoBlock({
  invalidKeys,
  duplicateKeys,
  usedSigningKeys,
  totalSigningKeys,
}: Props) {
  const hasInvalid = !!invalidKeys?.length
  const hasDuplicates = !!duplicateKeys?.length

  const handleClickContact = useCallback(() => {
    window.open(
      'https://discord.com/channels/761182643269795850/892403983925256212',
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
                {usedSigningKeys}
              </Text>
              <Text as="span" color="textSecondary" size={18} weight={800}>
                {' '}
                / {totalSigningKeys}
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
                color={getKeysColor(invalidKeys)}
              >
                {invalidKeys?.length ?? 'N/A'}
              </Text>
            </ColValue>
            <Text
              size={12}
              weight={500}
              color={getKeysColor(invalidKeys, 'textSecondary')}
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
                color={getKeysColor(duplicateKeys)}
              >
                {duplicateKeys?.length ?? 'N/A'}
              </Text>
            </ColValue>
            <Text
              size={12}
              weight={500}
              color={getKeysColor(duplicateKeys, 'textSecondary')}
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
          <Button fullwidth onClick={handleClickContact}>
            Contact in Discord
          </Button>
        </>
      )}

      <br />
    </>
  )
}
