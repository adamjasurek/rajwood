import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { site } from './content/site'
import { HomePage } from './pages/HomePage'
import { LegalPage } from './pages/LegalPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RealizationsPage } from './pages/RealizationsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path={site.gallery.path} element={<RealizationsPage />} />
          <Route
            path={`${site.gallery.path}/:slug`}
            element={<Navigate to={site.gallery.path} replace />}
          />
          <Route path={site.legal.privacy.path} element={<LegalPage />} />
          <Route
            path="/ochrana-osobnich-udaju"
            element={<Navigate to={site.legal.privacy.path} replace />}
          />
          <Route
            path="/obchodni-podminky"
            element={<Navigate to="/" replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
