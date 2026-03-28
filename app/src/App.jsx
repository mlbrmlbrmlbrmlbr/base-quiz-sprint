import { useState } from 'react';
import { LeaderboardPanel } from './components/LeaderboardPanel';
import { QuizGame } from './components/QuizGame';
import { SubmitScorePanel } from './components/SubmitScorePanel';
import { WalletPanel } from './components/WalletPanel';
import { QUIZ_CHAIN_ID, QUIZ_CONTRACT_ADDRESS, QUIZ_NAME } from './lib/quizContract';

export default function App() {
  const [latestResult, setLatestResult] = useState(null);
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);

  return (
    <div className="page-shell">
      <div className="page-bg" />
      <main className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">CTBase mini-game</p>
            <h1>{QUIZ_NAME}</h1>
            <p className="topbar-copy">
              Standard web app for Base with a static frontend, wallet integration, and an optional onchain leaderboard contract.
            </p>
          </div>
          <div className="pill-row wrap">
            <span className="pill">Base-ready</span>
            <span className="pill">No backend required</span>
            <span className="pill">Chain ID: {QUIZ_CHAIN_ID}</span>
            {QUIZ_CONTRACT_ADDRESS ? <span className="pill">Contract linked</span> : <span className="pill pill-soft">Contract not linked yet</span>}
          </div>
        </header>

        <section className="layout-grid">
          <div className="main-column">
            <QuizGame onFinished={setLatestResult} />
          </div>
          <aside className="side-column stack gap-lg">
            <WalletPanel />
            <SubmitScorePanel
              result={latestResult}
              onSubmitted={() => setLeaderboardRefreshKey((value) => value + 1)}
            />
            <LeaderboardPanel refreshKey={leaderboardRefreshKey} />
          </aside>
        </section>

        <footer className="footer-note">
          <p>
            Tip: deploy the frontend to GitHub Pages or Cloudflare Pages, deploy the contract to Base Sepolia or Base mainnet,
            then register the public URL on Base.dev.
          </p>
        </footer>
      </main>
    </div>
  );
}
