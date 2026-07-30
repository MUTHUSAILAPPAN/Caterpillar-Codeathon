import { Construction } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'

export default function PlaceholderPage({ title }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
          <Construction size={40} className="text-[#FFC72C]" />
        </div>
        <h2 className="text-zinc-900 text-2xl font-bold">{title}</h2>
        <p className="text-zinc-400 text-sm">This screen is under construction. Check back soon.</p>
      </div>
    </DashboardLayout>
  )
}
