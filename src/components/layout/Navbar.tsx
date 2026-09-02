import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, BookOpen, Home, GraduationCap, Brain, Trophy, User, LogOut, BookMarked, Timer } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signOut, isDemo } = useAuth()
  const location = useLocation()

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/materials', label: 'Materials', icon: BookMarked },
    { to: '/practice', label: 'Practice', icon: GraduationCap },
    { to: '/subjects/exam', label: 'Exam', icon: Timer },
    { to: '/ai-tutor', label: 'AI Tutor', icon: Brain },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ]

  return (
    <nav className="glass-strong border-b border-sky-100/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-glow-sky group-hover:shadow-[0_0_28px_rgba(16,185,129,0.35)] transition-shadow duration-300">
              <span className="text-lg text-white font-extrabold">M</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900 hidden sm:block tracking-tight">MidWise</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/70 rounded-2xl p-1 shadow-card border border-sky-50">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-soft'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/80'
                  }`}
                >
                  <link.icon size={15} />
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isDemo && (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-200/60">Demo</span>
            )}
            <Link to="/profile" className="flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-xl hover:bg-white/80 transition-all group">
              <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-soft">
                {(user?.fullName || user?.email || 'S')[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 hidden lg:block max-w-[120px] truncate">{user?.fullName || 'Student'}</span>
            </Link>
            <button onClick={signOut} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Sign out">
              <LogOut size={17} />
            </button>
          </div>

          <button className="md:hidden p-2 rounded-xl hover:bg-sky-50 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} className="text-gray-700" /> : <Menu size={22} className="text-gray-700" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setMenuOpen(false)} />
          <div className="md:hidden fixed top-16 left-0 right-0 glass-strong border-b border-sky-100/50 shadow-elevated z-50 animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-soft'
                        : 'text-gray-600 hover:bg-white/80'
                    }`}
                  >
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
            <div className="border-t border-sky-100/50 px-4 py-3">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white/80">
                <User size={18} /> Profile
              </Link>
              <button onClick={() => { signOut(); setMenuOpen(false) }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
