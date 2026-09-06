# Mappix

A 60-second geography quiz. Guess as many countries as you can from their outline before the timer runs out. Faster answers score more points.

## Stack

- React + Vite + TypeScript
- D3 Geo for country outlines
- Supabase for the leaderboard (falls back to local storage if not configured)

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Optional: Supabase leaderboard

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Without these variables, scores are stored in the browser only.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Build for production     |
| `npm run preview` | Preview the production build |

## Contribution
Feel free to contribute to the project.