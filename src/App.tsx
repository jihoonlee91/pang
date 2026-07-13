import { useEffect, useState } from 'react'
import './App.css'
import GamePlay from './GamePlay'
import { STAGE_COUNT } from './game/constants'
import type { StageResult } from './game/types'
import { getPlayerName, recordScore, renameEntry } from './game/scoreHistory'
import type { ScoreEntry } from './game/scoreHistory'

type Screen = 'main' | 'countdown' | 'play' | 'end'

const COUNTDOWN_START = 3
const CONTROLS_SUMMARY =
  'Move: ←/→ or A/D · Fire: Space · Touch: drag to move, tap to fire'

function App() {
  const [screen, setScreen] = useState<Screen>('main')
  const [countdown, setCountdown] = useState(COUNTDOWN_START)
  const [stageIndex, setStageIndex] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [result, setResult] = useState<StageResult>('gameover')
  const [rank, setRank] = useState(1)
  const [topScores, setTopScores] = useState<ScoreEntry[]>([])
  const [playedAt, setPlayedAt] = useState('')
  const [playerName, setPlayerNameState] = useState(getPlayerName)

  const startCountdown = () => {
    setStageIndex(0)
    setCountdown(COUNTDOWN_START)
    setScreen('countdown')
  }

  useEffect(() => {
    if (screen !== 'countdown') return
    if (countdown <= 0) {
      setScreen('play')
      return
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [screen, countdown])

  const finish = (outcome: StageResult, score: number) => {
    setFinalScore(score)
    setResult(outcome)

    const {
      history,
      rank: newRank,
      entry,
    } = recordScore({
      score,
      stageReached: stageIndex + 1,
      result: outcome,
      playedAt: new Date().toISOString(),
    })
    setRank(newRank)
    setTopScores(history.slice(0, 5))
    setPlayedAt(entry.playedAt)
    setPlayerNameState(entry.name)

    setScreen('end')
  }

  const handleClear = (score: number) => {
    if (stageIndex + 1 < STAGE_COUNT) {
      setStageIndex(stageIndex + 1)
    } else {
      finish('clear', score)
    }
  }

  const handleGameOver = (score: number) => {
    finish('gameover', score)
  }

  const handleNameChange = (name: string) => {
    setPlayerNameState(name)
    setTopScores(renameEntry(playedAt, name).slice(0, 5))
  }

  useEffect(() => {
    if (screen !== 'end') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') startCountdown()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  if (screen === 'main') {
    return (
      <div className="screen">
        <h1>PANG</h1>
        <p className="controls-summary">{CONTROLS_SUMMARY}</p>
        <button
          type="button"
          className="screen-button"
          onClick={startCountdown}
        >
          Start
        </button>
      </div>
    )
  }

  if (screen === 'countdown') {
    return (
      <div className="screen">
        <h1>{countdown > 0 ? countdown : 'Go!'}</h1>
        <p className="controls-summary">{CONTROLS_SUMMARY}</p>
      </div>
    )
  }

  if (screen === 'play') {
    return (
      <GamePlay
        stageIndex={stageIndex}
        onClear={handleClear}
        onGameOver={handleGameOver}
      />
    )
  }

  return (
    <div className="screen">
      <h1>{result === 'clear' ? 'Game Clear' : 'Game Over'}</h1>
      <p className="result-score">Score {finalScore}</p>
      <p className="result-high-score">All-time #{rank}</p>
      <p className="result-detail">
        {result === 'clear'
          ? 'Fully Cleared'
          : `Ended at stage ${stageIndex + 1}`}
      </p>
      <p className="result-detail">
        {new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      <label className="name-field">
        Name
        <input
          type="text"
          maxLength={16}
          value={playerName}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </label>
      {topScores.length > 0 && (
        <ol className="score-history">
          {topScores.map((entry, i) => (
            <li key={`${entry.playedAt}-${i}`}>
              #{i + 1} · {entry.name} · {entry.score} pts ·{' '}
              {entry.result === 'clear'
                ? 'Clear'
                : `Stage ${entry.stageReached}`}
            </li>
          ))}
        </ol>
      )}
      <button type="button" className="screen-button" onClick={startCountdown}>
        Retry
      </button>
      <button
        type="button"
        className="screen-button screen-button-secondary"
        onClick={() => setScreen('main')}
      >
        Back to Main
      </button>
    </div>
  )
}

export default App
