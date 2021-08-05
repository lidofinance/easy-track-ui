import styled, { css } from 'styled-components'

export const Wrap = styled.div`
  margin-bottom: 30px;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Nav = styled.div`
  display: flex;
  align-items: center;
`

export const Logo = styled.div`
  margin-right: 40px;
  font-size: 0;
`

type NavLinkProps = {
  isActive: boolean
}
export const NavLink = styled.a<NavLinkProps>`
  display: flex;
  align-items: center;
  justify-content: center;
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
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
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
