import { useState } from 'react'
import './App.css'
import GamePlay from './GamePlay'
import { STAGE_COUNT, HIGH_SCORE_KEY } from './game/constants'
import type { StageResult } from './game/types'

type Screen = 'main' | 'select' | 'play' | 'end'

function App() {
  const [screen, setScreen] = useState<Screen>('main')
  const [selectedMission, setSelectedMission] = useState<string | null>(null)
  const [stageIndex, setStageIndex] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [result, setResult] = useState<StageResult>('gameover')

  const startGame = () => {
    setStageIndex(0)
    setScreen('play')
  }

  const finish = (outcome: StageResult, score: number) => {
    setFinalScore(score)
    setResult(outcome)

    const highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) ?? '0')
    if (score > highScore) {
      localStorage.setItem(HIGH_SCORE_KEY, String(score))
    }

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

  if (screen === 'main') {
    return (
      <div>
        <h1>PANG</h1>
        <button type="button" onClick={() => setScreen('select')}>
          게임 선택하기
        </button>
      </div>
    )
  }

  if (screen === 'select') {
    return (
      <div>
        <h1>게임 선택</h1>
        <button
          type="button"
          onClick={() => setSelectedMission('미션 1')}
        >
          미션 1
        </button>
        {selectedMission && (
          <div>
            <p>선택됨: {selectedMission}</p>
            <button type="button" onClick={startGame}>
              시작
            </button>
          </div>
        )}
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

  const highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) ?? '0')

  return (
    <div>
      <h1>{result === 'clear' ? '게임 클리어' : '게임 오버'}</h1>
      <p>점수: {finalScore}</p>
      <p>최고 점수: {highScore}</p>
      <button
        type="button"
        onClick={() => {
          setSelectedMission(null)
          setScreen('main')
        }}
      >
        메인으로
      </button>
    </div>
  )
}

export default App
