import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const role = await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl ring-1 ring-zinc-200">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <img src="/logo.png" alt="FleetWatch" className="w-12 h-12 object-contain" />
          <h2 className="text-2xl font-bold text-zinc-900">
            Fleet<span className="text-[#FFC72C]">Watch</span>
          </h2>
          <p className="text-xs text-zinc-400 tracking-widest uppercase">Sign in to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-zinc-50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FFC72C] transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-zinc-50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FFC72C] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC72C] hover:bg-yellow-400 disabled:opacity-60 text-black font-semibold rounded-lg py-3 text-sm transition-colors mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#FFC72C] font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
