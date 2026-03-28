import { useEffect, useMemo, useState } from 'react';
import { APP_URL } from '../lib/quizContract';
import { QUESTION_COUNT, QUESTIONS } from '../questions';
import { formatElapsed, shuffle } from '../utils';

const LOCAL_BEST_KEY = 'base-quiz-sprint-local-best';

export function QuizGame({ onFinished }) {
  const [phase, setPhase] = useState('idle');
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [localBest, setLocalBest] = useState(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_BEST_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (phase !== 'playing') return undefined;
    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  const currentQuestion = sessionQuestions[currentIndex];
  const correctCount = answers.filter((answer) => answer.correct).length;
  const score = correctCount * 100;
  const progress = sessionQuestions.length
    ? Math.round(((currentIndex + (phase === 'finished' ? 1 : 0)) / sessionQuestions.length) * 100)
    : 0;

  const result = useMemo(
    () => ({
      score,
      correctCount,
      totalQuestions: sessionQuestions.length,
      elapsed,
      percentage: sessionQuestions.length ? Math.round((correctCount / sessionQuestions.length) * 100) : 0,
    }),
    [correctCount, elapsed, score, sessionQuestions.length]
  );

  useEffect(() => {
    if (phase !== 'finished' || !sessionQuestions.length) return;
    onFinished?.(result);

    const best = !localBest || result.score > localBest.score ? result : localBest;
    if (best !== localBest) {
      setLocalBest(best);
      try {
        window.localStorage.setItem(LOCAL_BEST_KEY, JSON.stringify(best));
      } catch {
        // ignore storage failures
      }
    }
  }, [localBest, onFinished, phase, result, sessionQuestions.length]);

  function startGame() {
    setSessionQuestions(shuffle(QUESTIONS).slice(0, QUESTION_COUNT));
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
    setElapsed(0);
    setPhase('playing');
  }

  function handleSelect(optionIndex) {
    if (phase !== 'playing' || selectedIndex !== null) return;
    const correct = optionIndex === currentQuestion.answer;
    setSelectedIndex(optionIndex);
    setAnswers((existing) => [
      ...existing,
      {
        id: currentQuestion.id,
        correct,
        selectedIndex: optionIndex,
        answer: currentQuestion.answer,
      },
    ]);
  }

  function nextQuestion() {
    if (currentIndex === sessionQuestions.length - 1) {
      setPhase('finished');
      return;
    }
    setCurrentIndex((value) => value + 1);
    setSelectedIndex(null);
  }

  async function shareResult() {
    const text = `I scored ${correctCount}/${sessionQuestions.length} in Base Quiz Sprint in ${formatElapsed(
      elapsed
    )}. Can you beat it?`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Base Quiz Sprint',
          text,
          url: APP_URL,
        });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${APP_URL}`);
      window.alert('Result copied to clipboard.');
    } catch {
      window.alert('Sharing was cancelled or unavailable.');
    }
  }

  const resultTone =
    result.percentage >= 80 ? 'Excellent run — your score is leaderboard material.' : result.percentage >= 50
      ? 'Solid score. One more run could push you into the top pack.'
      : 'Warm-up complete. Run it back and climb.';

  if (phase === 'idle') {
    return (
      <section className="card quiz-card hero-card">
        <div className="stack gap-md">
          <div>
            <p className="eyebrow">Mini-game</p>
            <h1>Base Quiz Sprint</h1>
            <p className="lead">
              A fast, serverless quiz for Base. Play locally in the browser, then submit your best score
              onchain to a lightweight leaderboard contract.
            </p>
          </div>

          <div className="grid two-up rules-grid">
            <div className="rule-item">
              <span className="rule-kicker">10 questions</span>
              <p>Each run shuffles a fresh pack from the Base / Web3 question bank.</p>
            </div>
            <div className="rule-item">
              <span className="rule-kicker">0–1000 points</span>
              <p>Every correct answer is worth 100 points. Time is displayed as a local tiebreaker.</p>
            </div>
            <div className="rule-item">
              <span className="rule-kicker">No backend</span>
              <p>The game logic lives entirely in the frontend. Only score submission touches the chain.</p>
            </div>
            <div className="rule-item">
              <span className="rule-kicker">Casual leaderboard</span>
              <p>Perfect for community play, demos, or lightweight CTBase engagement loops.</p>
            </div>
          </div>

          {localBest ? (
            <div className="pill-row">
              <span className="pill">Local best: {localBest.correctCount}/{localBest.totalQuestions}</span>
              <span className="pill">Points: {localBest.score}</span>
              <span className="pill">Time: {formatElapsed(localBest.elapsed)}</span>
            </div>
          ) : null}

          <div className="actions">
            <button type="button" className="button button-primary" onClick={startGame}>
              Start quiz
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (phase === 'finished') {
    return (
      <section className="card quiz-card">
        <div className="stack gap-md">
          <div>
            <p className="eyebrow">Run complete</p>
            <h2>
              {correctCount}/{sessionQuestions.length} correct · {score} pts
            </h2>
            <p className="lead">{resultTone}</p>
          </div>

          <div className="pill-row">
            <span className="pill">Accuracy: {result.percentage}%</span>
            <span className="pill">Time: {formatElapsed(elapsed)}</span>
            <span className="pill">Questions: {sessionQuestions.length}</span>
          </div>

          <div className="review-list">
            {sessionQuestions.map((question, index) => {
              const answer = answers[index];
              return (
                <div key={question.id} className="review-item">
                  <div className="review-head">
                    <span className={`badge ${answer?.correct ? 'badge-success' : 'badge-danger'}`}>
                      {answer?.correct ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className="badge badge-neutral">{question.category}</span>
                  </div>
                  <h3>{question.prompt}</h3>
                  <p className="muted">{question.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="actions wrap">
            <button type="button" className="button button-primary" onClick={startGame}>
              Play again
            </button>
            <button type="button" className="button button-secondary" onClick={shareResult}>
              Share result
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="card quiz-card">
      <div className="stack gap-md">
        <div className="progress-header">
          <div>
            <p className="eyebrow">Live run</p>
            <h2>
              Question {currentIndex + 1} / {sessionQuestions.length}
            </h2>
          </div>
          <div className="pill-row compact-right">
            <span className="pill">Correct: {correctCount}</span>
            <span className="pill">Time: {formatElapsed(elapsed)}</span>
          </div>
        </div>

        <div className="progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="question-card">
          <div className="question-meta">
            <span className="badge badge-neutral">{currentQuestion?.category}</span>
          </div>
          <h3>{currentQuestion?.prompt}</h3>
          <div className="option-list">
            {currentQuestion?.options.map((option, optionIndex) => {
              const isChosen = selectedIndex === optionIndex;
              const isCorrect = currentQuestion.answer === optionIndex;
              const className = [
                'option-button',
                selectedIndex !== null && isCorrect ? 'option-correct' : '',
                selectedIndex !== null && isChosen && !isCorrect ? 'option-wrong' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  key={option}
                  type="button"
                  className={className}
                  onClick={() => handleSelect(optionIndex)}
                  disabled={selectedIndex !== null}
                >
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedIndex !== null ? (
          <div className="answer-panel">
            <span className={`badge ${selectedIndex === currentQuestion.answer ? 'badge-success' : 'badge-danger'}`}>
              {selectedIndex === currentQuestion.answer ? 'Nice one' : 'Not this time'}
            </span>
            <p>{currentQuestion.explanation}</p>
            <button type="button" className="button button-primary" onClick={nextQuestion}>
              {currentIndex === sessionQuestions.length - 1 ? 'Finish run' : 'Next question'}
            </button>
          </div>
        ) : (
          <p className="helper-text">Choose one answer to continue.</p>
        )}
      </div>
    </section>
  );
}
