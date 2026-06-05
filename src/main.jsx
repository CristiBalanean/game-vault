import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import GamePage from './components/GamePage.jsx'
import './index.css'
import Layout from './components/Layout.jsx'
import NotFound from './components/NotFound.jsx'
import Backlog from './components/Backlog.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout></Layout>}>
          <Route path="/" element={<App />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/backlog" element={<Backlog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)