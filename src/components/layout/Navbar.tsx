import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, BookOpen, Home, GraduationCap, Brain, Trophy, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signOut, isDemo } = useAuth()
  const location = useLocation()

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/practice', label: 'Practice', icon: GraduationCap },
    { to: '/ai-tutor', label: 'AI Tutor', icon: Brain },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold text-emerald-700">MidWise</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isDemo && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Demo Mode</span>
            )}
            <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-700">
              <User size={16} />
              {user?.fullName || user?.email}
            </Link>
            <button onClick={signOut} className="p-2 text-gray-400 hover:text-red-500">
              <LogOut size={16} />
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                location.pathname === link.to
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
          <div className="border-t mt-2 pt-2">
            <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600">
              <User size={18} /> Profile
            </Link>
            <button onClick={() => { signOut(); setMenuOpen(false) }} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 w-full">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
