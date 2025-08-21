import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'
import {
  NodeOperatorsRegistryType,
  NODE_OPERATORS_REGISTRY_MAP,
} from '../constants'

export const useSigningKeysReducer = (
  registryType: NodeOperatorsRegistryType,
) => {
  const [state, setState] = useSimpleReducer<
    Record<string, string | undefined>
  >({})

  const nodeOperatorsRegistry =
    NODE_OPERATORS_REGISTRY_MAP[registryType].useRpc()

  const getSigningKey = async (nodeOperatorId: number, keyIndex: number) => {
    const keyFromState = state[`${nodeOperatorId}-${keyIndex}`]

    if (keyFromState) {
      return keyFromState
    }

    const signingKey = await nodeOperatorsRegistry.getSigningKey(
      nodeOperatorId,
      keyIndex,
    )

    setState({
      [`${nodeOperatorId}-${keyIndex}`]: signingKey.key,
    })

    return signingKey.key
  }

  return { getSigningKey }
}
