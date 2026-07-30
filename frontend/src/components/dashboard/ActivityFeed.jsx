import { LogIn, LogOut, AlertTriangle, PlusCircle, UserCheck, Wrench } from 'lucide-react'

const iconMap = {
  LogIn:         { Icon: LogIn,          color: 'text-green-600',  bg: 'bg-green-50' },
  LogOut:        { Icon: LogOut,         color: 'text-blue-600',   bg: 'bg-blue-50' },
  AlertTriangle: { Icon: AlertTriangle,  color: 'text-purple-600', bg: 'bg-purple-50' },
  PlusCircle:    { Icon: PlusCircle,     color: 'text-amber-600',  bg: 'bg-amber-50' },
  UserCheck:     { Icon: UserCheck,      color: 'text-cyan-600',   bg: 'bg-cyan-50' },
  Wrench:        { Icon: Wrench,         color: 'text-orange-600', bg: 'bg-orange-50' },
}

export default function ActivityFeed({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-zinc-900 font-semibold text-sm">Recent Activity</h3>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
      <div className="divide-y divide-zinc-100 max-h-[420px] overflow-y-auto">
        {data.map((item) => {
          const { Icon, color, bg } = iconMap[item.icon] || iconMap.LogIn
          return (
            <div key={item.id} className="flex items-start gap-3 px-6 py-4 hover:bg-zinc-50 transition-colors">
              <div className={`${bg} p-2 rounded-lg shrink-0 mt-0.5`}>
                <Icon size={14} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-700 text-sm leading-snug">{item.text}</p>
                <p className="text-zinc-400 text-xs mt-1">{item.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
