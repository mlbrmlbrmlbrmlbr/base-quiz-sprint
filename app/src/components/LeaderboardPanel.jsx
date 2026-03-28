import { useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';
import { parseAbiItem } from 'viem';
import { QUIZ_ABI, QUIZ_CHAIN_ID, QUIZ_CONTRACT_ADDRESS, QUIZ_START_BLOCK } from '../lib/quizContract';
import { formatAddress } from '../utils';

const highScoreEvent = parseAbiItem(
  'event HighScoreSet(address indexed player, uint256 score, string nickname, uint256 plays, uint256 timestamp)'
);

export function LeaderboardPanel({ refreshKey = 0 }) {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: QUIZ_CHAIN_ID });
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasContract = Boolean(QUIZ_CONTRACT_ADDRESS && QUIZ_START_BLOCK !== undefined);

  const { data: myRecord, refetch: refetchMyRecord } = useReadContract({
    abi: QUIZ_ABI,
    address: hasContract ? QUIZ_CONTRACT_ADDRESS : undefined,
    functionName: 'getPlayerRecord',
    args: address && hasContract ? [address] : undefined,
    chainId: QUIZ_CHAIN_ID,
    query: {
      enabled: Boolean(address && hasContract),
    },
  });

  useEffect(() => {
    if (!hasContract || !publicClient) return undefined;
    let cancelled = false;

    async function loadLeaderboard() {
      setLoading(true);
      setError('');
      try {
        const logs = await publicClient.getLogs({
          address: QUIZ_CONTRACT_ADDRESS,
          event: highScoreEvent,
          fromBlock: QUIZ_START_BLOCK,
          toBlock: 'latest',
        });

        if (cancelled) return;

        const byPlayer = new Map();
        for (const log of logs) {
          const player = log.args.player;
          const nextEntry = {
            player,
            score: Number(log.args.score),
            nickname: log.args.nickname || '',
            plays: Number(log.args.plays),
            timestamp: Number(log.args.timestamp),
          };
          const current = byPlayer.get(player.toLowerCase());
          if (!current || nextEntry.score >= current.score) {
            byPlayer.set(player.toLowerCase(), nextEntry);
          }
        }

        const nextEntries = [...byPlayer.values()]
          .sort((a, b) => b.score - a.score || a.timestamp - b.timestamp)
          .slice(0, 10);
        setEntries(nextEntries);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.shortMessage || loadError.message || 'Could not load leaderboard.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();
    refetchMyRecord();

    return () => {
      cancelled = true;
    };
  }, [hasContract, publicClient, refreshKey, refetchMyRecord]);

  const personal = useMemo(() => {
    if (!myRecord) return null;
    return {
      bestScore: Number(myRecord[0]),
      lastScore: Number(myRecord[1]),
      plays: Number(myRecord[2]),
      lastPlayedAt: Number(myRecord[3]),
      nickname: myRecord[4],
    };
  }, [myRecord]);

  return (
    <section className="card compact-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Leaderboard</p>
          <h2>Community highscores</h2>
        </div>
      </div>

      {!hasContract ? (
        <p className="helper-text">
          Set <code>VITE_QUIZ_CONTRACT_ADDRESS</code> and <code>VITE_QUIZ_START_BLOCK</code> after deployment to
          enable onchain leaderboard reads.
        </p>
      ) : null}

      {personal ? (
        <div className="personal-score top-space-sm">
          <div className="info-row">
            <span>Your best</span>
            <strong>{personal.bestScore} pts</strong>
          </div>
          <div className="info-row">
            <span>Your last</span>
            <strong>{personal.lastScore} pts</strong>
          </div>
          <div className="info-row">
            <span>Total runs onchain</span>
            <strong>{personal.plays}</strong>
          </div>
          {personal.nickname ? (
            <div className="info-row">
              <span>Nickname</span>
              <strong>{personal.nickname}</strong>
            </div>
          ) : null}
        </div>
      ) : null}

      {loading ? <p className="status info top-space-sm">Loading leaderboard…</p> : null}
      {error ? <p className="status error top-space-sm">{error}</p> : null}

      {entries.length ? (
        <div className="leaderboard-list top-space-sm">
          {entries.map((entry, index) => {
            const isYou = address && entry.player.toLowerCase() === address.toLowerCase();
            return (
              <div key={`${entry.player}-${entry.score}-${index}`} className={`leaderboard-item ${isYou ? 'leaderboard-item-you' : ''}`}>
                <div className="leaderboard-rank">#{index + 1}</div>
                <div className="leaderboard-meta">
                  <strong>{entry.nickname || formatAddress(entry.player)}</strong>
                  <span>{entry.nickname ? formatAddress(entry.player) : 'Wallet score'}</span>
                </div>
                <div className="leaderboard-score">{entry.score}</div>
              </div>
            );
          })}
        </div>
      ) : hasContract && !loading && !error ? (
        <p className="helper-text top-space-sm">No submitted scores yet. Be the first to claim the top spot.</p>
      ) : null}

      <p className="helper-text top-space-sm">
        This leaderboard is casual and wallet-signed, but not cheat-proof. It is ideal for lightweight community play,
        demos, and CTBase publishing without a backend.
      </p>
    </section>
  );
}
