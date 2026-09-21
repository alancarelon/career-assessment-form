import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import App from './App.tsx'
import UserReport from './pages/UserReport.tsx'
import TestConnection from './pages/TestConnection.tsx'
import UnifiedDashboard from './pages/UnifiedDashboard.tsx'
import ManagerAssess from './pages/ManagerAssess.tsx'
import GapAnalysis from './pages/GapAnalysis.tsx'
import './index.css'

const AdminUserRedirect = () => {
  const { id } = useParams()
  return <Navigate to={`/user-report/${id}`} replace />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<UnifiedDashboard />} />
        <Route path="/user-report/:id" element={<UserReport />} />
        <Route path="/manager-assess/:id" element={<ManagerAssess />} />
        <Route path="/gap-analysis/:id" element={<GapAnalysis />} />
        <Route path="/test" element={<TestConnection />} />
        
        {/* Redirects for backward compatibility */}
        <Route path="/admin" element={<Navigate to="/dashboard?tab=reports" replace />} />
        <Route path="/admin/user/:id" element={<AdminUserRedirect />} />
        <Route path="/manager-dashboard" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
