import { PlusCircle, LogIn, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function QuickActions({ isAdmin }) {
  const navigate = useNavigate()

  const actions = [
    isAdmin && {
      label: 'Add Equipment', icon: PlusCircle,
      color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
      hover: 'hover:bg-amber-100 hover:border-amber-300',
      onClick: () => {},
    },
    {
      label: 'Check In', icon: LogIn,
      color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
      hover: 'hover:bg-green-100 hover:border-green-300',
      onClick: () => navigate('/checkinout'),
    },
    {
      label: 'Check Out', icon: LogOut,
      color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
      hover: 'hover:bg-blue-100 hover:border-blue-300',
      onClick: () => navigate('/checkinout'),
    },
  ].filter(Boolean)

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
      <h3 className="text-zinc-900 font-semibold text-sm mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map(({ label, icon: Icon, color, bg, border, hover, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border ${bg} ${border} ${hover} transition-all duration-200 group`}
          >
            <div className={`${bg} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
              <Icon size={16} className={color} />
            </div>
            <span className={`${color} font-semibold text-sm`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
