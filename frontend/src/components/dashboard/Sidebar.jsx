import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Truck, ArrowLeftRight, ClipboardList,
  BarChart2, Bell, TrendingUp, Settings, LogOut,
  ChevronLeft, ChevronRight, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const adminNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Equipment', icon: Truck, to: '/equipment' },
  { label: 'Check In / Out', icon: ArrowLeftRight, to: '/checkinout' },
  { label: 'Usage Logs', icon: ClipboardList, to: '/usage-logs' },
  { label: 'Reports', icon: BarChart2, to: '/reports' },
  { label: 'Alerts', icon: Bell, to: '/alerts' },
  { label: 'Forecasting', icon: TrendingUp, to: '/forecasting' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

const customerNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'My Equipment', icon: Truck, to: '/equipment' },
  { label: 'Check In / Out', icon: ArrowLeftRight, to: '/checkinout' },
  { label: 'Usage Logs', icon: ClipboardList, to: '/usage-logs' },
  { label: 'Alerts', icon: Bell, to: '/alerts' },
  { label: 'Forecast', icon: TrendingUp, to: '/forecasting' },
]

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const nav = user?.role === 'admin' ? adminNav : customerNav

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onMobileClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col bg-white border-r border-zinc-200
        shadow-sm transition-all duration-300
        ${collapsed ? 'w-[70px]' : 'w-[220px]'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-100">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="logo" className="w-8 h-8 object-contain" />
              <span className="text-zinc-900 font-bold text-lg">
                Fleet<span className="text-[#FFC72C]">Watch</span>
              </span>
            </div>
          )}
          {collapsed && <img src="/logo.png" alt="logo" className="w-8 h-8 object-contain mx-auto" />}
          <button
            onClick={() => { setCollapsed(!collapsed); onMobileClose?.() }}
            className="hidden lg:flex text-zinc-400 hover:text-zinc-700 transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button onClick={onMobileClose} className="lg:hidden text-zinc-400 hover:text-zinc-700 ml-auto">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
          {nav.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onMobileClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-[#FFC72C]/10 text-[#FFC72C] border border-[#FFC72C]/30'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}
              `}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4 border-t border-zinc-100 pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
