import styled from 'styled-components'

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

export const NavLink = styled.a`
  display: block;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};

  &:not(:last-child) {
    margin-right: 24px;
  }
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
  top: -1px;
  margin-right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`
