import { Link } from 'react-router-dom'
import { subjects } from '../data/subjects'

export default function Subjects() {
  const levels = [100, 200, 300, 400] as const

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">All Subjects</h1>
      <p className="text-gray-600 mb-8">{subjects.length} subjects with {subjects.reduce((a, s) => a + s.questionCount, 0)}+ questions</p>

      {levels.map(level => {
        const levelSubjects = subjects.filter(s => s.level === level)
        if (levelSubjects.length === 0) return null
        return (
          <div key={level} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                level === 100 ? 'bg-green-500' : level === 200 ? 'bg-blue-500' : level === 300 ? 'bg-purple-500' : 'bg-amber-500'
              }`}>{level}</span>
              {level} Level Subjects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {levelSubjects.map(subject => (
                <Link
                  key={subject.id}
                  to={`/practice/${subject.id}`}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{subject.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{subject.name}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{subject.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{subject.questionCount} Q</span>
                        <span className="text-xs text-gray-400">Level {subject.level}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
