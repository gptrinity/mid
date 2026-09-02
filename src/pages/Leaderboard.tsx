import { Trophy, Medal, Crown, Award, TrendingUp } from 'lucide-react'

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

export default function Leaderboard() {
  const top3 = mockLeaderboard.slice(0, 3)
  const rest = mockLeaderboard.slice(3)

  const podiumOrder = [top3[1], top3[0], top3[2]]
  const podiumHeights = ['h-24', 'h-36', 'h-20']

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 gradient-amber rounded-xl flex items-center justify-center shadow-soft">
          <Trophy className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Leaderboard</h1>
          <p className="text-sm text-gray-500">Top performers this month</p>
        </div>
      </div>

      <div className="card-modern p-6 mb-8">
        <div className="flex items-end justify-center gap-3 sm:gap-4 mb-6">
          {podiumOrder.map((entry, displayIdx) => {
            const rank = displayIdx === 0 ? 2 : displayIdx === 1 ? 1 : 3
            return (
              <div key={entry.rank} className="flex flex-col items-center animate-slide-up" style={{ animationDelay: `${displayIdx * 100}ms` }}>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-2 ${
                  rank === 1 ? 'bg-amber-100 ring-3 ring-amber-300 shadow-glow-green' : rank === 2 ? 'bg-gray-100 ring-2 ring-gray-300' : 'bg-orange-50 ring-2 ring-orange-200'
                }`}>
                  {rank === 1 ? <Crown className="text-amber-500" size={22} /> : <Medal className={rank === 2 ? 'text-gray-400' : 'text-orange-400'} size={20} />}
                </div>
                <p className="text-sm font-bold text-gray-900 text-center">{entry.name}</p>
                <p className="text-xs text-gray-500 mb-2 font-medium">{entry.score}%</p>
                <div className={`${
                  rank === 1 ? 'bg-gradient-to-t from-amber-100 to-amber-50 border-amber-200' : rank === 2 ? 'bg-gradient-to-t from-gray-100 to-gray-50 border-gray-200' : 'bg-gradient-to-t from-orange-50 to-orange-25 border-orange-200'
                } border rounded-t-xl w-20 sm:w-24 ${podiumHeights[displayIdx]} flex items-center justify-center`}>
                  <span className={`text-2xl font-extrabold ${rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-gray-400' : 'text-orange-300'}`}>#{rank}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card-modern overflow-hidden">
        {rest.map((entry, idx) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 px-5 py-3.5 ${idx > 0 ? 'border-t border-gray-100' : ''} hover:bg-emerald-50/50 transition-colors group`}
          >
            <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-emerald-600 transition-colors">
              {entry.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{entry.name}</p>
              <p className="text-xs text-gray-500">Level {entry.level}</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp size={12} />
              <span className="text-sm font-bold">{entry.score}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl p-5 text-center">
        <Award className="text-emerald-600 mx-auto mb-2" size={24} />
        <p className="text-sm font-semibold text-emerald-700">Complete practice and exam questions to appear on the leaderboard!</p>
      </div>
    </div>
  )
}
