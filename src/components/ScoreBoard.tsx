type Props = {
    answered: number
    skipped: number
  }
  
  export default function ScoreBoard({ answered, skipped }: Props) {
    return (
      <div className="scoreboard" aria-live="polite">
        <div className="scoreboard-item">
          <span className="scoreboard-label">Réponses</span>
          <span className="scoreboard-value">{answered}</span>
        </div>
        <div className="scoreboard-item">
          <span className="scoreboard-label">Passés</span>
          <span className="scoreboard-value">{skipped}</span>
        </div>
      </div>
    )
  }
  