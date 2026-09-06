import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchLeaderboard, isSupabaseConfigured, type ScoreRow } from '../lib/supabase'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState<ScoreRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    <main className="page leaderboard">
      <header className="leaderboard-header">
        <div>
          <p className="home-kicker">Hall of fame</p>
          <h1 className="leaderboard-title">Classement</h1>
        </div>
        <Link className="btn btn-ghost" to="/">Accueil</Link>
      </header>

      {!isSupabaseConfigured && (
        <p className="leaderboard-note">
          Mode local : les scores sont stockés dans ce navigateur. Configure un projet Supabase pour un classement multi-joueurs.
        </p>
      )}

      {loading && <p className="game-loading">Chargement…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <p className="leaderboard-empty">Aucun score pour l’instant. Sois le premier à jouer !</p>
      )}

      {rows.length > 0 && (
        <ol className="leaderboard-list">
          {rows.map((row, index) => (
            <li key={row.id} className="leaderboard-row">
              <span className="leaderboard-rank">#{index + 1}</span>
              <div className="leaderboard-player">
                <strong>{row.player_name}</strong>
                <span>{formatDate(row.created_at)}</span>
              </div>
              <div className="leaderboard-scores">
                <strong>{row.score} pts</strong>
                <span>{row.countries_found} pays</span>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="result-actions" style={{ marginTop: '2rem' }}>
        <Link className="btn btn-primary" to="/">Jouer</Link>
      </div>
    </main>
  )
}
