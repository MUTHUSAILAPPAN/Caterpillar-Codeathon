import { useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Header({ onMenuClick }) {
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-zinc-400 hover:text-zinc-700">
          <Menu size={22} />
        </button>
        <div className="hidden sm:flex items-center gap-2 lg:hidden">
          <img src="/logo.png" alt="FleetWatch" className="w-7 h-7 object-contain" />
          <span className="text-zinc-900 font-semibold text-base">
            Fleet<span className="text-[#FFC72C]">Watch</span>
          </span>
        </div>
        <span className="hidden md:block text-zinc-400 text-sm">{today}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFC72C] rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 p-4">
              <p className="text-zinc-900 font-semibold text-sm mb-3">Notifications</p>
              {['Unauthorized access on EQ-005', 'EQ-003 due for maintenance', 'New rental request from TerraWorks'].map((n, i) => (
                <div key={i} className="py-2 border-b border-zinc-100 last:border-0">
                  <p className="text-zinc-600 text-xs">{n}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFC72C] flex items-center justify-center text-black font-bold text-xs">
            {initials}
          </div>
          <span className="hidden sm:block text-zinc-800 text-sm font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
