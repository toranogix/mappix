import { useEffect, useRef, type SubmitEvent } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onSkip: () => void
  disabled?: boolean
}

export default function GuessInput({value, onChange, onSubmit, onSkip,disabled}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    if (!disabled && value.trim()) onSubmit()
  }

  return (
    <div className="guess-panel">
      <form className="guess-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="guess">Nom du pays</label>
          <input
            ref={inputRef}
            id="guess"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Tape un nom, Entrée pour confirmer…"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </form>
      <button
        type="button"
        className="btn btn-ghost guess-skip"
        disabled={disabled}
        onClick={onSkip}
      >
        Passer
      </button>
      <p className="guess-hint">Les réponses seront comptabilisées à la fin du chrono.</p>
    </div>
  )
}
