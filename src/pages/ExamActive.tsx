import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { shuffleOptions } from '../lib/utils'
import type { Question } from '../types'

interface ExamData {
  subject: string
  questions: Question[]
  timeLimit: number
  startTime: number
}

interface ShuffledQuestion extends Question {
  shuffledOptions: string[]
  shuffledCorrect: number
}

export default function ExamActive() {
  const navigate = useNavigate()
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([])
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
    const shuffled = parsed.questions.map(q => {
      const { options, correct } = shuffleOptions(q)
      return { ...q, shuffledOptions: options, shuffledCorrect: correct }
    })
    setShuffledQuestions(shuffled)
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
      if (ans === shuffledQuestions[idx].shuffledCorrect) score++
    })
    const elapsed = Math.floor((Date.now() - examData.startTime) / 1000)
    navigate(`/exam-result?subject=${examData.subject}&score=${score}&total=${examData.questions.length}&time=${elapsed}&mode=exam`)
  }, [submitted, examData, answers, shuffledQuestions, navigate])

  const handleAnswer = (idx: number) => {
    if (submitted) return
    const newAnswers = [...answers]
    newAnswers[currentIdx] = idx
    setAnswers(newAnswers)
  }

  if (!examData || shuffledQuestions.length === 0) return null

  const question = shuffledQuestions[currentIdx]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const totalSeconds = examData.timeLimit * 60
  const timerProgress = ((totalSeconds - timeLeft) / totalSeconds) * 100
  const answeredCount = answers.filter(a => a !== null).length
  const isLowTime = timeLeft < 300
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (timerProgress / 100) * circumference

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 animate-fade-in">
      <div className="sticky top-16 sm:top-20 z-30 mb-6">
        <div className="glass-strong rounded-2xl border border-sky-100/50 shadow-card p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                {currentIdx + 1}/{shuffledQuestions.length}
              </span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${((currentIdx + 1) / shuffledQuestions.length) * 100}%` }} />
              </div>
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{answeredCount} answered</span>
            </div>
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold transition-all ${
              isLowTime ? 'bg-red-50 text-red-600 animate-pulse-soft' : 'bg-gray-50 text-gray-700'
            }`}>
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r={radius} fill="none" stroke={isLowTime ? '#fecaca' : '#e5e7eb'} strokeWidth="3" />
                  <circle cx="20" cy="20" r={radius} fill="none" stroke={isLowTime ? '#ef4444' : '#10b981'} strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" />
                </svg>
                <span className={`text-[10px] font-bold ${isLowTime ? 'text-red-500' : 'text-sky-600'}`}>
                  {Math.ceil(timeLeft / 60)}
                </span>
              </div>
              <span className={`text-sm font-mono font-bold ${isLowTime ? 'text-red-600' : 'text-gray-700'}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-modern p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{question.difficulty}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full">Level {question.level}</span>
        </div>
        <p className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">{question.question}</p>
        <div className="mt-6 space-y-3">
          {question.shuffledOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                answers[currentIdx] === idx
                  ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                  answers[currentIdx] === idx ? 'bg-sky-500 text-white scale-110' : 'bg-gray-100 text-gray-500'
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

        {currentIdx === shuffledQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="btn-primary flex items-center gap-2"
          >
            Submit Exam
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx(i => Math.min(shuffledQuestions.length - 1, i + 1))}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all"
          >
            <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
          </button>
        )}
      </div>

      {(showNav || typeof window !== 'undefined') && (
        <div className={`${showNav ? 'fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 p-4 shadow-elevated animate-slide-up sm:relative sm:inset-auto sm:z-auto sm:bg-transparent sm:border-0 sm:p-0 sm:shadow-none sm:mt-4' : 'hidden sm:block sm:mt-4'}`}>
          <div className="flex gap-1.5 flex-wrap justify-center max-w-md mx-auto">
            {shuffledQuestions.map((q, idx) => {
              const isCorrect = submitted && answers[idx] === q.shuffledCorrect
              const isWrong = submitted && answers[idx] !== null && answers[idx] !== q.shuffledCorrect
              return (
                <button
                  key={idx}
                  onClick={() => { setCurrentIdx(idx); setShowNav(false) }}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                    idx === currentIdx
                      ? 'bg-sky-600 text-white shadow-soft scale-110'
                      : isCorrect
                      ? 'bg-sky-100 text-sky-700'
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
