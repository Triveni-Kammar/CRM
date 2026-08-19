import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import OpeningAnimation from './components/OpeningAnimation'
import Login from './components/Login'
import Layout from './components/Layout'
import { ProtectedRoute } from './components/ui'
import { useAuth } from './context/AuthContext'

import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Leads from './pages/Leads'
import Tasks from './pages/Tasks'
import Employees from './pages/Employees'
import Reports from './pages/Reports'
import AIAssistant from './pages/AIAssistant'
import Settings from './pages/Settings'

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('trishul_intro_seen'))
  const { user } = useAuth()

  const finishIntro = () => {
    sessionStorage.setItem('trishul_intro_seen', '1')
    setShowIntro(false)
  }

  if (showIntro) return <OpeningAnimation onDone={finishIntro} />
  if (!user) return <Login />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<ProtectedRoute permKey="customers"><Customers /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute permKey="leads"><Leads /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute permKey="tasks"><Tasks /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute permKey="employees"><Employees /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute permKey="reports"><Reports /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute permKey="ai"><AIAssistant /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute permKey="settings"><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}
