import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import UserReport from './pages/UserReport.tsx'
import TestConnection from './pages/TestConnection.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/user/:id" element={<UserReport />} />
        <Route path="/test" element={<TestConnection />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
