import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Brain, TrendingUp, ChevronRight, Sparkles, Zap, ArrowRight, BookMarked } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { subjects } from '../data/subjects'
import { allQuestions, getQuestionCountBySubject } from '../data'
import { useStudyProgress } from '../hooks/useStudyProgress'

export default function Dashboard() {
  const { user } = useAuth()
  const { getStudiedCount, getTotalStudied } = useStudyProgress()

  const totalQuestions = allQuestions.length
  const totalSubjects = subjects.length
  const totalStudied = getTotalStudied()
  const levelCounts = [100, 200, 300, 400].map(l => ({
    level: l,
    count: subjects.filter(s => s.level === l).length,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="gradient-hero-animated rounded-3xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-emerald-300/20 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-emerald-300" size={20} />
              <span className="text-emerald-200 text-xs font-semibold uppercase tracking-widest">Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1 tracking-tight">Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}!</h1>
            <p className="text-emerald-100 text-sm sm:text-base">Ready to continue your midwifery studies?</p>
          </div>
          <Sparkles className="text-emerald-300 hidden sm:block animate-pulse-soft" size={32} />
        </div>
        <div className="flex flex-wrap gap-3 mt-6 relative z-10">
          <Link to="/practice" className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-white/10 hover:border-white/20">
            <GraduationCap size={16} /> Start Practice <ArrowRight size={14} />
          </Link>
          <Link to="/materials" className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-white/10 hover:border-white/20">
            <BookMarked size={16} /> Study Materials <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'Subjects', value: totalSubjects, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { icon: TrendingUp, label: 'Questions', value: totalQuestions, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { icon: BookMarked, label: 'Topics Studied', value: totalStudied, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
          { icon: Brain, label: 'AI Tutor', value: 'Ready', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map((stat, i) => (
          <div key={i} className={`card-modern p-4 sm:p-5 border ${stat.border} animate-slide-up stagger-${i + 1}`}>
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link to="/practice" className="group card-modern p-5 border border-emerald-100 hover:border-emerald-200">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow-green transition-shadow duration-300">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Practice Mode</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Study with instant feedback and detailed explanations</p>
          <div className="mt-3 flex items-center gap-1 text-emerald-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Start now <ArrowRight size={14} />
          </div>
        </Link>
        <Link to="/materials" className="group card-modern p-5 border border-blue-100 hover:border-blue-200">
          <div className="w-12 h-12 gradient-blue rounded-2xl flex items-center justify-center mb-4">
            <BookMarked className="text-white" size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Study Materials</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Browse topics and track your study progress</p>
          <div className="mt-3 flex items-center gap-1 text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Browse now <ArrowRight size={14} />
          </div>
        </Link>
        <Link to="/ai-tutor" className="group card-modern p-5 border border-purple-100 hover:border-purple-200">
          <div className="w-12 h-12 gradient-purple rounded-2xl flex items-center justify-center mb-4 shadow-glow-purple">
            <Brain className="text-white" size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">AI Tutor</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Ask questions and learn with AI assistance</p>
          <div className="mt-3 flex items-center gap-1 text-purple-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Start now <ArrowRight size={14} />
          </div>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Browse by Level</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {levelCounts.map(l => (
            <Link to="/subjects" key={l.level} className="card-modern p-4 text-center group">
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white ${
                l.level === 100 ? 'bg-emerald-500' : l.level === 200 ? 'bg-blue-500' : l.level === 300 ? 'bg-purple-500' : 'bg-amber-500'
              }`}>{l.level}</div>
              <p className="text-xl font-extrabold text-gray-900">{l.count}</p>
              <p className="text-xs text-gray-500 mt-0.5">Subjects</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Popular Subjects</h2>
          <Link to="/subjects" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.filter(s => s.level === 200 || s.level === 300).slice(0, 6).map(subject => {
            const studied = getStudiedCount(subject.id)
            const total = subject.topics.length
            return (
              <Link
                key={subject.id}
                to={`/practice/${subject.id}`}
                className="card-modern flex items-center gap-3 p-4 group"
              >
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-emerald-100 transition-colors">{subject.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{subject.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{getQuestionCountBySubject(subject.id)} questions</p>
                  {studied > 0 && (
                    <div className="mt-1 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((studied / total) * 100)}%` }} />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full">{subject.level}L</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
