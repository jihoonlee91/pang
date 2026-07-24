import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './Intro.css'
import castleUrl from './assets/backgrounds/stages/stage011.webp'
import greatWallUrl from './assets/backgrounds/stages/stage021.webp'
import dimensionUrl from './assets/backgrounds/stages/stage041.webp'
import abyssUrl from './assets/backgrounds/stages/stage061.webp'
import voidUrl from './assets/backgrounds/stages/stage091.webp'
import solarUrl from './assets/backgrounds/stages/stage121.webp'
import riftUrl from './assets/backgrounds/stages/stage151.webp'
import finaleUrl from './assets/backgrounds/stages/stage200.webp'

type IntroProps = {
  onComplete: () => void
}

type IntroShot = {
  image: string
  alt: string
  chapter: string
  title: string
  line: string
  tone: string
}

const SHOT_DURATION_MS = 3200

const INTRO_SHOTS: readonly IntroShot[] = [
  {
    image: castleUrl,
    alt: 'A moonlit castle above a mountain valley',
    chapter: 'THE WORLD TOUR BEGINS',
    title: '200 worlds await',
    line: 'From legendary landmarks to the edge of reality.',
    tone: 'dawn',
  },
  {
    image: greatWallUrl,
    alt: 'The Great Wall winding through luminous mountain peaks',
    chapter: 'A CLASSIC ARCADE QUEST',
    title: 'Pop. Split. Survive.',
    line: 'One harpoon. Endless motion. No two battles alike.',
    tone: 'gold',
  },
  {
    image: dimensionUrl,
    alt: 'A futuristic city opening into a glowing alien dimension',
    chapter: 'BEYOND THE HORIZON',
    title: 'The tour transforms',
    line: 'New worlds bend the rules with every chapter.',
    tone: 'neon',
  },
  {
    image: abyssUrl,
    alt: 'A deep blue cosmic abyss filled with distant light',
    chapter: 'MASTER THE HAZARDS',
    title: 'Current. Gravity. Fire.',
    line: 'Read the arena. Change your rhythm. Stay alive.',
    tone: 'ocean',
  },
  {
    image: voidUrl,
    alt: 'A dark event horizon surrounded by stars and violet energy',
    chapter: 'WHEN GRAVITY FAILS',
    title: 'Trust your instincts',
    line: 'The void turns every familiar arc into a new threat.',
    tone: 'void',
  },
  {
    image: solarUrl,
    alt: 'A solar horizon erupting with enormous loops of fire',
    chapter: 'UNLEASH THE POWER',
    title: 'Turn danger into momentum',
    line: 'Collect wild power-ups and push beyond the storm.',
    tone: 'solar',
  },
  {
    image: riftUrl,
    alt: 'An observatory split open by a brilliant quantum rift',
    chapter: 'THE CHAOS RIFT',
    title: 'Every world collides',
    line: 'The final fifty stages remix everything you mastered.',
    tone: 'rift',
  },
  {
    image: finaleUrl,
    alt: 'A final sunrise seen through vast broken orbital rings',
    chapter: 'THE FINAL DAWN',
    title: 'Enter ORBIT',
    line: 'Your world tour starts now.',
    tone: 'finale',
  },
]

function Intro({ onComplete }: IntroProps) {
  const [shotIndex, setShotIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (isComplete) return

    const timer = window.setTimeout(() => {
      if (shotIndex === INTRO_SHOTS.length - 1) {
        setIsComplete(true)
      } else {
        setShotIndex((current) => current + 1)
      }
    }, SHOT_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [isComplete, shotIndex])

  const activeShot = INTRO_SHOTS[shotIndex]

  return createPortal(
    <section
      className={`intro-screen intro-tone-${activeShot.tone}`}
      aria-label="ORBIT game introduction"
    >
      <div className="intro-visuals" aria-live="polite">
        {INTRO_SHOTS.map((shot, index) => (
          <figure
            className={`intro-shot ${
              index === shotIndex ? 'intro-shot-active' : ''
            }`}
            key={shot.title}
          >
            <img src={shot.image} alt={index === shotIndex ? shot.alt : ''} />
          </figure>
        ))}
      </div>

      <div className="intro-vignette" aria-hidden="true" />
      <div className="intro-light-sweep" aria-hidden="true" />
      <div className="intro-grain" aria-hidden="true" />

      <div className="intro-brand" aria-hidden="true">
        <span className="intro-brand-orbit" />
        ORBIT
      </div>

      <button
        type="button"
        className="intro-skip"
        onClick={onComplete}
        aria-label="Skip introduction"
      >
        Skip Intro
      </button>

      <div className="intro-copy" key={shotIndex}>
        <p className="intro-chapter">{activeShot.chapter}</p>
        <h1>{activeShot.title}</h1>
        <p className="intro-line">{activeShot.line}</p>
      </div>

      <div className="intro-timeline" aria-label="Intro progress">
        <div className="intro-markers" aria-hidden="true">
          {INTRO_SHOTS.map((shot, index) => (
            <span
              className={index <= shotIndex ? 'intro-marker-seen' : ''}
              key={shot.chapter}
            />
          ))}
        </div>
        <div
          className="intro-shot-progress"
          key={`progress-${shotIndex}`}
          aria-hidden="true"
        />
      </div>

      {isComplete && (
        <div className="intro-enter-wrap">
          <button type="button" className="intro-enter" onClick={onComplete}>
            Enter Orbit
          </button>
        </div>
      )}
    </section>,
    document.body,
  )
}

export default Intro
