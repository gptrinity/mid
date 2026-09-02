import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { subjects } from '../data/subjects'
import { getQuestionsBySubject, allQuestions } from '../data'
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Start Exam</h1>
      <p className="text-gray-600 mb-8">Configure your exam settings</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select a subject</option>
            <option value="all">All Subjects (Mixed)</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.name} ({s.questionCount} Q)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
          <div className="flex gap-3">
            {[15, 30, 60, 90].map(count => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex-1 py-2.5 rounded-lg border-2 font-medium transition-colors ${
                  questionCount === count ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
          <div className="flex gap-3">
            {[15, 30, 60, 90].map(time => (
              <button
                key={time}
                onClick={() => setTimeLimit(time)}
                className={`flex-1 py-2.5 rounded-lg border-2 font-medium transition-colors ${
                  timeLimit === time ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {time} min
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedSubject}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Exam
        </button>
      </div>
    </div>
  )
}
