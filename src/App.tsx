import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/realizace/:slug"
            element={<Navigate to="/#realizace" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
