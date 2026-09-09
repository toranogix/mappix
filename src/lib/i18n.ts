export type Locale = 'fr' | 'en'

const LANG_KEY = 'mappix-locale'

export function getStoredLocale(): Locale {
  const stored = localStorage.getItem(LANG_KEY)
  return stored === 'en' || stored === 'fr' ? stored : 'fr'
}

export function setStoredLocale(locale: Locale) {
  localStorage.setItem(LANG_KEY, locale)
  window.dispatchEvent(
    new CustomEvent('mappix-locale-change', { detail: { locale } }),
  )
}

export const messages = {
  fr: {
    langLabel: 'Langue',
    home: {
      tagline: 'Un contour. Un nom. Le plus de pays possible avant la fin du chrono.',
      nickname: 'Ton pseudo',
      placeholder: 'Ex. Atlas',
      nameError: 'Choisis un pseudo d’au moins 2 caractères.',
      play: 'Jouer',
      leaderboard: 'Voir le classement →',
    },
    game: {
      loading: 'Chargement des cartes…',
      noCountries: 'Aucun pays jouable trouvé.',
      countryLabel: 'Nom du pays',
      countryPlaceholder: 'Tape un nom…',
      confirm: 'Valider',
      skip: 'Passer',
      hint: 'Les réponses seront comptabilisées à la fin du chrono.',
      answered: 'Réponses',
      skipped: 'Passés',
      timeLeft: 'Temps restant',
    },
    result: {
      kicker: 'Résultats',
      title: (name: string) => `Voici ton bilan, ${name}`,
      score: 'Score',
      correct: 'Bonnes réponses',
      answeredSkipped: 'Réponses / passés',
      skipped: 'Passé',
      saving: 'Enregistrement du score…',
      savedRemote: 'Score ajouté au classement.',
      savedLocal:
        'Score enregistré localement (configure Supabase pour un classement partagé).',
      saveError: (msg: string) => `Échec de l’enregistrement : ${msg}`,
      unknownError: 'Erreur inconnue',
      replay: 'Rejouer',
      leaderboard: 'Classement',
      home: 'Accueil',
    },
    leaderboard: {
      kicker: 'Hall of fame',
      title: 'Classement',
      home: 'Accueil',
      localNote:
        'Mode local : les scores sont stockés dans ce navigateur. Configure un projet Supabase pour un classement multi-joueurs.',
      loading: 'Chargement…',
      empty: 'Aucun score pour l’instant. Sois le premier à jouer !',
      countries: (n: number) => `${n} pays`,
      play: 'Jouer',
    },
  },
  en: {
    langLabel: 'Language',
    home: {
      tagline: 'One outline. One name. As many countries as you can before time runs out.',
      nickname: 'Your nickname',
      placeholder: 'e.g. Atlas',
      nameError: 'Pick a nickname with at least 2 characters.',
      play: 'Play',
      leaderboard: 'View the leaderboard →',
    },
    game: {
      loading: 'Loading maps…',
      noCountries: 'No playable countries found.',
      countryLabel: 'Country name',
      countryPlaceholder: 'Type a name…',
      confirm: 'Confirm',
      skip: 'Skip',
      hint: 'Answers are scored when the timer ends.',
      answered: 'Answers',
      skipped: 'Skipped',
      timeLeft: 'Time left',
    },
    result: {
      kicker: 'Results',
      title: (name: string) => `Here’s your rundown, ${name}`,
      score: 'Score',
      correct: 'Correct answers',
      answeredSkipped: 'Answers / skipped',
      skipped: 'Skipped',
      saving: 'Saving score…',
      savedRemote: 'Score added to the leaderboard.',
      savedLocal: 'Score saved locally (configure Supabase for a shared leaderboard).',
      saveError: (msg: string) => `Could not save score: ${msg}`,
      unknownError: 'Unknown error',
      replay: 'Play again',
      leaderboard: 'Leaderboard',
      home: 'Home',
    },
    leaderboard: {
      kicker: 'Hall of fame',
      title: 'Leaderboard',
      home: 'Home',
      localNote:
        'Local mode: scores are stored in this browser. Configure a Supabase project for a multiplayer leaderboard.',
      loading: 'Loading…',
      empty: 'No scores yet. Be the first to play!',
      countries: (n: number) => `${n} countries`,
      play: 'Play',
    },
  },
} as const

export type Messages = (typeof messages)[Locale]
