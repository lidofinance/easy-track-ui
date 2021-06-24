import { Wrap } from './MotionsGridStyle'

type Props = {
  children: React.ReactNode
}

export function MotionsGrid({ children }: Props) {
  return <Wrap>{children}</Wrap>
}
