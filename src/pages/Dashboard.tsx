import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Brain, Star, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { subjects } from '../data/subjects'
import { allQuestions } from '../data'

export default function Dashboard() {
  const { user } = useAuth()

  const totalQuestions = allQuestions.length
  const totalSubjects = subjects.length
  const level100Count = subjects.filter(s => s.level === 100).length
  const level200Count = subjects.filter(s => s.level === 200).length
  const level300Count = subjects.filter(s => s.level === 300).length
  const level400Count = subjects.filter(s => s.level === 400).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName || 'Student'}!</h1>
        <p className="text-gray-600 mt-1">Ready to continue your midwifery studies?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg"><BookOpen className="text-emerald-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalSubjects}</p>
              <p className="text-sm text-gray-500">Subjects</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><TrendingUp className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
              <p className="text-sm text-gray-500">Questions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Star className="text-purple-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Exams Taken</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg"><Brain className="text-amber-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">AI</p>
              <p className="text-sm text-gray-500">Tutor Ready</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link to="/practice" className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all">
          <GraduationCap size={32} className="mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold">Practice Mode</h3>
          <p className="text-emerald-100 text-sm mt-1">Study with instant feedback and explanations</p>
        </Link>
        <Link to="/subjects" className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all">
          <BookOpen size={32} className="mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold">Exam Mode</h3>
          <p className="text-blue-100 text-sm mt-1">Timed exams with grading system</p>
        </Link>
        <Link to="/ai-tutor" className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all">
          <Brain size={32} className="mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold">AI Tutor</h3>
          <p className="text-purple-100 text-sm mt-1">Ask questions and learn with AI assistance</p>
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Level</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '100 Level', count: level100Count, color: 'bg-green-50 border-green-200 text-green-700' },
            { label: '200 Level', count: level200Count, color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { label: '300 Level', count: level300Count, color: 'bg-purple-50 border-purple-200 text-purple-700' },
            { label: '400 Level', count: level400Count, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          ].map(level => (
            <Link to="/subjects" key={level.label} className={`rounded-xl border p-4 text-center hover:shadow-md transition-shadow ${level.color}`}>
              <p className="text-2xl font-bold">{level.count}</p>
              <p className="text-sm">{level.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.filter(s => s.level === 200 || s.level === 300).slice(0, 6).map(subject => (
            <Link
              key={subject.id}
              to={`/practice/${subject.id}`}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">{subject.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{subject.name}</p>
                <p className="text-sm text-gray-500">{subject.questionCount} questions</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{subject.level}L</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
