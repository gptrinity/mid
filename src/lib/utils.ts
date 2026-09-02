import type { Question } from '../types'

export function shuffleOptions(q: Question): { options: string[]; correct: number } {
  const indexed = q.options.map((opt, i) => ({ opt, isCorrect: i === q.correct }))
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indexed[i], indexed[j]] = [indexed[j], indexed[i]]
  }
  return {
    options: indexed.map(x => x.opt),
    correct: indexed.findIndex(x => x.isCorrect),
  }
}
