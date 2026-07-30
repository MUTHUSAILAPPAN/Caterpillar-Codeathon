const config = {
  Available:    { dot: 'bg-green-400',  text: 'text-green-400',  bg: 'bg-green-400/10',  label: 'Available' },
  Rented:       { dot: 'bg-red-400',    text: 'text-red-400',    bg: 'bg-red-400/10',    label: 'Rented' },
  Maintenance:  { dot: 'bg-orange-400', text: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Maintenance' },
  Unauthorized: { dot: 'bg-purple-400', text: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Unauthorized' },
}

export default function StatusBadge({ status }) {
  const c = config[status] || config.Available
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'Unauthorized' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  )
}
