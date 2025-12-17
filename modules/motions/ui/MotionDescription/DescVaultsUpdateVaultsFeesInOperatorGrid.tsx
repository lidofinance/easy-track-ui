import { EvmUpdateVaultsFeesInOperatorGridAbi } from 'generated'
import { ContractOperatorGrid } from 'modules/blockChain/contracts'
import { useSWR } from 'modules/network/hooks/useSwr'
import { AddressInlineWithPop } from 'modules/shared/ui/Common/AddressInlineWithPop'
import { renderVaultParamUpdate } from 'modules/vaults/utils/renderVaultParamUpdate'
import React from 'react'
import { NestProps } from './types'

// UpdateVaultsFeesInOperatorGrid
export function DescVaultsUpdateVaultsFeesInOperatorGrid({
  callData,
  isOnChain,
}: NestProps<EvmUpdateVaultsFeesInOperatorGridAbi['decodeEVMScriptCallData']>) {
  const [vaults, infraFeesBP, liquidityFeesBP, reservationFeesBP] = callData

  const operatorGrid = ContractOperatorGrid.useRpc()

  const { data } = useSWR(
    isOnChain ? `desc-vaults-fee-updates-${vaults.join('-')}` : null,
    async () => {
      if (!isOnChain) {
        return null
      }

      return Promise.all(
        vaults.map(async vault => operatorGrid.vaultTierInfo(vault)),
      )
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  )

  return (
    <ul>
      {vaults.map((vault, index) => {
        const prevValues = data ? data[index] : null
        const updatedInfraFeeBP = infraFeesBP[index]
        const updatedLiquidityFeeBP = liquidityFeesBP[index]
        const updatedReservationFeeBP = reservationFeesBP[index]
        return (
          <li key={index}>
            Update vault <AddressInlineWithPop address={vault} /> fees to:{' '}
            <br />
            <ul>
              <li>
                <b>Infra fee: </b>
                {renderVaultParamUpdate(
                  prevValues?.infraFeeBP,
                  updatedInfraFeeBP,
                  true,
                )}
                ;
              </li>
              <li>
                <b>Liquidity fee:</b>{' '}
                {renderVaultParamUpdate(
                  prevValues?.liquidityFeeBP,
                  updatedLiquidityFeeBP,
                  true,
                )}
                ;
              </li>
              <li>
                <b>Reservation liquidity fee:</b>{' '}
                {renderVaultParamUpdate(
                  prevValues?.reservationFeeBP,
                  updatedReservationFeeBP,
                  true,
                )}
                .
              </li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}
