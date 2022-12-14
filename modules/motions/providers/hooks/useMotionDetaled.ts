import { useContext } from 'react'
import {
  MotionDetailedContext,
  MotionDetailedValue,
} from 'modules/motions/providers'

export const useMotionDetailed = (): MotionDetailedValue => {
  return useContext(MotionDetailedContext)
}
