import { Navigate, Route, Routes } from 'react-router'
import LanguageSwitcher from './components/LanguageSwitcher'
import { LocaleProvider } from './lib/LocaleContext'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import ResultPage from './pages/ResultPage'
import LeaderBoardPage from './pages/LeaderBoardPage'

export default function App() {
  return (
    <LocaleProvider>
      <div className="app-shell">
        <LanguageSwitcher />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<GamePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/classement" element={<LeaderBoardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </LocaleProvider>
  )
}
