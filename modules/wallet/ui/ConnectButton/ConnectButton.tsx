import Image from 'next/image'
import type { ButtonProps } from '@lidofinance/lido-ui'
import { Wrap, Icon } from './ConnectButtonStyle'

export type Props = ButtonProps & {
  iconSrc: StaticImageData
}

export function ConnectButton(props: Props) {
  const { iconSrc, children, ...rest } = props

  return (
    <Wrap {...rest}>
      <div>{children}</div>
      <Icon>
        <Image src={iconSrc} alt="" />
      </Icon>
    </Wrap>
  )
}
