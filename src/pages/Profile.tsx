import { useAuth } from '../context/AuthContext'
import { subjects } from '../data/subjects'
import { allQuestions } from '../data'
import { BookOpen, Star, Flame, Target, Settings, LogOut, TrendingUp, Award } from 'lucide-react'

export default function Profile() {
  const { user, signOut } = useAuth()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      <div className="card-modern overflow-hidden mb-6">
        <div className="gradient-hero-animated h-32 sm:h-36 relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute bottom-4 right-10 w-40 h-40 bg-emerald-300/20 rounded-full blur-2xl" />
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12 mb-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 gradient-primary rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white shadow-elevated ring-4 ring-white">
              {(user?.fullName || user?.email || 'S')[0].toUpperCase()}
            </div>
            <div className="pb-1 flex-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{user?.fullName || 'Student'}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: BookOpen, label: 'Questions', value: allQuestions.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: Star, label: 'Subjects', value: subjects.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Target, label: 'Avg Score', value: '--', color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: Flame, label: 'Streak', value: '0d', color: 'text-red-500', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="card-modern p-4 text-center">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={stat.color} size={18} />
            </div>
            <p className="text-lg font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card-modern p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="text-gray-400" size={18} />
          <h3 className="font-bold text-gray-900">Study Stats</h3>
        </div>
        <div className="space-y-3">
          {[
            { icon: Award, label: 'Exams Completed', value: '0', color: 'bg-blue-500', width: '0%' },
            { icon: TrendingUp, label: 'Average Score', value: '--', color: 'bg-emerald-500', width: '0%' },
            { icon: Flame, label: 'Study Streak', value: '0 days', color: 'bg-amber-500', width: '0%' },
            { icon: BookOpen, label: 'Favorite Subject', value: '--', color: 'bg-purple-500', width: '0%' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 ${stat.color} rounded-full`} />
                <div className="flex items-center gap-2">
                  <stat.icon size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">MidWise v1.0 — Midwifery Study Platform</p>
      </div>
    </div>
  )
}
