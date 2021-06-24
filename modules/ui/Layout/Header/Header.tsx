import { useConfig } from 'modules/config'
import Link from 'next/link'
import { Text } from 'modules/ui/Common/Text'
import { HeaderWallet } from '../HeaderWallet'
import {
  Wrap,
  Logo,
  Nav,
  NavLink,
  Actions,
  Network,
  NetworkBulb,
} from './HeaderStyle'
import { getChainColor, getChainName } from 'modules/blockChain/chains'
import LogoIcon from 'assets/logo.com.svg'
import * as urls from 'modules/utils/urls'

export function Header() {
  const { currentChain } = useConfig()

  return (
    <Wrap>
      <Nav>
        <Logo>
          <LogoIcon />
        </Logo>
        <Link passHref href={urls.home}>
          <NavLink>Active motions</NavLink>
        </Link>
        <Link passHref href={urls.archive}>
          <NavLink>Archive</NavLink>
        </Link>
        <Link passHref href={urls.startMotion}>
          <NavLink>Start motion</NavLink>
        </Link>
        <Link passHref href={urls.about}>
          <NavLink>About</NavLink>
        </Link>
      </Nav>
      <Actions>
        <Network>
          <NetworkBulb color={getChainColor(currentChain)} />
          <Text size={16} weight={400}>
            {getChainName(currentChain)}
          </Text>
        </Network>
        <HeaderWallet />
      </Actions>
    </Wrap>
  )
}
