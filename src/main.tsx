import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import RequireAuth from './components/admin/RequireAuth.tsx'
import AdminLayout from './layouts/AdminLayout.tsx'
import AdminDashboard from './pages/admin/AdminDashboard.tsx'
import AdminHappening from './pages/admin/AdminHappening.tsx'
import AdminRegistrations from './pages/admin/AdminRegistrations.tsx'
import AdminSchedules from './pages/admin/AdminSchedules.tsx'
import Login from './pages/admin/Login.tsx'
import Foreword from './pages/Foreword.tsx'
import Happening from './pages/Happening.tsx'
import NextConference from './pages/NextConference.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/registrations" element={<Navigate to="/admin/registrations" replace />} />
        <Route path="/foreword/:slug" element={<Foreword />} />
        <Route path="/happening" element={<Happening />} />
        <Route path="/next-conference" element={<NextConference />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="happening" element={<RequireAuth><AdminHappening /></RequireAuth>} />
          <Route path="registrations" element={<RequireAuth><AdminRegistrations /></RequireAuth>} />
          <Route path="schedules" element={<RequireAuth><AdminSchedules /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
