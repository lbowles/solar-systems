import { useEffect, useState } from 'react';
import { useAccount, useConnect, useSigner } from 'wagmi'
import { truncateAddress } from "../../utilities";

export const ConnectButton = () => {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  const [{ data: signer, error, loading }, getSigner] = useSigner()
  const [isConnecting, setIsConnecting] = useState(false)

  const ensName = accountData?.ens?.name

  useEffect(() => {
    signer && setIsConnecting(false)
  }, [signer])

  return (
    <div>
      {accountData 
      ? 
        <button onClick={() => disconnect()}>Disconnect {ensName || truncateAddress(accountData.address)}</button> 
      : 
        <button onClick={() => setIsConnecting(!isConnecting)}>Connect</button> 
      }
      {isConnecting && 
      <div>
        {connectData.connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect(connector)}
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
          </button>
        ))}
        {error && <div>{error?.message ?? 'Failed to connect'}</div>}
      </div>
      }
    </div>
  )
}