import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UXGrowthJourney from './components/UXGrowthJourney'
import AdminDashboard from './pages/AdminDashboard'
import UserReport from './pages/UserReport'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UXGrowthJourney />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/user/:id" element={<UserReport />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
