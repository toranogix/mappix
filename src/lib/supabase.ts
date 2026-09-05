import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type ScoreRow = {
  id: string
  player_name: string
  score: number
  countries_found: number
  created_at: string
}

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null

const LOCAL_KEY = 'mappix-local-scores'

function readLocalScores(): ScoreRow[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? (JSON.parse(raw) as ScoreRow[]) : []
  } catch {
    return []
  }
}

function writeLocalScores(rows: ScoreRow[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(rows.slice(0, 50)))
}

export async function submitScore(input: {
  playerName: string
  score: number
  countriesFound: number
}): Promise<{ ok: boolean; error?: string }> {
  const payload = {
    player_name: input.playerName.trim().slice(0, 20),
    score: input.score,
    countries_found: input.countriesFound,
  }

  if (supabase) {
    const { error } = await supabase.from('scores').insert(payload)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }

  const row: ScoreRow = {
    id: crypto.randomUUID(),
    ...payload,
    created_at: new Date().toISOString(),
  }
  const existing = readLocalScores()
  existing.push(row)
  existing.sort((a, b) => b.score - a.score)
  writeLocalScores(existing)
  return { ok: true }
}

export async function fetchLeaderboard(limit = 20): Promise<ScoreRow[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('scores')
      .select('id, player_name, score, countries_found, created_at')
      .order('score', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data ?? []
  }

  return readLocalScores().slice(0, limit)
}
