import { useMemo } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QUIZ_CHAIN_ID } from '../lib/quizContract';
import { formatAddress } from '../utils';

const chainNameById = {
  [base.id]: 'Base Mainnet',
  [baseSepolia.id]: 'Base Sepolia',
};

export function WalletPanel() {
  const { address, chainId, isConnected } = useAccount();
  const { connectors, connect, isPending, variables, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  const requiredLabel = chainNameById[QUIZ_CHAIN_ID] || `Chain ${QUIZ_CHAIN_ID}`;
  const currentLabel = chainNameById[chainId] || (chainId ? `Chain ${chainId}` : 'Not connected');
  const isCorrectChain = !isConnected || chainId === QUIZ_CHAIN_ID;

  const orderedConnectors = useMemo(() => {
    const preferred = ['baseAccount', 'injected'];
    return [...connectors].sort((a, b) => {
      const ai = preferred.indexOf(a.id);
      const bi = preferred.indexOf(b.id);
      return (ai === -1 ? preferred.length : ai) - (bi === -1 ? preferred.length : bi);
    });
  }, [connectors]);

  return (
    <section className="card compact-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Wallet</p>
          <h2>Connect for onchain scores</h2>
        </div>
      </div>

      <div className="stack gap-sm">
        <div className="info-row">
          <span>Status</span>
          <strong>{isConnected ? 'Connected' : 'Not connected'}</strong>
        </div>
        <div className="info-row">
          <span>Required chain</span>
          <strong>{requiredLabel}</strong>
        </div>
        <div className="info-row">
          <span>Current chain</span>
          <strong>{currentLabel}</strong>
        </div>
        {isConnected && (
          <div className="info-row">
            <span>Address</span>
            <strong>{formatAddress(address)}</strong>
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="stack gap-sm top-space-sm">
          {orderedConnectors.map((connector) => (
            <button
              key={connector.uid}
              className={`button ${connector.id === 'baseAccount' ? 'button-primary' : 'button-secondary'}`}
              type="button"
              onClick={() => connect({ connector })}
              disabled={isPending}
            >
              {isPending && variables?.connector?.id === connector.id
                ? 'Connecting…'
                : connector.id === 'baseAccount'
                  ? 'Connect Base Account'
                  : 'Connect Browser Wallet'}
            </button>
          ))}
          <p className="helper-text">
            Inside the Base App, the Base Account connector is the preferred path. Outside the Base App,
            the injected wallet button works with browser wallets.
          </p>
        </div>
      ) : (
        <div className="stack gap-sm top-space-sm">
          {!isCorrectChain && (
            <button
              type="button"
              className="button button-warning"
              onClick={() => switchChainAsync({ chainId: QUIZ_CHAIN_ID })}
              disabled={isSwitching}
            >
              {isSwitching ? 'Switching…' : `Switch to ${requiredLabel}`}
            </button>
          )}
          <button type="button" className="button button-secondary" onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      )}

      {error ? <p className="status error top-space-sm">{error.message}</p> : null}
      {!isCorrectChain ? (
        <p className="status warning top-space-sm">
          Submit score on the same chain where your contract is deployed.
        </p>
      ) : null}
    </section>
  );
}
