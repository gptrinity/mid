import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timer, Hash, BookOpen, Play, AlertCircle } from 'lucide-react'
import { subjects } from '../data/subjects'
import { getQuestionsBySubject, allQuestions, getQuestionCountBySubject } from '../data'
import type { Question } from '../types'

export default function ExamSelect() {
  const navigate = useNavigate()
  const [selectedSubject, setSelectedSubject] = useState('')
  const [questionCount, setQuestionCount] = useState(30)
  const [timeLimit, setTimeLimit] = useState(30)

  const handleStart = () => {
    let questions: Question[]
    if (selectedSubject === 'all') {
      questions = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, questionCount)
    } else {
      questions = getQuestionsBySubject(selectedSubject).sort(() => Math.random() - 0.5).slice(0, questionCount)
    }

    if (questions.length === 0) {
      alert('No questions available')
      return
    }

    const examData = {
      subject: selectedSubject,
      questions,
      timeLimit,
      startTime: Date.now(),
    }
    sessionStorage.setItem('currentExam', JSON.stringify(examData))
    navigate('/exam/active')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-soft">
          <BookOpen className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Start Exam</h1>
          <p className="text-sm text-gray-500">Configure your exam settings and test your knowledge</p>
        </div>
      </div>

      <div className="card-modern p-5 sm:p-6 mt-8 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <BookOpen size={14} className="text-sky-500" />
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="input-modern"
          >
            <option value="">Select a subject</option>
            <option value="all">All Subjects (Mixed)</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.name} ({getQuestionCountBySubject(s.id)} Q)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Hash size={14} className="text-blue-500" />
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 60, 90].map(count => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`py-3.5 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                  questionCount === count
                    ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-soft'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <Timer size={14} className="text-amber-500" />
            Time Limit
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 60, 90].map(time => (
              <button
                key={time}
                onClick={() => setTimeLimit(time)}
                className={`py-3.5 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                  timeLimit === time
                    ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-soft'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {time}m
              </button>
            ))}
          </div>
        </div>

        <div className="bg-sky-50 rounded-xl p-4 flex items-center justify-between text-sm border border-sky-100">
          <span className="text-sky-600 font-medium">Estimated time</span>
          <span className="font-bold text-sky-700">{timeLimit} minutes</span>
        </div>

        {!selectedSubject && (
          <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-xl border border-amber-100">
            <AlertCircle size={16} />
            <span>Please select a subject to start</span>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={!selectedSubject}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={16} />
          Start Exam
        </button>
      </div>
    </div>
  )
}
