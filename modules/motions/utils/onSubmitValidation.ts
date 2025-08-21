import { ToastError } from '@lidofinance/lido-ui'
import { MotionType, MotionTypeForms } from 'modules/motions/types'
import { getDefaultFormPartsData } from 'modules/motions/ui/MotionFormStartNew/Parts'
import { fetcherIPFS } from 'modules/network/utils/fetcherIPFS'

type MotionFormData<M extends MotionTypeForms> = ReturnType<
  typeof getDefaultFormPartsData
>[M]

type ValidateFn<M extends MotionTypeForms> = (
  formData: MotionFormData<M>,
) => Promise<string | null> | string | null

const EXTRA_VALIDATION_MAP: {
  [K in MotionTypeForms]?: ValidateFn<K>
} = {
  [MotionType.CSMSetVettedGateTree]: async formData => {
    try {
      const ipfsTree = await fetcherIPFS(formData.treeCid)
      const parsedIpfsTree = JSON.parse(ipfsTree)

      const ipfsTreeRoot = parsedIpfsTree['tree']?.[0]

      if (!ipfsTreeRoot) {
        throw new Error('invalid IPFS tree data')
      }

      if (ipfsTreeRoot !== formData.treeRoot) {
        return 'Tree root does not match the IPFS tree data'
      }

      return null
    } catch (error) {
      console.error('Error fetching IPFS tree data', {
        error,
        cid: formData.treeCid,
      })
      ToastError(`Validation error: ${error}`, {})
      // Do not return error message to not block form submission
      return null
    }
  },
}

export const validateMotionExtraData = <M extends MotionTypeForms>(
  motionType: M,
  formValues: MotionFormData<M>,
) => {
  const validateFn = EXTRA_VALIDATION_MAP[motionType]

  if (!validateFn) {
    return null
  }

  return validateFn(formValues)
}
