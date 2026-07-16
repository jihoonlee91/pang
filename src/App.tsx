import { useEffect, useState } from 'react'
import './App.css'
import GamePlay from './GamePlay'
import StageMap from './StageMap'
import { STAGE_COUNT } from './game/constants'
import type { StageResult } from './game/types'
import { getPlayerName, recordScore, renameEntry } from './game/scoreHistory'
import type { ScoreEntry } from './game/scoreHistory'
import SettingsDialog from './components/SettingsDialog'
import { loadSettings, saveSettings, type GameSettings } from './game/settings'
import { configureAudio, unlockAudio } from './game/audio'

type Screen =
  | 'main'
  | 'tutorial'
  | 'countdown'
  | 'play'
  | 'stageClear'
  | 'demo'
  | 'map'
  | 'settings'
  | 'end'

const COUNTDOWN_START = 3
const TUTORIAL_KEY = 'pang.tutorial.complete.v1'
const TUTORIAL_STEPS = [
  'Hold the left and right controls to move.',
  'Press FIRE or Space to launch a harpoon.',
  'Pop every ball. Large balls split into smaller ones.',
  'Avoid the balls: contact costs one HP.',
]
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
  const [settings, setSettings] = useState<GameSettings>(loadSettings)
  const [tutorialStep, setTutorialStep] = useState(0)

  useEffect(() => {
    saveSettings(settings)
    configureAudio(settings)
    document.documentElement.classList.toggle(
      'reduced-motion',
      settings.reducedMotion,
    )
  }, [settings])

  const beginCountdown = () => {
    unlockAudio()
    setStageIndex(0)
    setCountdown(COUNTDOWN_START)
    setScreen('countdown')
  }

  const startGame = () => {
    unlockAudio()
    if (localStorage.getItem(TUTORIAL_KEY) === 'true') beginCountdown()
    else {
      setTutorialStep(0)
      setScreen('tutorial')
    }
  }

  const startDemo = () => {
    setStageIndex(0)
    setScreen('demo')
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
      setFinalScore(score)
      setScreen('stageClear')
    } else {
      finish('clear', score)
    }
  }

  const handleGameOver = (score: number) => {
    finish('gameover', score)
  }

  // Demo mode loops forever and never records a real score.
  const handleDemoClear = () => {
    setStageIndex((stageIndex + 1) % STAGE_COUNT)
  }

  const handleDemoGameOver = () => {
    setStageIndex(0)
  }

  const handleNameChange = (name: string) => {
    setPlayerNameState(name)
    setTopScores(renameEntry(playedAt, name).slice(0, 5))
  }

  useEffect(() => {
    if (screen !== 'end') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') beginCountdown()
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
        <button type="button" className="screen-button" onClick={startGame}>
          Start
        </button>
        <button
          type="button"
          className="screen-button screen-button-secondary"
          onClick={startDemo}
        >
          Watch AI Play
        </button>
        <button
          type="button"
          className="screen-button screen-button-secondary"
          onClick={() => setScreen('map')}
        >
          Stage Map
        </button>
        <button
          type="button"
          className="screen-button screen-button-secondary"
          onClick={() => setScreen('settings')}
        >
          Settings
        </button>
        {'requestFullscreen' in document.documentElement && (
          <button
            type="button"
            className="screen-button screen-button-secondary"
            onClick={() => document.documentElement.requestFullscreen()}
          >
            Fullscreen
          </button>
        )}
      </div>
    )
  }

  if (screen === 'map') {
    return <StageMap onBack={() => setScreen('main')} />
  }

  if (screen === 'settings') {
    return (
      <SettingsDialog
        settings={settings}
        onChange={setSettings}
        onClose={() => setScreen('main')}
        onReplayTutorial={() => {
          setTutorialStep(0)
          setScreen('tutorial')
        }}
      />
    )
  }

  if (screen === 'tutorial') {
    const isLastStep = tutorialStep === TUTORIAL_STEPS.length - 1
    return (
      <div className="screen tutorial-screen">
        <h1>How to Play</h1>
        <p className="tutorial-progress">
          {tutorialStep + 1} / {TUTORIAL_STEPS.length}
        </p>
        <p>{TUTORIAL_STEPS[tutorialStep]}</p>
        <div className="tutorial-controls" aria-hidden="true">
          {tutorialStep === 0
            ? '◀  ▶'
            : tutorialStep === 1
              ? 'FIRE'
              : '●  →  • •'}
        </div>
        <button
          type="button"
          className="screen-button"
          onClick={() => {
            if (!isLastStep) setTutorialStep((step) => step + 1)
            else {
              localStorage.setItem(TUTORIAL_KEY, 'true')
              beginCountdown()
            }
          }}
        >
          {isLastStep ? 'Start Game' : 'Next'}
        </button>
        <button
          type="button"
          className="screen-button screen-button-secondary"
          onClick={() => setScreen('main')}
        >
          Back
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
        onQuit={() => setScreen('main')}
        settings={settings}
      />
    )
  }

  if (screen === 'stageClear') {
    return (
      <div className="screen">
        <h1>Stage Clear</h1>
        <p className="result-score">Stage Score {finalScore}</p>
        <button
          type="button"
          className="screen-button"
          onClick={() => {
            setStageIndex((stage) => stage + 1)
            setCountdown(COUNTDOWN_START)
            setScreen('countdown')
          }}
        >
          Next Stage
        </button>
      </div>
    )
  }

  if (screen === 'demo') {
    return (
      <div className="gameplay">
        <GamePlay
          demo
          stageIndex={stageIndex}
          onClear={handleDemoClear}
          onGameOver={handleDemoGameOver}
          onQuit={() => setScreen('main')}
          settings={settings}
        />
        <button
          type="button"
          className="screen-button screen-button-secondary"
          onClick={() => setScreen('main')}
        >
          Exit AI Mode
        </button>
      </div>
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
      <button type="button" className="screen-button" onClick={beginCountdown}>
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
