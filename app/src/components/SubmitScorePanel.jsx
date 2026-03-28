import { useEffect, useMemo, useState } from 'react';
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { QUIZ_ABI, QUIZ_CHAIN_ID, QUIZ_CONTRACT_ADDRESS } from '../lib/quizContract';

const NICKNAME_KEY = 'base-quiz-sprint-nickname';

export function SubmitScorePanel({ result, onSubmitted }) {
  const { address, chainId, isConnected } = useAccount();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [nickname, setNickname] = useState(() => {
    try {
      return window.localStorage.getItem(NICKNAME_KEY) || '';
    } catch {
      return '';
    }
  });
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasContract = Boolean(QUIZ_CONTRACT_ADDRESS);
  const isCorrectChain = !isConnected || chainId === QUIZ_CHAIN_ID;
  const canSubmit = Boolean(result && hasContract && isConnected && isCorrectChain && !isSubmitting);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
    chainId: QUIZ_CHAIN_ID,
  });

  const helperText = useMemo(() => {
    if (!result) return 'Finish a run to unlock score submission.';
    if (!hasContract) return 'Deploy the quiz contract and set VITE_QUIZ_CONTRACT_ADDRESS to enable onchain scores.';
    if (!isConnected) return 'Connect a wallet to submit your score onchain.';
    if (!isCorrectChain) return 'Switch to the contract chain before submitting.';
    return 'Nickname is optional. Up to 24 characters.';
  }, [hasContract, isConnected, isCorrectChain, result]);

  useEffect(() => {
    if (!isSuccess) return;
    onSubmitted?.();
  }, [isSuccess, onSubmitted]);

  async function handleSubmit() {
    if (!canSubmit) return;
    setError('');
    setIsSubmitting(true);

    try {
      const trimmedNickname = nickname.trim().slice(0, 24);
      try {
        window.localStorage.setItem(NICKNAME_KEY, trimmedNickname);
      } catch {
        // ignore storage failures
      }

      const hash = await writeContractAsync({
        address: QUIZ_CONTRACT_ADDRESS,
        abi: QUIZ_ABI,
        functionName: 'submitScore',
        args: [BigInt(result.score), trimmedNickname],
        chainId: QUIZ_CHAIN_ID,
      });
      setTxHash(hash);
    } catch (submitError) {
      setError(submitError.shortMessage || submitError.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card compact-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Onchain</p>
          <h2>Submit your best run</h2>
        </div>
      </div>

      {result ? (
        <div className="pill-row top-space-xs">
          <span className="pill">Points: {result.score}</span>
          <span className="pill">Correct: {result.correctCount}/{result.totalQuestions}</span>
          <span className="pill">Accuracy: {result.percentage}%</span>
        </div>
      ) : null}

      <div className="stack gap-sm top-space-sm">
        <label className="field-label" htmlFor="nickname">
          Nickname
        </label>
        <input
          id="nickname"
          className="text-input"
          placeholder="Optional nickname"
          maxLength={24}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
        <p className="helper-text">{helperText}</p>
      </div>

      <div className="stack gap-sm top-space-sm">
        {!isCorrectChain && isConnected ? (
          <button
            type="button"
            className="button button-warning"
            onClick={() => switchChainAsync({ chainId: QUIZ_CHAIN_ID })}
            disabled={isSwitching}
          >
            {isSwitching ? 'Switching…' : 'Switch chain'}
          </button>
        ) : null}

        <button type="button" className="button button-primary" disabled={!canSubmit} onClick={handleSubmit}>
          {isSubmitting ? 'Awaiting wallet…' : 'Submit score onchain'}
        </button>
      </div>

      {txHash ? (
        <p className="status info top-space-sm">
          Tx sent: <code>{txHash.slice(0, 10)}…{txHash.slice(-8)}</code>
          {isConfirming ? ' · waiting for confirmation…' : isSuccess ? ' · confirmed.' : ''}
        </p>
      ) : null}

      {error ? <p className="status error top-space-sm">{error}</p> : null}
      {isSuccess ? <p className="status success top-space-sm">Leaderboard refreshed with your latest best score.</p> : null}
      {address ? <p className="helper-text top-space-sm">Signed in as {address}</p> : null}
    </section>
  );
}
