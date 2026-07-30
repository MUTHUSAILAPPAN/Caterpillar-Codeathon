import { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'

export default function KpiCard({ label, value, icon, color, bg }) {
  const [count, setCount] = useState(0)
  const Icon = Icons[icon] || Icons.Activity

  useEffect(() => {
    let start = 0
    const step = Math.ceil(value / (1200 / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200 hover:border-[#FFC72C]/50 hover:shadow-md transition-all duration-300 group shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
          <p className="text-zinc-900 text-3xl font-bold">{count}</p>
        </div>
        <div className={`${bg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} className={color} />
        </div>
      </div>
    </div>
  )
}
