import { useCallback, useEffect, useState } from 'react'
import './App.css'
import GamePlay from './GamePlay'
import StageMap from './StageMap'
import Glossary from './Glossary'
import Intro from './Intro'
import { PUBLIC_STAGE_COUNT, STAGE_COUNT } from './game/constants'
import type { StageResult } from './game/types'
import {
  getBestScore,
  getMilestoneEncouragement,
  getPlayerName,
  recordScore,
  renameEntry,
} from './game/scoreHistory'
import type { ScoreEntry } from './game/scoreHistory'
import SettingsDialog from './components/SettingsDialog'
import WhatsNewDialog from './components/WhatsNewDialog'
import { loadSettings, saveSettings, type GameSettings } from './game/settings'
import {
  configureAudio,
  playVictoryFanfare,
  startBgm,
  stopBgm,
  unlockAudio,
} from './game/audio'
import { getHighestUnlockedStage, unlockStage } from './game/progress'
import { isUpdateAvailable } from './game/updateCheck'
import { getLastSeenVersion, setLastSeenVersion } from './game/versionSeen'
import {
  HIDDEN_FINAL_STAGE_INDEX,
  getVisibleStageCount,
} from './game/hiddenFinale'

type Screen =
  | 'intro'
  | 'main'
  | 'tutorial'
  | 'countdown'
  | 'play'
  | 'stageClear'
  | 'milestone'
  | 'hiddenReveal'
  | 'demo'
  | 'demoMap'
  | 'map'
  | 'settings'
  | 'whatsNew'
  | 'glossary'
  | 'end'

const MILESTONE_INTERVAL = 10

// Screens with a simple "back" meaning for Esc/the Android back button.
// 'play'/'stageClear' are deliberately excluded — GamePlay owns Escape
// there (it toggles pause); 'main'/'countdown'/'milestone' have no
// sensible back target.
const BACK_TO_MAIN_SCREENS: readonly Screen[] = [
  'intro',
  'tutorial',
  'settings',
  'map',
  'demo',
  'demoMap',
  'hiddenReveal',
  'end',
  'whatsNew',
  'glossary',
]

// Most back-to-main screens really do go to 'main'; 'whatsNew' can be
// opened from Settings (should return there) or auto-surfaced after an
// update (should return to 'main' instead) — see `whatsNewReturnTo`.

