import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Animated content wrapper */}
      <div className="flex flex-col items-center gap-6 animate-fadeIn">

        {/* Logo */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg ring-2 ring-[#FFC72C]/40">
          <img
            src="/logo.png"
            alt="FleetWatch Logo"
            className="w-full h-full object-contain bg-zinc-100 p-2"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900">
          Fleet<span className="text-[#FFC72C]">Watch</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-zinc-500 tracking-widest uppercase font-medium">
          Smart Rental Tracking System
        </p>

        {/* Progress bar */}
        <div className="w-48 sm:w-64 h-[3px] bg-zinc-200 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-[#FFC72C] rounded-full animate-progressBar" />
        </div>
      </div>
    </div>
  )
}
