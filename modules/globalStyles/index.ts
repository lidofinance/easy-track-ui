import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    font-family: 'TT Commons', sans-serif;
    margin: 0px;
  }

  html {
    width: 100%;
    font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
    line-height: 1.25;
  }

  body {
    position: relative;
    width: 100%;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`
