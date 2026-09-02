import { useSearchParams, Link } from 'react-router-dom'
import { Trophy, RotateCcw, Home, BookOpen, CheckCircle, XCircle, Clock, Target } from 'lucide-react'
import { subjects } from '../data/subjects'

export default function ExamResult() {
  const [params] = useSearchParams()
  const subject = params.get('subject') || 'all'
  const score = parseInt(params.get('score') || '0')
  const total = parseInt(params.get('total') || '0')
  const time = parseInt(params.get('time') || '0')
  const mode = params.get('mode') || 'practice'

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  const incorrect = total - score

  const getGrade = (pct: number) => {
    if (pct >= 90) return { grade: 'A', color: 'text-sky-600', bg: 'bg-sky-50', ring: 'ring-sky-200', label: 'Excellent!' }
    if (pct >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-200', label: 'Great job!' }
    if (pct >= 70) return { grade: 'C', color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-200', label: 'Good effort!' }
    if (pct >= 60) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-200', label: 'Needs improvement' }
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-200', label: 'Keep practicing!' }
  }

  const gradeInfo = getGrade(percentage)
  const subjectInfo = subjects.find(s => s.id === subject)
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference - (percentage / 100) * circumference

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      <div className="card-modern p-6 sm:p-8 text-center mb-6">
        <div className="mb-6">
          <div className={`w-16 h-16 ${gradeInfo.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 ring-4 ${gradeInfo.ring}`}>
            <Trophy className={gradeInfo.color} size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Exam Complete!</h1>
          <p className={`text-sm font-semibold mt-1 ${gradeInfo.color}`}>{gradeInfo.label}</p>
        </div>

        <div className="relative inline-block mb-6">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              className={`${gradeInfo.color === 'text-sky-600' ? 'stroke-sky-500' : gradeInfo.color === 'text-blue-600' ? 'stroke-blue-500' : gradeInfo.color === 'text-amber-600' ? 'stroke-amber-500' : gradeInfo.color === 'text-orange-600' ? 'stroke-orange-500' : 'stroke-red-500'}`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-gray-900">{percentage}%</span>
            <span className={`text-sm font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <div className="bg-sky-50 rounded-xl p-3 border border-sky-100">
            <CheckCircle className="text-sky-500 mx-auto mb-1" size={18} />
            <p className="text-lg font-extrabold text-sky-700">{score}</p>
            <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Correct</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 border border-red-100">
            <XCircle className="text-red-500 mx-auto mb-1" size={18} />
            <p className="text-lg font-extrabold text-red-700">{incorrect}</p>
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Incorrect</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <Clock className="text-gray-500 mx-auto mb-1" size={18} />
            <p className="text-lg font-extrabold text-gray-700">{minutes}:{String(seconds).padStart(2, '0')}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Time</p>
          </div>
        </div>
      </div>

      {subjectInfo && (
        <div className="card-modern p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-lg">{subjectInfo.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{subjectInfo.name}</p>
            <p className="text-xs text-gray-500">{mode === 'exam' ? 'Exam' : 'Practice'} Mode</p>
          </div>
          <div className="flex items-center gap-1 text-sky-600">
            <Target size={14} />
            <span className="text-sm font-bold">{score}/{total}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/dashboard" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all">
          <Home size={16} /> Dashboard
        </Link>
        <Link
          to={subject !== 'all' ? `/practice/${subject}` : '/practice'}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-sky-200 text-sky-700 font-semibold text-sm hover:bg-sky-50 transition-all"
        >
          <RotateCcw size={16} /> Practice Again
        </Link>
        <Link to="/subjects" className="flex-1 flex items-center justify-center gap-2 btn-primary">
          <BookOpen size={16} /> Take Exam
        </Link>
      </div>
    </div>
  )
}
