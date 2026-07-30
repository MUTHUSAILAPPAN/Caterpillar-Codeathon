export const mockEquipment = [
  { id: 'EQ-001', type: 'Excavator 320', customer: 'BuildCo Ltd', site: 'Site Alpha', operator: 'James Roe', status: 'Rented', lastCheckIn: '2025-07-10 08:30' },
  { id: 'EQ-002', type: 'Bulldozer D6', customer: 'TerraWorks', site: 'Site Beta', operator: 'Maria Chen', status: 'Available', lastCheckIn: '2025-07-09 14:15' },
  { id: 'EQ-003', type: 'Crane LTM 1050', customer: 'SkyBuild Inc', site: 'Site Gamma', operator: 'Raj Patel', status: 'Maintenance', lastCheckIn: '2025-07-08 11:00' },
  { id: 'EQ-004', type: 'Loader 950M', customer: 'BuildCo Ltd', site: 'Site Alpha', operator: 'Sara Kim', status: 'Rented', lastCheckIn: '2025-07-10 07:45' },
  { id: 'EQ-005', type: 'Compactor CS56', customer: 'RoadMasters', site: 'Site Delta', operator: 'Tom Blake', status: 'Unauthorized', lastCheckIn: '2025-07-10 03:22' },
  { id: 'EQ-006', type: 'Grader 140M', customer: 'TerraWorks', site: 'Site Beta', operator: 'Lena Fox', status: 'Available', lastCheckIn: '2025-07-07 16:00' },
  { id: 'EQ-007', type: 'Backhoe 420F', customer: 'SkyBuild Inc', site: 'Site Gamma', operator: 'Chris Wu', status: 'Rented', lastCheckIn: '2025-07-10 09:10' },
  { id: 'EQ-008', type: 'Telehandler TH357', customer: 'RoadMasters', site: 'Site Delta', operator: 'Nina Ross', status: 'Available', lastCheckIn: '2025-07-06 13:30' },
]

export const mockActivity = [
  { id: 1, type: 'checkin', text: 'EQ-001 checked in at Site Alpha', time: '2 min ago', icon: 'LogIn' },
  { id: 2, type: 'checkout', text: 'EQ-004 checked out by Sara Kim', time: '15 min ago', icon: 'LogOut' },
  { id: 3, type: 'unauthorized', text: 'Unauthorized access detected on EQ-005', time: '32 min ago', icon: 'AlertTriangle' },
  { id: 4, type: 'added', text: 'New equipment EQ-008 added to fleet', time: '1 hr ago', icon: 'PlusCircle' },
  { id: 5, type: 'operator', text: 'Operator Raj Patel assigned to EQ-003', time: '2 hr ago', icon: 'UserCheck' },
  { id: 6, type: 'checkin', text: 'EQ-007 checked in at Site Gamma', time: '3 hr ago', icon: 'LogIn' },
  { id: 7, type: 'maintenance', text: 'EQ-003 moved to Maintenance', time: '5 hr ago', icon: 'Wrench' },
]

export const adminKpis = [
  { label: 'Total Equipment', value: 8, icon: 'Truck', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Available', value: 3, icon: 'CheckCircle', color: 'text-green-400', bg: 'bg-green-400/10' },
  { label: 'Rented', value: 3, icon: 'Key', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { label: 'Maintenance', value: 1, icon: 'Wrench', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { label: 'Unauthorized', value: 1, icon: 'ShieldAlert', color: 'text-purple-400', bg: 'bg-purple-400/10' },
]

export const customerKpis = [
  { label: 'My Equipment', value: 3, icon: 'Truck', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Active Rentals', value: 2, icon: 'Key', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { label: 'Available', value: 1, icon: 'CheckCircle', color: 'text-green-400', bg: 'bg-green-400/10' },
  { label: 'Upcoming Returns', value: 2, icon: 'CalendarClock', color: 'text-pink-400', bg: 'bg-pink-400/10' },
]

// Equipment filtered for a specific customer (BuildCo Ltd)
export const customerEquipment = mockEquipment.filter(e => e.customer === 'BuildCo Ltd')

export const customerActivity = mockActivity.filter(a =>
  a.text.includes('EQ-001') || a.text.includes('EQ-004')
)
