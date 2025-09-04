import { BigNumber, utils } from 'ethers'
import { MAX_SUBMIT_HASH_COUNT, NodeOperatorsRegistryType } from '../constants'

type SubmitHashesRequest = {
  moduleId: BigNumber
  nodeOpId: BigNumber
  valIndex: BigNumber
  valPubkey: string
  valPubKeyIndex: BigNumber
}

type SubmitHashesRequestParsed = {
  moduleId: string
  nodeOpId: string
  valIndex: string
  valPubkey: string
  valPubKeyIndex: string
}

const STAKING_MODULE_IDS: Partial<Record<NodeOperatorsRegistryType, number>> = {
  curated: 1,
  sdvt: 2,
}

type Args = {
  registryType: NodeOperatorsRegistryType
  calldata: string
  nodeOperatorsCount: number
  nodeOperatorId?: number
}

export type ParsingResultData = {
  value: SubmitHashesRequestParsed
  errors: string[]
}[]

type ParsingResult = {
  data: ParsingResultData
  error?: string | null
}

export const validateAndParseRequestHashes = ({
  calldata,
  registryType,
  nodeOperatorsCount,
  nodeOperatorId,
}: Args): ParsingResult => {
  try {
    const decodedCalldata = new utils.AbiCoder().decode(
      [
        'tuple(uint256 moduleId, uint256 nodeOpId, uint64 valIndex, bytes valPubkey, uint256 valPubKeyIndex)[]',
      ],
      calldata,
    )[0] as SubmitHashesRequest[]

    if (decodedCalldata.length === 0) {
      return { error: 'No requests found in calldata', data: [] }
    }

    if (decodedCalldata.length > MAX_SUBMIT_HASH_COUNT) {
      return {
        error: `Too many requests in calldata. Got ${decodedCalldata.length}, maximum is ${MAX_SUBMIT_HASH_COUNT}.`,
        data: [],
      }
    }

    const data: {
      errors: string[]
      value: SubmitHashesRequestParsed
    }[] = []

    let errors: string[] = []
    let hasErrors = false
    let prevDataWithoutPubkey = BigNumber.from(0)

    for (let i = 0; i < decodedCalldata.length; i++) {
      errors = []
      const request = decodedCalldata[i]

      if (!request.moduleId.eq(STAKING_MODULE_IDS[registryType]!)) {
        errors.push('invalid module ID')
      }

      if (request.nodeOpId.gte(nodeOperatorsCount)) {
        errors.push('node operator ID is out of range')
      }

      if (nodeOperatorId !== undefined) {
        if (!request.nodeOpId.eq(nodeOperatorId)) {
          errors.push('node operator ID does not match connected node operator')
        }
      }

      if (
        !request.valPubkey.startsWith('0x') ||
        request.valPubkey.length !== 98
      ) {
        errors.push('invalid validator pubkey length or format')
      }

      // Compute dataWithoutPubkey for sorting validation
      const moduleIdShifted = request.moduleId.shl(64 + 40) // moduleId << 104
      const nodeOpIdShifted = request.nodeOpId.shl(64) // nodeOpId << 64
      const dataWithoutPubkey = moduleIdShifted
        .or(nodeOpIdShifted)
        .or(request.valIndex)

      // Check that the combined data is in ascending order (strict comparison for no duplicates)
      if (dataWithoutPubkey.lte(prevDataWithoutPubkey) && i > 0) {
        errors.push('invalid sort order or duplicate entry')
      } else {
        prevDataWithoutPubkey = dataWithoutPubkey
      }

      if (!hasErrors && errors.length > 0) {
        hasErrors = true
      }
      data.push({
        errors,
        value: {
          nodeOpId: request.nodeOpId.toString(),
          moduleId: request.moduleId.toString(),
          valIndex: request.valIndex.toString(),
          valPubkey: request.valPubkey,
          valPubKeyIndex: request.valPubKeyIndex.toString(),
        },
      })
    }

    const error = hasErrors
      ? 'One or more requests are invalid. Please check parsed requests below'
      : null

    return { error, data }
  } catch (error: any) {
    console.error(error)
    return { error: 'Failed to parse calldata', data: [] }
  }
}
