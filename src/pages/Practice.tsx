import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, ArrowRight, ChevronLeft, BookOpen } from 'lucide-react'
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-soft">
            <BookOpen className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Practice Mode</h1>
            <p className="text-sm text-gray-500">Select a subject to begin practicing</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
          {subjects.map(subject => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className="card-modern p-4 text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300">{subject.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">{subject.name}</p>
                  <p className="text-xs text-gray-500">{subject.questionCount} questions</p>
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <p className="text-gray-500 text-lg">No questions found for this subject.</p>
        <button onClick={() => setSelectedSubject('')} className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">Choose another subject</button>
      </div>
    )
  }

  const progress = ((currentIdx + 1) / questions.length) * 100

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setSelectedSubject('')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="text-right">
          <p className="text-sm font-bold text-emerald-600">{score}/{answered} correct</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-medium">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="card-modern p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{currentQuestion.difficulty}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">Level {currentQuestion.level}</span>
        </div>
        <p className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">{currentQuestion.question}</p>

        <div className="mt-6 space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let style = 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
            if (showResult) {
              if (idx === currentQuestion.correct) {
                style = 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100'
              } else if (idx === selectedAnswer && idx !== currentQuestion.correct) {
                style = 'border-red-400 bg-red-50 ring-2 ring-red-100'
              } else {
                style = 'border-gray-200 opacity-40'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                    showResult && idx === currentQuestion.correct
                      ? 'bg-emerald-500 text-white scale-110'
                      : showResult && idx === selectedAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {showResult && idx === currentQuestion.correct ? (
                      <CheckCircle size={16} />
                    ) : showResult && idx === selectedAnswer ? (
                      <XCircle size={16} />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </span>
                  <span className="text-sm text-gray-700 font-medium">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className={`mt-6 p-4 rounded-xl animate-slide-up ${
            selectedAnswer === currentQuestion.correct
              ? 'bg-emerald-50 border border-emerald-200'
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <p className={`font-bold text-sm mb-1 ${selectedAnswer === currentQuestion.correct ? 'text-emerald-700' : 'text-amber-700'}`}>
              {selectedAnswer === currentQuestion.correct ? 'Correct!' : 'Incorrect'}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {showResult && (
        <div className="flex justify-center animate-scale-in">
          {currentIdx < questions.length - 1 ? (
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              Next Question <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleFinish} className="btn-primary">
              View Results
            </button>
          )}
        </div>
      )}
    </div>
  )
}
