import { useRouter } from 'next/dist/client/router'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import Link from 'next/link'
import Image from 'next/image'
import { Text } from 'modules/shared/ui/Common/Text'
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
import ActiveMotionsSVG from './icons/active_motions.svg.react'
import ArchiveSVG from './icons/archive.svg.react'
import InfoSVG from './icons/info.svg.react'
import StartSVG from './icons/start.svg.react'

import { getChainColor, getChainName } from 'modules/blockChain/chains'
import logoSrc from 'assets/logo.com.svg'
import * as urls from 'modules/shared/utils/urls'

function NavItem({
  link,
  icon,
  children,
}: {
  link: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <Link passHref href={link}>
      <NavLink isActive={router.pathname === link}>
        {icon}
        <div>{children}</div>
      </NavLink>
    </Link>
  )
}

export function Header() {
  const currentChain = useCurrentChain()

  return (
    <Wrap>
      <Nav>
        <Logo>
          <Image src={logoSrc} alt="Lido" />
        </Logo>
        <NavItem
          link={urls.home}
          icon={<ActiveMotionsSVG />}
          children="Active motions"
        />
        <NavItem link={urls.archive} icon={<ArchiveSVG />} children="Archive" />
        <NavItem
          link={urls.startMotion}
          icon={<StartSVG />}
          children="Start motion"
        />
        <NavItem link={urls.about} icon={<InfoSVG />} children="About" />
      </Nav>
      <Actions>
        <Network>
          <NetworkBulb color={getChainColor(currentChain)} />
          <Text size={14} weight={500}>
            {getChainName(currentChain)}
          </Text>
        </Network>
        <HeaderWallet />
      </Actions>
    </Wrap>
  )
}
