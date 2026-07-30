import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import KpiCard from '../components/dashboard/KpiCard'
import EquipmentTable from '../components/dashboard/EquipmentTable'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import QuickActions from '../components/dashboard/QuickActions'
import {
  adminKpis, customerKpis,
  mockEquipment, customerEquipment,
  mockActivity, customerActivity,
} from '../data/mockData'

function AdminView({ name }) {
  return (
    <>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-zinc-900 text-2xl font-bold">Welcome back, {name} 👋</h1>
        <p className="text-zinc-500 text-sm mt-1">Here's what's happening with your fleet today.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {adminKpis.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
        <div className="xl:col-span-3">
          <EquipmentTable data={mockEquipment} isAdmin />
        </div>
        <div className="flex flex-col gap-4">
          <QuickActions isAdmin />
          <ActivityFeed data={mockActivity.slice(0, 4)} />
        </div>
      </div>
    </>
  )
}

function CustomerView({ name }) {
  return (
    <>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-zinc-900 text-2xl font-bold">Welcome back, {name} 👋</h1>
        <p className="text-zinc-500 text-sm mt-1">Track your rented equipment and activity.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {customerKpis.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
        <div className="xl:col-span-3">
          <EquipmentTable data={customerEquipment} isAdmin={false} />
        </div>
        <div className="flex flex-col gap-4">
          <QuickActions isAdmin={false} />
          <ActivityFeed data={customerActivity} />
        </div>
      </div>
    </>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <DashboardLayout>
      {isAdmin
        ? <AdminView name={user?.name || 'Admin'} />
        : <CustomerView name={user?.name || 'User'} />
      }
    </DashboardLayout>
  )
}
