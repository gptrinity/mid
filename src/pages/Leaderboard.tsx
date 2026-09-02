import { Trophy, Medal } from 'lucide-react'

const mockLeaderboard = [
  { rank: 1, name: 'Chioma A.', score: 95, level: 300 },
  { rank: 2, name: 'Amina B.', score: 92, level: 400 },
  { rank: 3, name: 'Fatima C.', score: 89, level: 200 },
  { rank: 4, name: 'Grace D.', score: 87, level: 300 },
  { rank: 5, name: 'Hauwa E.', score: 85, level: 400 },
  { rank: 6, name: 'Ife F.', score: 83, level: 200 },
  { rank: 7, name: 'Juliana G.', score: 80, level: 300 },
  { rank: 8, name: 'Kemi H.', score: 78, level: 400 },
  { rank: 9, name: 'Lara I.', score: 76, level: 200 },
  { rank: 10, name: 'Maryam J.', score: 74, level: 300 },
]

const medalColors = ['bg-yellow-100 text-yellow-700', 'bg-gray-100 text-gray-600', 'bg-orange-100 text-orange-700']

export default function Leaderboard() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-amber-500" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-500 text-sm">Top performers this month</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {mockLeaderboard.map((entry, idx) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 px-6 py-4 ${idx > 0 ? 'border-t' : ''}`}
          >
            <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              idx < 3 ? medalColors[idx] : 'bg-gray-50 text-gray-500'
            }`}>
              {idx < 3 ? <Medal size={18} /> : entry.rank}
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{entry.name}</p>
              <p className="text-sm text-gray-500">Level {entry.level}</p>
            </div>
            <span className="text-lg font-bold text-emerald-600">{entry.score}%</span>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <p className="text-sm text-amber-700">Complete practice and exam questions to appear on the leaderboard!</p>
      </div>
    </div>
  )
}
