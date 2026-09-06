import { useLocale } from '../lib/LocaleContext'

type Props = {
  answered: number
  skipped: number
}

export default function ScoreBoard({ answered, skipped }: Props) {
  const { t } = useLocale()

  return (
    <div className="scoreboard" aria-live="polite">
      <div className="scoreboard-item">
        <span className="scoreboard-label">{t.game.answered}</span>
        <span className="scoreboard-value">{answered}</span>
      </div>
      <div className="scoreboard-item">
        <span className="scoreboard-label">{t.game.skipped}</span>
        <span className="scoreboard-value">{skipped}</span>
      </div>
    </div>
  )
}
