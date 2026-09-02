export type Subject =
  | 'history-midwifery'
  | 'introduction-psychology'
  | 'introduction-sociology'
  | 'fundamentals-nursing'
  | 'communication-skills'
  | 'human-anatomy'
  | 'human-physiology'
  | 'health-assessment'
  | 'microbiology'
  | 'pharmacology'
  | 'nutrition'
  | 'normal-pregnancy'
  | 'normal-labour'
  | 'normal-puerperium'
  | 'breastfeeding'
  | 'complicated-midwifery-1'
  | 'complicated-midwifery-2'
  | 'obstetric-emergencies'
  | 'neonatal-care'
  | 'family-planning'
  | 'community-midwifery'
  | 'public-health'
  | 'gynecology'
  | 'mental-health'
  | 'research-methods'
  | 'ethics-law'
  | 'leadership'
  | 'safe-motherhood'
  | 'perioperative'
  | 'male-reproductive'

export type Level = 100 | 200 | 300 | 400 | 'professional'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

export interface Question {
  id: string
  subject: Subject
  topic: string
  level: Level
  difficulty: Difficulty
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface SubjectInfo {
  id: Subject
  name: string
  description: string
  icon: string
  level: Level
  questionCount: number
  topics: string[]
}

export interface ExamResult {
  id: string
  userId: string
  subject: Subject
  score: number
  total: number
  percentage: number
  grade: Grade
  timeTaken: number
  answers: number[]
  completedAt: string
}

export interface UserProgress {
  userId: string
  subject: Subject
  questionsAttempted: number
  correctAnswers: number
  lastPracticed: string
}

export interface UserProfile {
  id: string
  email: string
  fullName: string
  createdAt: string
  totalExams: number
  averageScore: number
  streak: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
