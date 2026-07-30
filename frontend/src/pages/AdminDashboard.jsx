import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-8 shadow-xl ring-1 ring-zinc-200 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-sm text-[#FFC72C] font-semibold mb-6 uppercase tracking-widest">Admin</p>
        <button
          onClick={handleLogout}
          className="w-full bg-[#FFC72C] hover:bg-yellow-400 text-black font-semibold rounded-lg py-3 text-sm transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
