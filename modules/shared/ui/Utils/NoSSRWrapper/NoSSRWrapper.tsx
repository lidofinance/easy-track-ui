import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

const Wrapper = (props: { children: ReactNode }) => <>{props.children}</>

export const NoSSRWrapper = dynamic(() => Promise.resolve(Wrapper), {
  ssr: false,
})
