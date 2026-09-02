import { useAuth } from '../context/AuthContext'
import { subjects } from '../data/subjects'
import { allQuestions } from '../data'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-700">
            {(user?.fullName || user?.email || 'S')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.fullName || 'Student'}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{allQuestions.length}</p>
          <p className="text-sm text-gray-500">Total Questions</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{subjects.length}</p>
          <p className="text-sm text-gray-500">Subjects</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">4</p>
          <p className="text-sm text-gray-500">Levels</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Study Stats</h3>
        <div className="space-y-3">
          {[
            { label: 'Exams Completed', value: '0', color: 'bg-blue-100' },
            { label: 'Average Score', value: '--', color: 'bg-emerald-100' },
            { label: 'Study Streak', value: '0 days', color: 'bg-amber-100' },
            { label: 'Favorite Subject', value: '--', color: 'bg-purple-100' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 ${stat.color} rounded-full`} />
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <span className="font-medium text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
