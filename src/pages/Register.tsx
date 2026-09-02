import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, isDemo } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signUp(email, password, fullName)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Desktop: Full split panel with blurry medical image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-sQdjtNQxqTs?w=1200&q=80"
            alt="Midwife assisting a woman in labour"
            className="w-full h-full object-cover blur-[3px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/70 via-sky-800/60 to-sky-900/70" />
        </div>
        <div className="relative z-10 text-white max-w-md">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-glow-sky">
            <Sparkles className="text-white" size={28} />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight tracking-tight">Your Study Journey Starts Here</h2>
          <p className="text-sky-100 text-lg leading-relaxed">Join thousands of midwifery students preparing smarter with AI-powered practice and exams.</p>
          <div className="mt-10 flex gap-8">
            <div>
              <p className="text-3xl font-extrabold">30</p>
              <p className="text-sky-200 text-sm">Subjects</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">1200+</p>
              <p className="text-sky-200 text-sm">Questions</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">5</p>
              <p className="text-sky-200 text-sm">Levels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Blurry image background behind form */}
      <div className="lg:hidden fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-sQdjtNQxqTs?w=800&q=80"
          alt="Midwife assisting a woman in labour"
          className="w-full h-full object-cover blur-[4px] scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-sky-900/40 to-white/95" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 lg:bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-sky">
              <span className="text-2xl text-white font-extrabold">M</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">MidWise</h1>
            <p className="text-sm text-white/70 mt-1">Create your account</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Get started</h1>
            <p className="text-gray-500 mt-2">Create your account to begin studying</p>
          </div>

          {isDemo && (
            <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 mb-5 text-sm text-amber-700 flex items-center gap-2">
              <span className="text-base">Demo mode</span> — enter any details to continue
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-600 animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 lg:bg-white lg:p-6 lg:rounded-2xl lg:shadow-elevated">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="input-modern pl-10 pr-4"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input-modern pl-10 pr-4"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  className="input-modern pl-10 pr-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
