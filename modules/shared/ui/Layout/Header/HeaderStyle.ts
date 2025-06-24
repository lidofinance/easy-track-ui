import styled, { css, keyframes } from 'styled-components'
import { BREAKPOINT_MOBILE } from 'modules/globalStyles'

export const Wrap = styled.div`
  position: relative;
  margin-bottom: 30px;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: ${({ theme }) => theme.spaceMap.lg}px;
  }
`

export const Nav = styled.div`
  display: flex;
  align-items: center;
`

export const Logo = styled.div`
  margin-right: 40px;
  font-size: 0;
  z-index: 99;
`

export const NavItems = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: none;
  }
`

type NavLinkProps = {
  isActive: boolean
}
export const NavLink = styled.a<NavLinkProps>`
  display: flex;
  align-items: center;
  font-size: 10px;
  font-weight: 800;
  text-decoration: none;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  transition: color ease ${({ theme }) => theme.duration.norm};

  &:hover {
    transition-duration: ${({ theme }) => theme.duration.fast};
  }

  &:not(:last-child) {
    margin-right: 44px;
  }

  & svg {
    display: block;
    margin-right: 8px;
    fill: currentColor;
  }

  ${({ isActive, theme }) =>
    isActive &&
    css`
      color: ${theme.colors.primary};
    `}

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    padding: 3px 0;

    &:not(:last-child) {
      margin-right: 0;
      margin-bottom: 10px;
    }
  }
`

export const ActionsDesktop = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: none;
  }
`

export const Network = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;
`

type NetworkBulbProps = { color: string }
export const NetworkBulb = styled.div<NetworkBulbProps>`
  position: relative;
  top: 1px;
  margin-right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`

export const BurgerLine = styled.div`
  width: 25px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.text};
  transition: transform ease ${({ theme }) => theme.duration.norm},
    opacity ease ${({ theme }) => theme.duration.norm};

  &:not(:last-child) {
    margin-bottom: 6px;
  }

  &:nth-child(1) {
    transform-origin: right -1px;
  }

  &:nth-child(3) {
    transform-origin: right 3px;
  }
`

type BurgerWrapProps = { isOpened: boolean }
export const BurgerWrap = styled.div<BurgerWrapProps>`
  margin: -10px;
  padding: 10px;
  z-index: 99;
  display: none;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: block;
  }

  ${({ isOpened }) =>
    isOpened &&
    css`
      ${BurgerLine}:nth-child(1) {
        transform: rotate(-45deg);
      }
      ${BurgerLine}:nth-child(2) {
        opacity: 0;
      }
      ${BurgerLine}:nth-child(3) {
        transform: rotate(45deg);
      }
    `}
`

const menuAppearing = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: 60px 20px 0;
  position: fixed;
  overflow: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(12px);
  z-index: 98;
  animation: ${menuAppearing} ${({ theme }) => theme.duration.norm} ease 0s 1;
`

export const MobileMenuScroll = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`

export const MobileNavItems = styled.div`
  position: absolute;
  top: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
`

export const MobileNetworkWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  margin-bottom: 40px;
`

export const MobileSpacer = styled.div`
  height: 90px;
  display: none;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    display: block;
  }
`
export const MobileDGWidgetWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`
