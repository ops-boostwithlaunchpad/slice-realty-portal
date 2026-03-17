'use client'

import { useState, useCallback } from 'react'
import { QuizQuestion } from '@/lib/types'
import { DUMMY_QUIZ_QUESTIONS } from '@/lib/dummy'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadQuestions = useCallback(() => {
    setLoading(true)
    const shuffled = shuffleArray(DUMMY_QUIZ_QUESTIONS).slice(0, 10)
    setQuestions(shuffled)
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
    setLoading(false)
  }, [])

  // Load on mount
  if (loading && questions.length === 0) {
    loadQuestions()
  }

  const handleSelect = (index: number) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    if (index === questions[current].correct_index) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const getOptionStyle = (index: number) => {
    const q = questions[current]
    if (!answered) {
      return {
        border: '1.5px solid #E5E7EB',
        backgroundColor: '#fff',
        color: '#374151',
      }
    }
    if (index === q.correct_index) {
      return {
        border: '1.5px solid #16A34A',
        backgroundColor: '#F0FDF4',
        color: '#15803D',
      }
    }
    if (index === selected && index !== q.correct_index) {
      return {
        border: '1.5px solid #DC2626',
        backgroundColor: '#FEF2F2',
        color: '#DC2626',
      }
    }
    return {
      border: '1.5px solid #E5E7EB',
      backgroundColor: '#FAFAFA',
      color: '#9CA3AF',
    }
  }

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: '#16A34A' }
    if (percentage >= 75) return { label: 'Good Job!', color: '#2563EB' }
    if (percentage >= 60) return { label: 'Keep Studying', color: '#D97706' }
    return { label: 'Needs Work', color: '#DC2626' }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="bg-white rounded-2xl border border-gray-100 h-96 animate-pulse" />
      </div>
    )
  }

  if (finished) {
    const grade = getGrade()
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <h1
          className="text-3xl font-bold text-gray-900 mb-7"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          FL License Quiz
        </h1>
        <div
          className="bg-white rounded-2xl border border-gray-100 p-8 text-center"
          style={{
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
            borderTop: '3px solid #C41E2A',
          }}
        >
          <h2
            className="text-4xl font-bold mb-1"
            style={{ color: grade.color, fontFamily: 'var(--font-dm-serif)' }}
          >
            {grade.label}
          </h2>
          <p className="text-gray-500 mb-8 text-sm">Quiz complete</p>

          <div className="flex items-center justify-center gap-10 mb-8">
            <div>
              <p className="text-5xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-dm-serif)' }}>{score}/{questions.length}</p>
              <p className="text-sm text-gray-500 mt-1">Questions Correct</p>
            </div>
            <div
              className="w-px h-14"
              style={{ backgroundColor: '#E5E7EB' }}
            />
            <div>
              <p className="text-5xl font-bold" style={{ color: grade.color, fontFamily: 'var(--font-dm-serif)' }}>
                {percentage}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Score</p>
            </div>
          </div>

          {/* Score bar */}
          <div className="w-full bg-gray-100 rounded-full h-3 mb-8">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%`, backgroundColor: grade.color }}
            />
          </div>

          <p className="text-sm text-gray-600 mb-7">
            {percentage >= 75
              ? 'Great work! You are well prepared for the Florida real estate license exam.'
              : 'Keep studying! Focus on the areas where you missed questions.'}
          </p>

          <button
            onClick={loadQuestions}
            className="px-7 py-3 rounded-xl font-semibold text-white mx-auto hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#C41E2A' }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const progress = ((current + 1) / questions.length) * 100

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          FL License Quiz
        </h1>
        {q.category && (
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
            style={{ backgroundColor: '#FFF0F0', color: '#C41E2A' }}
          >
            {q.category}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {current + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {score} correct
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: '#C41E2A' }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        className="bg-white rounded-2xl border border-gray-100 p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <p className="text-base font-semibold text-gray-900 mb-6 leading-relaxed">
          {q.question}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2.5 mb-5">
          {q.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={answered}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all"
              style={getOptionStyle(index)}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  backgroundColor: answered
                    ? index === q.correct_index
                      ? '#DCFCE7'
                      : index === selected && index !== q.correct_index
                      ? '#FEE2E2'
                      : '#F3F4F6'
                    : '#F3F4F6',
                  color: answered
                    ? index === q.correct_index
                      ? '#16A34A'
                      : index === selected && index !== q.correct_index
                      ? '#DC2626'
                      : '#9CA3AF'
                    : '#6B7280',
                }}
              >
                {OPTION_LABELS[index]}
              </span>
              <span className="flex-1">{option}</span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {answered && (
          <div
            className="rounded-xl p-4 mb-4"
            style={{
              backgroundColor: selected === q.correct_index ? '#F0FDF4' : '#FEF2F2',
              borderLeft: `3px solid ${selected === q.correct_index ? '#16A34A' : '#DC2626'}`,
            }}
          >
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: selected === q.correct_index ? '#15803D' : '#DC2626' }}
            >
              {selected === q.correct_index ? 'Correct!' : 'Incorrect'}
            </p>
            {q.explanation && (
              <p className="text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
            )}
          </div>
        )}

        {/* Next button */}
        {answered && (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#C41E2A' }}
          >
            {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}
