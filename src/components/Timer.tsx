import type { CSSProperties } from 'react'
import { useLocale } from '../lib/LocaleContext'

type Props = {
  remainingMs: number
  totalMs: number
}

export default function Timer({ remainingMs, totalMs }: Props) {
  const { t } = useLocale()
  const seconds = Math.ceil(remainingMs / 1000)
  const ratio = Math.max(0, remainingMs / totalMs)
  const urgent = seconds <= 10

  return (
    <div className={`timer ${urgent ? 'timer--urgent' : ''}`} aria-live="polite">
      <div className="timer-ring" style={{ '--ratio': ratio } as CSSProperties}>
        <span className="timer-value">{seconds}s</span>
      </div>
      <span className="timer-label">{t.game.timeLeft}</span>
    </div>
  )
}
