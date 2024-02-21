import { UnpackedPromise } from 'modules/shared/utils/utilTypes'

export type NestProps<C extends (...a: any) => Promise<any>> = {
  callData: UnpackedPromise<ReturnType<C>>
  isOnChain?: boolean
}
