import { useContext } from 'react'
import { connectorsContext } from '../providers/connectorsProvider'

export function useConnectors() {
  return useContext(connectorsContext)
}
