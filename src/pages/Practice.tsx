import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { subjects } from '../data/subjects'
import { getQuestionsBySubject } from '../data'
import type { Question } from '../types'

export default function Practice() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [selectedSubject, setSelectedSubject] = useState<string>(subjectId || '')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)

  useEffect(() => {
    if (selectedSubject) {
      const qs = getQuestionsBySubject(selectedSubject)
      setQuestions(qs.sort(() => Math.random() - 0.5))
      setCurrentIdx(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setScore(0)
      setAnswered(0)
    }
  }, [selectedSubject])

  const currentQuestion = questions[currentIdx]

  const handleAnswer = (idx: number) => {
    if (showResult) return
    setSelectedAnswer(idx)
    setShowResult(true)
    setAnswered(a => a + 1)
    if (idx === currentQuestion.correct) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleFinish = () => {
    navigate(`/exam-result?subject=${selectedSubject}&score=${score}&total=${answered}&mode=practice`)
  }

  if (!selectedSubject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Select a Subject to Practice</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map(subject => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className="bg-white rounded-xl border border-gray-100 p-4 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{subject.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{subject.name}</p>
                  <p className="text-sm text-gray-500">{subject.questionCount} questions</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">No questions found for this subject.</p>
        <button onClick={() => setSelectedSubject('')} className="mt-4 text-emerald-600 hover:text-emerald-700">Choose another subject</button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Question {currentIdx + 1} of {questions.length}</p>
          <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
            <div className="h-2 bg-emerald-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-lg font-bold text-emerald-600">{score}/{answered}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{currentQuestion.difficulty}</span>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">Level {currentQuestion.level}</span>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-6">{currentQuestion.question}</p>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let style = 'border-gray-200 hover:border-emerald-300'
            if (showResult) {
              if (idx === currentQuestion.correct) {
                style = 'border-green-500 bg-green-50'
              } else if (idx === selectedAnswer && idx !== currentQuestion.correct) {
                style = 'border-red-500 bg-red-50'
              } else {
                style = 'border-gray-200 opacity-50'
              }
            } else if (idx === selectedAnswer) {
              style = 'border-emerald-500 bg-emerald-50'
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {showResult && idx === currentQuestion.correct ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : showResult && idx === selectedAnswer ? (
                      <XCircle className="text-red-500" size={20} />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </span>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className={`mt-6 p-4 rounded-xl ${selectedAnswer === currentQuestion.correct ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <p className="font-medium text-gray-900 mb-1">
              {selectedAnswer === currentQuestion.correct ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {showResult && (
        <div className="flex justify-center">
          {currentIdx < questions.length - 1 ? (
            <button onClick={handleNext} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 flex items-center gap-2">
              Next Question <ArrowRight size={18} />
            </button>
          ) : (
            <button onClick={handleFinish} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700">
              View Results
            </button>
          )}
        </div>
      )}
    </div>
  )
}
