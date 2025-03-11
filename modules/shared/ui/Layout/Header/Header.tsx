import { useState, useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useScrollLock } from 'modules/shared/hooks/useScrollLock'
import Link from 'next/link'
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
import { getChainName } from 'modules/blockChain/chains'
import { getChainColor } from '@lido-sdk/constants'
import LidoLogoSvg from 'assets/logo.com.svg.react'
import * as urls from 'modules/network/utils/urls'
import { NoSSRWrapper } from 'modules/shared/ui/Utils/NoSSRWrapper'
import StonksSVG from './icons/stonks.svg.react'
import SettingsSVG from './icons/settings.svg.react'
import { useAvailableStonks } from 'modules/stonks/hooks/useAvailableStonks'
import { ButtonIcon } from '@lidofinance/lido-ui'

function NavItem({
  link,
  icon,
  onClick,
  children,
}: {
  link: string
  icon: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLElement>
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <Link passHref href={link}>
      <NavLink isActive={router.pathname === link} onClick={onClick}>
        {icon}
        <div>{children}</div>
      </NavLink>
    </Link>
  )
}

export function Header() {
  const { chainId } = useWeb3()
  const [isBurgerOpened, setBurgerOpened] = useState(false)
  const handleCloseMobileMenu = useCallback(() => setBurgerOpened(false), [])
  useScrollLock(isBurgerOpened)

  const { areStonksAvailable } = useAvailableStonks()

  return (
    <>
      <Wrap>
        <Nav>
          <Logo>
            <LidoLogoSvg />
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
            {areStonksAvailable && (
              <NavItem
                link={urls.stonks}
                icon={<StonksSVG />}
                children="Stonks"
              />
            )}
            {/* <NavItem link={urls.about} icon={<InfoSVG />} children="About" /> */}
          </NavItems>
        </Nav>

        <ActionsDesktop>
          <Network>
            <NetworkBulb color={getChainColor(chainId)} />
            <Text size={14} weight={500}>
              {getChainName(chainId)}
            </Text>
          </Network>
          <NoSSRWrapper>
            <HeaderWallet />
            <Link passHref href={urls.settings}>
              <ButtonIcon
                icon={<SettingsSVG />}
                size="sm"
                variant="outlined"
                color="primary"
              />
            </Link>
          </NoSSRWrapper>
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
          <>
            <MobileNavItems>
              <NavItem
                link={urls.home}
                icon={<ActiveMotionsSVG />}
                children="Active motions"
                onClick={handleCloseMobileMenu}
              />
              <NavItem
                link={urls.archive}
                icon={<ArchiveSVG />}
                children="Archive"
                onClick={handleCloseMobileMenu}
              />
              <NavItem
                link={urls.startMotion}
                icon={<StartSVG />}
                children="Start motion"
                onClick={handleCloseMobileMenu}
              />
              {areStonksAvailable && (
                <NavItem
                  link={urls.stonks}
                  icon={<StonksSVG />}
                  children="Stonks"
                  onClick={handleCloseMobileMenu}
                />
              )}
            </MobileNavItems>

            <MobileMenu>
              <MobileMenuScroll>
                <MobileNetworkWrap>
                  <Network>
                    <NetworkBulb color={getChainColor(chainId)} />
                    <Text size={14} weight={500}>
                      {getChainName(chainId)}
                    </Text>
                  </Network>
                  <HeaderWallet />
                </MobileNetworkWrap>
              </MobileMenuScroll>
            </MobileMenu>
          </>
        )}
      </Wrap>
      <MobileSpacer />
    </>
  )
}
