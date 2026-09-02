import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 bg-white rounded-xl border p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            {currentIdx + 1}/{examData.questions.length}
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${((currentIdx + 1) / examData.questions.length) * 100}%` }} />
          </div>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-gray-700'}`}>
          <Clock size={20} />
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <div className="flex gap-2 mb-4">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{question.difficulty}</span>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">Level {question.level}</span>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-6">{question.question}</p>
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers[currentIdx] === idx
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  answers[currentIdx] === idx ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-gray-700">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex gap-1 flex-wrap justify-center max-w-md">
          {examData.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                idx === currentIdx
                  ? 'bg-emerald-600 text-white'
                  : answers[idx] !== null
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentIdx === examData.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx(i => Math.min(examData.questions.length - 1, i + 1))}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
