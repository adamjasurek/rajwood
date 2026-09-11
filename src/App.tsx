import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { site } from './content/site'
import { HomePage } from './pages/HomePage'
import { LegalPage } from './pages/LegalPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path={site.legal.terms.path}
            element={<LegalPage kind="terms" />}
          />
          <Route
            path={site.legal.privacy.path}
            element={<LegalPage kind="privacy" />}
          />
          <Route
            path="/ochrana-osobnich-udaju"
            element={<Navigate to={site.legal.privacy.path} replace />}
          />
          <Route
            path="/realizace/:slug"
            element={<Navigate to="/#realizace" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
