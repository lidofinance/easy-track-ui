import { useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'
import { useScrollLock } from 'modules/shared/hooks/useScrollLock'

import Link from 'next/link'
import Image from 'next/image'
import { Text } from 'modules/shared/ui/Common/Text'
import { HeaderWallet } from '../HeaderWallet'
import {
  Wrap,
  Logo,
  Nav,
  NavItems,
  NavLink,
  ActionsDesktop,
  Network,
  NetworkBulb,
  BurgerWrap,
  BurgerLine,
  MobileMenu,
  MobileMenuScroll,
  MobileNavItems,
  MobileNetworkWrap,
  MobileSpacer,
} from './HeaderStyle'
import ActiveMotionsSVG from './icons/active_motions.svg.react'
import ArchiveSVG from './icons/archive.svg.react'
// import InfoSVG from './icons/info.svg.react'
import StartSVG from './icons/start.svg.react'

import { getChainColor, getChainName } from 'modules/blockChain/chains'
import logoSrc from 'assets/logo.com.svg'
import * as urls from 'modules/network/utils/urls'

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
  const [isBurgerOpened, setBurgerOpened] = useState(false)
  useScrollLock(isBurgerOpened)

  return (
    <>
      <Wrap>
        <Nav>
          <Logo>
            <Image src={logoSrc} alt="Lido" />
          </Logo>
          <NavItems>
            <NavItem
              link={urls.home}
              icon={<ActiveMotionsSVG />}
              children="Active motions"
            />
            <NavItem
              link={urls.archive}
              icon={<ArchiveSVG />}
              children="Archive"
            />
            <NavItem
              link={urls.startMotion}
              icon={<StartSVG />}
              children="Start motion"
            />
            {/* <NavItem link={urls.about} icon={<InfoSVG />} children="About" /> */}
          </NavItems>
        </Nav>

        <ActionsDesktop>
          <Network>
            <NetworkBulb color={getChainColor(currentChain)} />
            <Text size={14} weight={500}>
              {getChainName(currentChain)}
            </Text>
          </Network>
          <HeaderWallet />
        </ActionsDesktop>

        <BurgerWrap
          isOpened={isBurgerOpened}
          onClick={() => setBurgerOpened(!isBurgerOpened)}
        >
          <BurgerLine />
          <BurgerLine />
          <BurgerLine />
        </BurgerWrap>

        {isBurgerOpened && (
          <MobileMenu>
            <MobileMenuScroll>
              <MobileNavItems>
                <NavItem
                  link={urls.home}
                  icon={<ActiveMotionsSVG />}
                  children="Active motions"
                />
                <NavItem
                  link={urls.archive}
                  icon={<ArchiveSVG />}
                  children="Archive"
                />
                <NavItem
                  link={urls.startMotion}
                  icon={<StartSVG />}
                  children="Start motion"
                />
                {/* <NavItem link={urls.about} icon={<InfoSVG />} children="About" /> */}
              </MobileNavItems>
              <MobileNetworkWrap>
                <Network>
                  <NetworkBulb color={getChainColor(currentChain)} />
                  <Text size={14} weight={500}>
                    {getChainName(currentChain)}
                  </Text>
                </Network>
                <HeaderWallet />
              </MobileNetworkWrap>
            </MobileMenuScroll>
          </MobileMenu>
        )}
      </Wrap>
      <MobileSpacer />
    </>
  )
}
