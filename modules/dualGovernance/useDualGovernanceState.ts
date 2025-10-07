import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  DualGovernanceState,
  DualGovernanceStatus,
  ProposalStatus,
} from 'modules/dualGovernance/types'
import { getAmountUntilVetoSignalling } from './utils'
import { createContractHelpers } from '../blockChain/utils/createContractHelpers'
import * as TypeChain from '../../generated'
import {
  DualGovernance,
  EmergencyProtectedTimelock,
  STETH,
} from '../blockChain/contractAddresses'

const WARNING_STATE_THRESHOLD_PERCENT = 33

export const useDualGovernanceState = () => {
  const { chainId, rpcProvider } = useWeb3()

  return useSWR<DualGovernanceState>(
    ['swr:useDualGovernanceState', chainId],
    async () => {
      const dualGovernance = createContractHelpers({
        address: { [chainId]: DualGovernance[chainId] },
        factory: TypeChain.DualGovernanceAbi__factory,
      })

      const stEth = createContractHelpers({
        address: { [chainId]: STETH[chainId] },
        factory: TypeChain.StethAbi__factory,
      })

      const emergencyProtectedTimelock = createContractHelpers({
        address: { [chainId]: EmergencyProtectedTimelock[chainId] },
        factory: TypeChain.EmergencyProtectedTimelockAbi__factory,
      })

      const dualGovernanceContract = dualGovernance.connect({
        chainId,
        provider: rpcProvider,
      })

      const stEthContract = stEth.connect({
        chainId,
        provider: rpcProvider,
      })

      const emergencyProtectedTimelockContract =
        emergencyProtectedTimelock.connect({
          chainId,
          provider: rpcProvider,
        })

      const isEmergencyModeActive =
        await emergencyProtectedTimelockContract.isEmergencyModeActive()

      const vetoSignallingAddress =
        await dualGovernanceContract.getVetoSignallingEscrow()
      const configAddress = await dualGovernanceContract.getConfigProvider()
      const stateDetails = await dualGovernanceContract.getStateDetails()

      const vetoSignallingEscrow = createContractHelpers({
        address: { [chainId]: vetoSignallingAddress },
        factory: TypeChain.DGEscrowAbi__factory,
      })

      const vetoSignallingEscrowContract = vetoSignallingEscrow.connect({
        chainId,
        provider: rpcProvider,
      })

      const dualGovernanceConfig = createContractHelpers({
        address: { [chainId]: configAddress },
        factory: TypeChain.DGConfigProviderAbi__factory,
      })

      const dualGovernanceConfigContract = dualGovernanceConfig.connect({
        chainId,
        provider: rpcProvider,
      })

      const lockedAssets =
        await vetoSignallingEscrowContract.getSignallingEscrowDetails()
      const rageQuitSupportPercent =
        await vetoSignallingEscrowContract.getRageQuitSupport()

      const unfinalizedShares = lockedAssets.totalStETHLockedShares.add(
        lockedAssets.totalUnstETHUnfinalizedShares,
      )

      const totalSupply = await stEthContract.totalSupply()
      const pooledEthByShares = await stEthContract.getPooledEthByShares(
        unfinalizedShares,
      )

      const totalStEthInEscrow = pooledEthByShares.add(
        lockedAssets.totalUnstETHFinalizedETH,
      )

      let status = stateDetails.persistedState

      let activeProposalsCount = 0
      if (
        status !== DualGovernanceStatus.Normal &&
        status !== DualGovernanceStatus.VetoCooldown
      ) {
        const proposalsCount = (
          await emergencyProtectedTimelockContract.getProposalsCount()
        ).toNumber()
        for (let i = 1; i <= proposalsCount; i++) {
          const proposal = await emergencyProtectedTimelockContract.getProposal(
            i,
          )
          if (
            proposal.proposalDetails.status === ProposalStatus.Submitted ||
            proposal.proposalDetails.status === ProposalStatus.Scheduled
          ) {
            activeProposalsCount++
          }
        }
      }

      const config =
        await dualGovernanceConfigContract.getDualGovernanceConfig()

      const { firstSealRageQuitSupport, secondSealRageQuitSupport } = config

      const warningStateThreshold = firstSealRageQuitSupport
        .mul(WARNING_STATE_THRESHOLD_PERCENT)
        .div(100)

      if (
        status === DualGovernanceStatus.Normal &&
        rageQuitSupportPercent.gte(warningStateThreshold)
      ) {
        status = DualGovernanceStatus.Warning
      }

      if (isEmergencyModeActive) {
        status = DualGovernanceStatus.EmergencyMode
      }

      let amountUntilVetoSignalling: {
        percentage: string
        value: string
      } | null = null
      if (status === DualGovernanceStatus.VetoSignallingDeactivation) {
        amountUntilVetoSignalling = getAmountUntilVetoSignalling(
          stateDetails,
          config,
          totalSupply,
        )
      }

      return {
        status,
        nextStatus: stateDetails.effectiveState,
        totalStEthInEscrow,
        totalSupply,
        rageQuitSupportPercent,
        activeProposalsCount,
        config,
        stateDetails,
        amountUntilVetoSignalling,
        firstSealRageQuitSupport,
        secondSealRageQuitSupport,
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
