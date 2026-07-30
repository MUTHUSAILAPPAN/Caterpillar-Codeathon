import { Eye, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function EquipmentTable({ data, isAdmin }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-zinc-900 font-semibold text-sm">
          {isAdmin ? 'All Equipment' : 'My Equipment'}
        </h3>
        <span className="text-zinc-400 text-xs">{data.length} items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              {['ID', 'Type', isAdmin && 'Customer', 'Site', isAdmin && 'Operator', 'Status', 'Last Check-In', 'Actions']
                .filter(Boolean)
                .map(h => (
                  <th key={h} className="text-left text-zinc-400 text-xs font-semibold uppercase tracking-wider px-6 py-3">
                    {h}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((eq, i) => (
              <tr
                key={eq.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <td className="px-6 py-4 text-[#FFC72C] font-mono font-bold text-xs">{eq.id}</td>
                <td className="px-6 py-4 text-zinc-900 font-medium">{eq.type}</td>
                {isAdmin && <td className="px-6 py-4 text-zinc-600">{eq.customer}</td>}
                <td className="px-6 py-4 text-zinc-600">{eq.site}</td>
                {isAdmin && <td className="px-6 py-4 text-zinc-600">{eq.operator}</td>}
                <td className="px-6 py-4"><StatusBadge status={eq.status} /></td>
                <td className="px-6 py-4 text-zinc-400 text-xs">{eq.lastCheckIn}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                      <Eye size={14} />
                    </button>
                    {isAdmin && (
                      <>
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-50 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
