import { ToastError } from '@lidofinance/lido-ui'
import {
  default as useSWRSource,
  useSWRInfinite as useSWRInfiniteSource,
  SWRResponse as SWRResponseSource,
  SWRConfiguration,
} from 'swr'
import {
  Key,
  KeyLoader,
  Fetcher,
  SWRInfiniteConfiguration,
} from 'swr/dist/types'

export type SWRResponse<Data, Error = any> = SWRResponseSource<Data, Error> & {
  initialLoading: boolean
}

const defaultConfig = {
  onError: (error: any) => {
    console.error(error)
    ToastError(error)
  },
  errorRetryInterval: 10_000,
  focusThrottleInterval: 10_000,
}

export const useSWR = <Data = unknown, Error = any>(
  key: Key,
  fetcher: Fetcher<Data> | null,
  config?: SWRConfiguration<Data, Error>,
) => {
  const result = useSWRSource(key, fetcher, {
    ...defaultConfig,
    ...config,
  })
  const initialLoading = result.data == null && result.isValidating
  return {
    ...result,
    initialLoading,
  }
}

export const useSWRInfinite = <Data = unknown, Error = any>(
  getKey: KeyLoader<Data>,
  fetcher: Fetcher<Data>,
  config?: SWRInfiniteConfiguration<Data, Error>,
) => {
  const result = useSWRInfiniteSource(getKey, fetcher, {
    ...defaultConfig,
    ...config,
  })
  const initialLoading = result.data == null && result.isValidating
  return {
    ...result,
    initialLoading,
  }
}
