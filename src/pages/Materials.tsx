import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, BookMarked, ChevronRight } from 'lucide-react'
import { subjects } from '../data/subjects'
import { useStudyProgress } from '../hooks/useStudyProgress'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import type { Level } from '../types'

const levels: { value: Level | 'all'; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 100, label: '100 Level' },
  { value: 200, label: '200 Level' },
  { value: 300, label: '300 Level' },
  { value: 400, label: '400 Level' },
]

const levelColors: Record<number, string> = {
  100: 'bg-emerald-500',
  200: 'bg-blue-500',
  300: 'bg-purple-500',
  400: 'bg-amber-500',
}

const levelTextColors: Record<number, string> = {
  100: 'text-emerald-600',
  200: 'text-blue-600',
  300: 'text-purple-600',
  400: 'text-amber-600',
}

const levelBgColors: Record<number, string> = {
  100: 'bg-emerald-50',
  200: 'bg-blue-50',
  300: 'bg-purple-50',
  400: 'bg-amber-50',
}

export default function Materials() {
  const [search, setSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<Level | 'all'>('all')
  const { getStudiedCount } = useStudyProgress()
  const scrollRef = useScrollAnimation()

  const filtered = useMemo(() => {
    return subjects.filter(s => {
      const matchLevel = selectedLevel === 'all' || s.level === selectedLevel
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
      return matchLevel && matchSearch
    })
  }, [search, selectedLevel])

  const groupedByLevel = useMemo(() => {
    const groups: Record<number, typeof subjects> = {}
    filtered.forEach(s => {
      const lvl = Number(s.level)
      if (!groups[lvl]) groups[lvl] = []
      groups[lvl].push(s)
    })
    return groups
  }, [filtered])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in" ref={scrollRef}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-soft">
            <BookMarked className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Study Materials</h1>
            <p className="text-sm text-gray-500">{subjects.length} subjects with topics and study notes</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subjects..."
            className="input-modern pl-10 pr-4"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {levels.map(l => (
            <button
              key={l.value}
              onClick={() => setSelectedLevel(l.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                selectedLevel === l.value
                  ? 'bg-emerald-600 text-white shadow-soft'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <Filter className="text-gray-300 mx-auto mb-3" size={40} />
          <p className="text-gray-500 text-lg font-medium">No subjects found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByLevel)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([level, subs]) => (
              <div key={level} className="scroll-reveal">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 ${levelColors[Number(level)]} rounded-lg flex items-center justify-center text-xs font-bold text-white`}>
                    {level}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{level} Level</h2>
                  <span className="text-xs text-gray-400 font-medium">({subs.length} subjects)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subs.map((subject, i) => {
                    const studied = getStudiedCount(subject.id)
                    const totalTopics = subject.topics.length
                    const progressPct = totalTopics > 0 ? Math.round((studied / totalTopics) * 100) : 0
                    return (
                      <Link
                        key={subject.id}
                        to={`/materials/${subject.id}`}
                        className="card-modern p-4 group scroll-reveal"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 ${levelBgColors[Number(level)]} rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            {subject.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">{subject.name}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{subject.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[10px] font-bold ${levelTextColors[Number(level)]} ${levelBgColors[Number(level)]} px-2 py-0.5 rounded-full`}>
                                {subject.level}L
                              </span>
                              <span className="text-[10px] font-medium text-gray-400">
                                {totalTopics} topics
                              </span>
                              {studied > 0 && (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  {studied}/{totalTopics} studied
                                </span>
                              )}
                            </div>
                            {studied > 0 && (
                              <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                              </div>
                            )}
                          </div>
                          <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-1" size={16} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
