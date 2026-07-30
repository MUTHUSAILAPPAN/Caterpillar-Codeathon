import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import SplashScreen from './pages/SplashScreen'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CheckInOut from './pages/CheckInOut'
import Alerts from './pages/Alerts'
import UsageLogs from './pages/UsageLogs'
import RentalHistory from './pages/RentalHistory'
import Reports from './pages/Reports'
import Forecasting from './pages/Forecasting'
import PlaceholderPage from './pages/PlaceholderPage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/checkinout" element={<PrivateRoute><CheckInOut /></PrivateRoute>} />
      <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
      <Route path="/usage-logs" element={<PrivateRoute><UsageLogs /></PrivateRoute>} />
      <Route path="/rental-history" element={<PrivateRoute><RentalHistory /></PrivateRoute>} />
      <Route path="/reports" element={<AdminRoute><Reports /></AdminRoute>} />
      <Route path="/forecasting" element={<PrivateRoute><Forecasting /></PrivateRoute>} />
      <Route path="/equipment" element={<PrivateRoute><PlaceholderPage title="Equipment" /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><PlaceholderPage title="Settings" /></PrivateRoute>} />
      <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
