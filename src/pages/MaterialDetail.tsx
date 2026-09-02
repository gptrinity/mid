import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, BookMarked, CheckCircle, Circle, FileText, Download } from 'lucide-react'
import { getSubjectById } from '../data'
import { useStudyProgress } from '../hooks/useStudyProgress'

export default function MaterialDetail() {
  const { subjectId } = useParams()
  const subject = getSubjectById(subjectId || '')
  const { isTopicStudied, toggleTopic, getStudiedCount } = useStudyProgress()

  if (!subject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <p className="text-gray-500 text-lg">Subject not found.</p>
        <Link to="/materials" className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors inline-block">Back to Materials</Link>
      </div>
    )
  }

  const studiedCount = getStudiedCount(subject.id)
  const totalTopics = subject.topics.length
  const progressPct = totalTopics > 0 ? Math.round((studiedCount / totalTopics) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      <Link to="/materials" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium mb-6">
        <ChevronLeft size={16} /> Back to Materials
      </Link>

      <div className="card-modern p-5 sm:p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            {subject.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{subject.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{subject.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">{subject.level} Level</span>
              <span className="text-xs font-medium text-gray-400">{totalTopics} topics</span>
              <span className="text-xs font-bold text-emerald-600">{studiedCount}/{totalTopics} studied</span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 font-medium">
            <span>Study Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BookMarked size={18} className="text-emerald-500" />
          Topics & Chapters
        </h2>
        <p className="text-sm text-gray-500 mt-1">Check off topics as you study them. Your progress is saved automatically.</p>
      </div>

      <div className="space-y-3">
        {subject.topics.map((topic, i) => {
          const studied = isTopicStudied(subject.id, topic)
          return (
            <div
              key={i}
              className={`card-modern p-4 flex items-center gap-4 transition-all duration-300 ${
                studied ? 'border-emerald-200 bg-emerald-50/30' : ''
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <button
                onClick={() => toggleTopic(subject.id, topic)}
                className="flex-shrink-0 transition-all duration-200"
              >
                {studied ? (
                  <CheckCircle size={24} className="text-emerald-500" />
                ) : (
                  <Circle size={24} className="text-gray-300 hover:text-emerald-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${studied ? 'text-emerald-700' : 'text-gray-900'}`}>{topic}</p>
                <p className="text-xs text-gray-400 mt-0.5">Chapter {i + 1} of {totalTopics}</p>
              </div>

              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">
                <FileText size={12} />
                Notes
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-8 card-modern p-5 border border-blue-100 bg-blue-50/30">
        <div className="flex items-start gap-3">
          <Download className="text-blue-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Download PDF Notes</h3>
            <p className="text-xs text-gray-500 mt-1">PDF study materials for this subject will be available here soon. Check back later for downloadable notes, flashcards, and revision guides.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
