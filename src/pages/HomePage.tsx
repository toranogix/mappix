import { useEffect, useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useLocale } from '../lib/LocaleContext'
import { getStoredPlayerName, setStoredPlayerName } from '../lib/storage'

export default function HomePage() {
  const navigate = useNavigate()
  const {locale, t} = useLocale()
  const [name, setName] = useState(() => getStoredPlayerName())
  const [error, setError] = useState('')
  const copy = t.home

  useEffect(() => {
    setError('')
  }, [locale])

  function start(e: SubmitEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError(copy.nameError)
      return
    }
    setStoredPlayerName(trimmed)
    navigate('/play')
  }

  return (
    <main className="page home" lang={locale}>
      <div className="home-glow" aria-hidden />

      <p className="home-kicker">GEOMANIA 60s</p>
      <h1 className="home-brand">Mappix</h1>
      <p className="home-tagline">{copy.tagline}</p>

      <form className="home-form" onSubmit={start}>
        <div className="field">
          <label htmlFor="player">{copy.nickname}</label>
          <input
            id="player"
            type="text"
            maxLength={20}
            placeholder={copy.placeholder}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary home-cta">
          {copy.play}
        </button>
      </form>

      <Link className="home-leaderboard" to="/classement">
        {copy.leaderboard}
      </Link>
    </main>
  )
}