const COUNTDOWN_START = 3
const STAGE_ADVANCE_COUNTDOWN = 5
const TUTORIAL_KEY = 'pang.tutorial.complete.v1'
const TUTORIAL_STEPS = [
  'Hold the left and right controls to move.',
  'Press FIRE or Space to launch a harpoon.',
  'Pop every ball. Large balls split into smaller ones.',
  'Avoid the balls: contact costs one HP.',
]
const CONTROLS_SUMMARY =
  'Move: ←/→ or A/D · Fire: Space · Touch controls supported'

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  // Where "Back" on the What's New screen should return to: 'settings'
  // when opened via the Settings menu link, 'main' when auto-surfaced
  // right after an update is detected.
  const [whatsNewReturnTo, setWhatsNewReturnTo] = useState<Screen>('settings')
  const [countdown, setCountdown] = useState(COUNTDOWN_START)
  const [stageIndex, setStageIndex] = useState(0)
  // Bumped on every demo game over, to force GamePlay to remount and
  // retry the same stage it just died on (stageIndex itself is left
  // unchanged) — a plain state update wouldn't reset anything since the
  // index doesn't change.
  const [demoRunId, setDemoRunId] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [result, setResult] = useState<StageResult>('gameover')
  const [gameOverReason, setGameOverReason] = useState<'timeUp' | undefined>(
    undefined,
  )
  const [rank, setRank] = useState(1)
  const [topScores, setTopScores] = useState<ScoreEntry[]>([])
  const [playedAt, setPlayedAt] = useState('')
  const [playerName, setPlayerNameState] = useState(getPlayerName)
  const [settings, setSettings] = useState<GameSettings>(loadSettings)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [stageAdvanceCountdown, setStageAdvanceCountdown] = useState(
    STAGE_ADVANCE_COUNTDOWN,
  )
  const [milestoneStage, setMilestoneStage] = useState(0)
  const [highestUnlockedStage, setHighestUnlockedStage] = useState(
    getHighestUnlockedStage,
  )
  const [isFullscreen, setIsFullscreen] = useState(
    () => document.fullscreenElement !== null,
  )

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen()
  }

  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(
    () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      navigator.standalone === true,
  )

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      setInstallPromptEvent(event)
    }
    const handleAppInstalled = () => {
      setInstallPromptEvent(null)
      setIsStandalone(true)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!installPromptEvent) return
    await installPromptEvent.prompt()
    await installPromptEvent.userChoice
    setInstallPromptEvent(null)
  }

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  // Samsung Internet is Chromium-based but does not reliably fire
  // beforeinstallprompt, so it needs the same manual-instructions fallback
  // as iOS Safari, just pointed at its own menu instead of the Share sheet.
  const isSamsungInternet = /SamsungBrowser/i.test(navigator.userAgent)
  // Firefox never supports beforeinstallprompt at all, on any platform.
  const isFirefox = /Firefox/i.test(navigator.userAgent)
  const manualInstallHint =
    installPromptEvent || isStandalone
      ? null
      : isIos
        ? // iOS's only real install path is Safari's Share sheet — every
          // browser there runs on WebKit, so Chrome wouldn't help.
          'To install: tap Share, then "Add to Home Screen".'
        : isSamsungInternet
          ? 'To install: open the browser menu, then "Add page to" → "Home screen". For the easiest setup, we recommend using Chrome instead.'
          : isFirefox
            ? "This browser doesn't support one-tap app install. For the easiest setup, we recommend using Chrome."
            : null

  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    let cancelled = false
    const check = () => {
      void isUpdateAvailable().then((available) => {
        if (!cancelled && available) setUpdateAvailable(true)
      })
    }
    check()
    const interval = window.setInterval(check, 5 * 60 * 1000)
    const handleVisibility = () => {
      if (!document.hidden) check()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      cancelled = true
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  // Apply an available update the moment the player is back at the main
  // menu (never mid-run, so progress is never interrupted) — a fresh
  // reload picks up the latest network-first-fetched bundle.
  useEffect(() => {
    if (!updateAvailable || screen !== 'main') return
    const timer = window.setTimeout(() => window.location.reload(), 900)
    return () => window.clearTimeout(timer)
  }, [updateAvailable, screen])

  // If this browser/device has a version recorded from before and it
  // doesn't match what's running now, the player was just updated (either
  // via the auto-reload above, or a plain page reload after a redeploy) —
  // surface what changed instead of leaving them to notice on their own. A
  // brand-new player (no recorded version at all) just gets the current
  // version silently recorded, with no changelog thrown at their first
  // screen.
  useEffect(() => {
    const lastSeen = getLastSeenVersion()
    if (lastSeen && lastSeen !== __APP_VERSION__) {
      setWhatsNewReturnTo('main')
      setScreen('whatsNew')
    }
    setLastSeenVersion(__APP_VERSION__)
  }, [])

  useEffect(() => {
    saveSettings(settings)
    configureAudio(settings)
    document.documentElement.classList.toggle(
      'reduced-motion',
      settings.reducedMotion,
    )
  }, [settings])

  useEffect(() => {
    document.getElementById('root')?.scrollTo({ top: 0, left: 0 })
  }, [screen])

  useEffect(() => {
    if (screen !== 'main') return

    startBgm(0)
    const enableMenuAudio = () => {
      unlockAudio()
      startBgm(0)
    }
    const handleVisibility = () => {
      if (document.hidden) stopBgm()
      else startBgm(0)
    }
    window.addEventListener('pointerdown', enableMenuAudio, { once: true })
    window.addEventListener('keydown', enableMenuAudio, { once: true })
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('pointerdown', enableMenuAudio)
      window.removeEventListener('keydown', enableMenuAudio)
      document.removeEventListener('visibilitychange', handleVisibility)
      stopBgm()
    }
  }, [screen])

  const beginCountdown = (stage = 0) => {
    unlockAudio()
    setStageIndex(stage)
    setFinalScore(0)
    setCountdown(COUNTDOWN_START)
    setScreen('countdown')
  }

  // Retry resumes on the stage the player died on; a full clear restarts
  // from stage 1 since there is no "died on" stage to resume.
  const handleRetry = () => {
    beginCountdown(result === 'gameover' ? stageIndex : 0)
  }

  const startGame = () => {
    unlockAudio()
    if (localStorage.getItem(TUTORIAL_KEY) === 'true') beginCountdown()
    else {
      setTutorialStep(0)
      setScreen('tutorial')
    }
  }

  const continueGame = () => {
    unlockAudio()
    beginCountdown(highestUnlockedStage)
  }

  const advanceTutorial = () => {
    const isLastStep = tutorialStep === TUTORIAL_STEPS.length - 1
    if (!isLastStep) setTutorialStep((step) => step + 1)
    else {
      localStorage.setItem(TUTORIAL_KEY, 'true')
      beginCountdown()
    }
  }

  const continueToNextStage = useCallback(() => {
    setScreen('play')
  }, [])

  const startDemoAtStage = (selectedStage: number) => {
    if (selectedStage > highestUnlockedStage) return
    setStageIndex(selectedStage)
    setScreen('demo')
  }

  const startAtStage = (selectedStage: number) => {
    if (selectedStage > highestUnlockedStage) return
    unlockAudio()
    setStageIndex(selectedStage)
    setFinalScore(0)
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

  useEffect(() => {
    if (screen !== 'stageClear') return
    if (stageAdvanceCountdown <= 0) {
      continueToNextStage()
      return
    }

    const timer = window.setTimeout(
      () => setStageAdvanceCountdown((seconds) => seconds - 1),
      1000,
    )
    return () => window.clearTimeout(timer)
  }, [screen, stageAdvanceCountdown, continueToNextStage])

  const finish = (outcome: StageResult, score: number, reason?: 'timeUp') => {
    setFinalScore(score)
    setResult(outcome)
    setGameOverReason(reason)
    if (outcome === 'clear') playVictoryFanfare()

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
    const clearedStage = stageIndex + 1
    if (clearedStage < STAGE_COUNT) {
      const nextStage = clearedStage
      setHighestUnlockedStage(unlockStage(nextStage))
      setFinalScore(score)
      setStageIndex(nextStage)
      if (clearedStage === PUBLIC_STAGE_COUNT) {
        playVictoryFanfare()
        setScreen('hiddenReveal')
      } else if (clearedStage % MILESTONE_INTERVAL === 0) {
        setMilestoneStage(clearedStage)
        playVictoryFanfare()
        setScreen('milestone')
      } else {
        setStageAdvanceCountdown(STAGE_ADVANCE_COUNTDOWN)
        setScreen('stageClear')
      }
    } else {
      finish('clear', score)
    }
  }

  const continueFromMilestone = () => {
    setStageAdvanceCountdown(STAGE_ADVANCE_COUNTDOWN)
    setScreen('stageClear')
  }

  const continueToHiddenFinale = () => {
    setCountdown(COUNTDOWN_START)
    setScreen('countdown')
  }

  const handleGameOver = (score: number, reason?: 'timeUp') => {
    finish('gameover', score, reason)
  }

  // Demo mode loops forever and never records a real score.
  const handleDemoClear = () => {
    if (
      stageIndex === PUBLIC_STAGE_COUNT - 1 &&
      highestUnlockedStage < HIDDEN_FINAL_STAGE_INDEX
    ) {
      setStageIndex(0)
      return
    }

    setStageIndex((stageIndex + 1) % STAGE_COUNT)
  }

  const handleDemoGameOver = () => {
    setDemoRunId((id) => id + 1)
  }

  const handleNameChange = (name: string) => {
    setPlayerNameState(name)
    setTopScores(renameEntry(playedAt, name).slice(0, 5))
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat) return
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return
      }

      let handled = true
      switch (screen) {
        case 'main':
          startGame()
          break
        case 'tutorial':
          advanceTutorial()
          break
        case 'stageClear':
          continueToNextStage()
          break
        case 'milestone':
          continueFromMilestone()
          break
        case 'hiddenReveal':
          continueToHiddenFinale()
          break
        case 'end':
          handleRetry()
          break
        default:
          handled = false
      }
      if (handled) event.preventDefault()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.repeat) return
      if (BACK_TO_MAIN_SCREENS.includes(screen)) {
        event.preventDefault()
        setScreen(screen === 'whatsNew' ? whatsNewReturnTo : 'main')
      }
      // 'play'/'stageClear' already handle Escape themselves (pause toggle).
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [screen, whatsNewReturnTo])

  // Push a history entry for every non-main screen so the browser/Android
  // back gesture has something to "pop" instead of leaving the app.
  useEffect(() => {
    if (screen !== 'main') history.pushState({ screen }, '')
  }, [screen])

  useEffect(() => {
    const handlePopState = () => {
      if (BACK_TO_MAIN_SCREENS.includes(screen)) {
        setScreen(screen === 'whatsNew' ? whatsNewReturnTo : 'main')
      } else if (screen === 'play' || screen === 'stageClear') {
        // No real keydown fires for a hardware back gesture — synthesize
        // the Escape GamePlay already listens for, to pause instead of
        // silently losing the run.
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [screen, whatsNewReturnTo])

  if (screen === 'intro') {
    return <Intro onComplete={() => setScreen('main')} />
  }

  if (screen === 'main') {
    const visibleStageCount = getVisibleStageCount(highestUnlockedStage)
    return (
      <div className="screen main-screen">
        <p className="app-version">v{__APP_VERSION__}</p>
        {updateAvailable && (
          <p className="update-toast">Updating to the latest version…</p>
        )}
        <div className="main-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="main-kicker">Classic World Tour • 1 Player</p>
        <h1>ORBIT</h1>
        <p className="main-tagline">Pop • Split • Clear the Stage</p>
        <p className="main-unlock-progress">
          Unlocked: Stage {highestUnlockedStage + 1} / {visibleStageCount}
        </p>
        <p className="controls-summary main-controls">{CONTROLS_SUMMARY}</p>
        <div className="main-actions">
          <button
            type="button"
            className="screen-button main-start-button"
            onClick={startGame}
          >
            Start Game
          </button>
          {highestUnlockedStage > 0 && (
            <button
              type="button"
              className="screen-button screen-button-secondary"
              onClick={continueGame}
            >
              Continue (Stage {highestUnlockedStage + 1})
            </button>
          )}
          <button
            type="button"
            className="screen-button screen-button-secondary"
            onClick={() => setScreen('demoMap')}
          >
            Watch AI Play
          </button>
          <button
            type="button"
            className="screen-button screen-button-secondary"
            onClick={() => setScreen('intro')}
          >
            Replay Intro
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
            onClick={() => setScreen('glossary')}
          >
            Glossary
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
              onClick={toggleFullscreen}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          )}
          {installPromptEvent && !isStandalone && (
            <button
              type="button"
              className="screen-button screen-button-secondary"
              onClick={() => void promptInstall()}
            >
              Install App
            </button>
          )}
        </div>
        <p className="space-hint">▼ Press Space to Start ▼</p>
      </div>
    )
  }

  if (screen === 'map') {
    return (
      <StageMap
        onBack={() => setScreen('main')}
        onStartStage={startAtStage}
        highestUnlockedStage={highestUnlockedStage}
      />
    )
  }

  if (screen === 'demoMap') {
    return (
      <StageMap
        title="Watch AI Play"
        onBack={() => setScreen('main')}
        onStartStage={startDemoAtStage}
        highestUnlockedStage={highestUnlockedStage}
      />
    )
  }

  if (screen === 'glossary') {
    return <Glossary onBack={() => setScreen('main')} />
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
        onShowWhatsNew={() => {
          setWhatsNewReturnTo('settings')
          setScreen('whatsNew')
        }}
        manualInstallHint={manualInstallHint}
      />
    )
  }

  if (screen === 'whatsNew') {
    return <WhatsNewDialog onBack={() => setScreen(whatsNewReturnTo)} />
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
        <div className="tutorial-actions">
          <button
            type="button"
            className="screen-button"
            onClick={advanceTutorial}
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
      </div>
    )
  }

  if (screen === 'countdown') {
    return (
      <div className="screen countdown-screen">
        <p className="main-kicker">Stage {stageIndex + 1}</p>
        <h1 className="countdown-number">
          {countdown > 0 ? countdown : 'Go!'}
        </h1>
        <p className="controls-summary">{CONTROLS_SUMMARY}</p>
      </div>
    )
  }

  if (screen === 'play') {
    return (
      <GamePlay
        stageIndex={stageIndex}
        initialScore={finalScore}
        onClear={handleClear}
        onGameOver={handleGameOver}
        onQuit={() => setScreen('main')}
        settings={settings}
        cleared={stageIndex < highestUnlockedStage}
      />
    )
  }

  if (screen === 'stageClear') {
    return (
      <GamePlay
        stageIndex={stageIndex}
        initialScore={finalScore}
        startCountdown={stageAdvanceCountdown}
        onClear={handleClear}
        onGameOver={handleGameOver}
        onQuit={() => setScreen('main')}
        settings={settings}
        cleared={stageIndex < highestUnlockedStage}
      />
    )
  }

  if (screen === 'milestone') {
    return (
      <div className="screen milestone-screen">
        <p className="milestone-seal" aria-hidden="true">
          ★
        </p>
        <p className="main-kicker">Certificate of Achievement</p>
        <h1>Stage {milestoneStage} Clear!</h1>
        <p className="milestone-tagline">
          {milestoneStage} stages down, {PUBLIC_STAGE_COUNT - milestoneStage} to
          go.
        </p>
        <p className="result-score">Score {finalScore}</p>
        <p className="milestone-encouragement">
          {getMilestoneEncouragement(finalScore, getBestScore())}
        </p>
        <button
          type="button"
          className="screen-button"
          onClick={continueFromMilestone}
        >
          Continue
        </button>
        <p className="space-hint">▼ Press Space to Continue ▼</p>
      </div>
    )
  }

  if (screen === 'hiddenReveal') {
    return (
      <div className="screen hidden-finale-reveal-screen">
        <div className="hidden-finale-eclipse" aria-hidden="true">
          <span />
        </div>
        <p className="main-kicker">Hidden Signal Detected</p>
        <h1>Stage 201 Unlocked</h1>
        <p className="hidden-finale-reveal-title">Eclipse Zero</p>
        <p className="hidden-finale-reveal-copy">
          The final dawn was only a doorway. Four protocols are waiting beyond
          the edge of Orbit.
        </p>
        <p className="result-score">Score carried forward: {finalScore}</p>
        <button
          type="button"
          className="screen-button hidden-finale-enter-button"
          onClick={continueToHiddenFinale}
        >
          Enter the True Finale
        </button>
        <p className="space-hint">Press Space to Enter</p>
      </div>
    )
  }

  if (screen === 'demo') {
    return (
      <div className="gameplay">
        <GamePlay
          key={demoRunId}
          demo
          stageIndex={stageIndex}
          onClear={handleDemoClear}
          onGameOver={handleDemoGameOver}
          onQuit={() => setScreen('main')}
          settings={settings}
          cleared={stageIndex < highestUnlockedStage}
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

  const isTrueFinalClear =
    result === 'clear' && stageIndex === HIDDEN_FINAL_STAGE_INDEX

  return (
    <div
      className={`screen result-screen ${result === 'clear' ? 'result-screen-clear' : ''}`}
    >
      {result === 'clear' && (
        <p className="milestone-seal" aria-hidden="true">
          ★
        </p>
      )}
      <p className="main-kicker">
        {isTrueFinalClear
          ? 'Certificate of Absolute Completion'
          : result === 'clear'
            ? 'Certificate of Completion'
            : gameOverReason === 'timeUp'
              ? 'Time Over'
              : 'Game Over'}
      </p>
      <h1>
        {isTrueFinalClear
          ? 'True Final Clear'
          : result === 'clear'
            ? 'Game Clear'
            : gameOverReason === 'timeUp'
              ? 'Time Over'
              : 'Game Over'}
      </h1>
      <p className="result-score">Score {finalScore}</p>
      <p className="result-high-score">All-time #{rank}</p>
      <p className="result-detail">
        {isTrueFinalClear
          ? 'Eclipse Zero Conquered · 201 / 201'
          : result === 'clear'
            ? 'Fully Cleared'
            : `Ended at stage ${stageIndex + 1}`}
      </p>
      <p className="result-detail result-date">
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
      <div className="result-actions">
        <button type="button" className="screen-button" onClick={handleRetry}>
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
    </div>
  )
}

export default App
