import { useContext } from 'react'
import { LDO } from '../providers/tokensProvider'

export function useLDOToken() {
  return useContext(LDO.TokenContext)
}
