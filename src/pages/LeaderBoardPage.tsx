import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useLocale } from '../lib/LocaleContext'
import { fetchLeaderboard, isSupabaseConfigured, type ScoreRow } from '../lib/supabase'

export default function LeaderBoardPage() {
  const { locale, t } = useLocale()
  const copy = t.leaderboard
  const [rows, setRows] = useState<ScoreRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function formatDate(iso: string) {
    try {
      return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(iso))
    } catch {
      return iso
    }
  }

  useEffect(() => {
    let cancelled = false
    fetchLeaderboard(25)
      .then((data) => {
        if (!cancelled) setRows(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="page leaderboard" lang={locale}>
      <header className="leaderboard-header">
        <div>
          <p className="home-kicker">{copy.kicker}</p>
          <h1 className="leaderboard-title">{copy.title}</h1>
        </div>
        <Link className="btn btn-ghost" to="/">
          {copy.home}
        </Link>
      </header>

      {!isSupabaseConfigured && <p className="leaderboard-note">{copy.localNote}</p>}

      {loading && <p className="game-loading">{copy.loading}</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <p className="leaderboard-empty">{copy.empty}</p>
      )}

      {rows.length > 0 && (
        <ol className="leaderboard-list">
          {rows.slice(0, 10).map((row, index) => (
            <li key={row.id} className="leaderboard-row">
              <span className="leaderboard-rank">#{index + 1}</span>
              <div className="leaderboard-player">
                <strong>{row.player_name}</strong>
                <span>{formatDate(row.created_at)}</span>
              </div>
              <div className="leaderboard-scores">
                <strong>{row.score} pts</strong>
                <span>{copy.countries(row.countries_found)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="result-actions" style={{ marginTop: '2rem' }}>
        <Link className="btn btn-primary" to="/">
          {copy.play}
        </Link>
      </div>
    </main>
  )
}
