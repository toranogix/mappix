import { matchesCountry } from './normalize'
import { scoreForAnswer } from './scoring'
import { COUNTRY_BY_ID } from '../data/countries'

export type RoundAnswer = {
  countryId: string
  guess: string | null
  elapsedMs: number
}

export type GradedAnswer = RoundAnswer & {
  countryName: string
  correct: boolean
  points: number
}

export function gradeAnswers(answers: RoundAnswer[]): {
  score: number
  countriesFound: number
  answered: number
  skipped: number
  details: GradedAnswer[]
} {
  const details: GradedAnswer[] = answers.map((a) => {
    const meta = COUNTRY_BY_ID.get(a.countryId)
    const countryName = meta?.name ?? a.countryId
    const correct =
      a.guess != null &&
      meta != null &&
      matchesCountry(a.guess, meta.name, meta.aliases)
    const points = correct ? scoreForAnswer(a.elapsedMs) : 0
    return { ...a, countryName, correct, points }
  })

  return {
    score: details.reduce((sum, d) => sum + d.points, 0),
    countriesFound: details.filter((d) => d.correct).length,
    answered: details.filter((d) => d.guess != null).length,
    skipped: details.filter((d) => d.guess == null).length,
    details,
  }
}
