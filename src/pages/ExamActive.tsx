import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Question } from '../types'

interface ExamData {
  subject: string
  questions: Question[]
  timeLimit: number
  startTime: number
}

export default function ExamActive() {
  const navigate = useNavigate()
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem('currentExam')
    if (!data) {
      navigate('/subjects')
      return
    }
    const parsed = JSON.parse(data) as ExamData
    setExamData(parsed)
    setAnswers(new Array(parsed.questions.length).fill(null))
    const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000)
    setTimeLeft(Math.max(0, parsed.timeLimit * 60 - elapsed))
  }, [navigate])

  useEffect(() => {
    if (timeLeft <= 0 && examData && !submitted) {
      handleSubmit()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [examData, submitted])

  const handleSubmit = useCallback(() => {
    if (submitted || !examData) return
    setSubmitted(true)
    let score = 0
    answers.forEach((ans, idx) => {
      if (ans === examData.questions[idx].correct) score++
    })
    const elapsed = Math.floor((Date.now() - examData.startTime) / 1000)
    navigate(`/exam-result?subject=${examData.subject}&score=${score}&total=${examData.questions.length}&time=${elapsed}&mode=exam`)
  }, [submitted, examData, answers, navigate])

  const handleAnswer = (idx: number) => {
    if (submitted) return
    const newAnswers = [...answers]
    newAnswers[currentIdx] = idx
    setAnswers(newAnswers)
  }

  if (!examData) return null

  const question = examData.questions[currentIdx]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const answeredCount = answers.filter(a => a !== null).length
  const isLowTime = timeLeft < 300

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 animate-fade-in">
      <div className="sticky top-16 sm:top-20 z-30 mb-6">
        <div className="glass-strong rounded-2xl border border-emerald-100/50 shadow-card p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                {currentIdx + 1}/{examData.questions.length}
              </span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${((currentIdx + 1) / examData.questions.length) * 100}%` }} />
              </div>
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{answeredCount} answered</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold transition-all ${
              isLowTime ? 'bg-red-50 text-red-600 animate-pulse-soft' : 'bg-gray-50 text-gray-700'
            }`}>
              <Clock size={14} />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      <div className="card-modern p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{question.difficulty}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">Level {question.level}</span>
        </div>
        <p className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">{question.question}</p>
        <div className="mt-6 space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                answers[currentIdx] === idx
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                  answers[currentIdx] === idx ? 'bg-emerald-500 text-white scale-110' : 'bg-gray-100 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm text-gray-700 font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={16} /> <span className="hidden sm:inline">Prev</span>
        </button>

        <button
          onClick={() => setShowNav(!showNav)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all sm:hidden"
        >
          {showNav ? 'Hide' : 'Navigate'}
        </button>

        {currentIdx === examData.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="btn-primary flex items-center gap-2"
          >
            Submit Exam
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx(i => Math.min(examData.questions.length - 1, i + 1))}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all"
          >
            <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
          </button>
        )}
      </div>

      {(showNav || typeof window !== 'undefined') && (
        <div className={`${showNav ? 'fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 p-4 shadow-elevated animate-slide-up sm:relative sm:inset-auto sm:z-auto sm:bg-transparent sm:border-0 sm:p-0 sm:shadow-none sm:mt-4' : 'hidden sm:block sm:mt-4'}`}>
          <div className="flex gap-1.5 flex-wrap justify-center max-w-md mx-auto">
            {examData.questions.map((q, idx) => {
              const isCorrect = submitted && answers[idx] === q.correct
              const isWrong = submitted && answers[idx] !== null && answers[idx] !== q.correct
              return (
                <button
                  key={idx}
                  onClick={() => { setCurrentIdx(idx); setShowNav(false) }}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                    idx === currentIdx
                      ? 'bg-emerald-600 text-white shadow-soft scale-110'
                      : isCorrect
                      ? 'bg-emerald-100 text-emerald-700'
                      : isWrong
                      ? 'bg-red-100 text-red-600'
                      : answers[idx] !== null
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
