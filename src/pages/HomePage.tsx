import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { getStoredPlayerName, setStoredPlayerName } from '../lib/storage'

export default function HomePage() {
  const navigate = useNavigate()
  const [name, setName] = useState(() => getStoredPlayerName())
  const [error, setError] = useState('')

  function start(e: SubmitEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('Choisis un pseudo d’au moins 2 caractères.')
      return
    }
    setStoredPlayerName(trimmed)
    navigate('/play')
  }

  return (
    <main className="page home">
      <div className="home-glow" aria-hidden />
      <p className="home-kicker">GEOMANIA 60 s</p>
      <h1 className="home-brand">Mappix</h1>
      <p className="home-tagline">Un contour. Un nom. Le plus de pays possible avant la fin du chrono.</p>

      <form className="home-form" onSubmit={start}>
        <div className="field">
          <label htmlFor="player">Ton pseudo</label>
          <input
            id="player"
            type="text"
            maxLength={20}
            placeholder="Ex. Atlas"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary home-cta">
          Jouer
        </button>
      </form>

      <Link className="home-leaderboard" to="/classement">
        Voir le classement →
      </Link>
    </main>
  )
}
