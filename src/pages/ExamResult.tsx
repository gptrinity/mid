import { useSearchParams, Link } from 'react-router-dom'

export default function ExamResult() {
  const [params] = useSearchParams()
  const score = parseInt(params.get('score') || '0')
  const total = parseInt(params.get('total') || '1')
  const mode = params.get('mode') || 'practice'
  const time = parseInt(params.get('time') || '0')

  const percentage = Math.round((score / total) * 100)
  const getGrade = (pct: number) => {
    if (pct >= 70) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50', label: 'Excellent' }
    if (pct >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50', label: 'Good' }
    if (pct >= 50) return { grade: 'C', color: 'text-amber-600', bg: 'bg-amber-50', label: 'Fair' }
    if (pct >= 40) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-50', label: 'Pass' }
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50', label: 'Fail' }
  }

  const result = getGrade(percentage)
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-2xl border shadow-sm p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          {mode === 'exam' ? 'Exam' : 'Practice'} Results
        </h1>

        <div className={`w-32 h-32 rounded-full ${result.bg} flex items-center justify-center mx-auto mb-6`}>
          <span className={`text-5xl font-bold ${result.color}`}>{result.grade}</span>
        </div>

        <p className="text-lg font-medium text-gray-900 mb-1">{result.label}</p>
        <p className="text-4xl font-bold text-gray-900 mb-2">{percentage}%</p>
        <p className="text-gray-500 mb-6">{score} out of {total} correct</p>

        {time > 0 && (
          <p className="text-sm text-gray-400 mb-6">Time: {minutes}m {seconds}s</p>
        )}

        <div className="flex items-center justify-center gap-2 mb-8">
          {percentage >= 50 ? (
            <span className="text-green-600 font-medium">✓ Passed</span>
          ) : (
            <span className="text-red-600 font-medium">✗ Failed (50% required)</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {mode === 'practice' ? (
            <Link to="/practice" className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700">
              Practice Again
            </Link>
          ) : (
            <Link to="/subjects" className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700">
              Take Another Exam
            </Link>
          )}
          <Link to="/dashboard" className="px-6 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
