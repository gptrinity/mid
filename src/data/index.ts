import type { Question } from '../types'
import { historyMidwiferyQuestions } from './history-midwifery'
import { psychologyQuestions } from './introduction-psychology'
import { sociologyQuestions } from './introduction-sociology'
import { fundamentalsQuestions } from './fundamentals-nursing'
import { communicationQuestions } from './communication-skills'
import { anatomyQuestions } from './human-anatomy'
import { physiologyQuestions } from './human-physiology'
import { healthAssessmentQuestions } from './health-assessment'
import { microbiologyQuestions } from './microbiology'
import { pharmacologyQuestions } from './pharmacology'
import { nutritionQuestions } from './nutrition'
import { normalPregnancyQuestions } from './normal-pregnancy'
import { normalLabourQuestions } from './normal-labour'
import { normalPuerperiumQuestions } from './normal-puerperium'
import { breastfeedingQuestions } from './breastfeeding'
import { complicatedMidwifery1Questions } from './complicated-midwifery-1'
import { complicatedMidwifery2Questions } from './complicated-midwifery-2'
import { obstetricEmergenciesQuestions } from './obstetric-emergencies'
import { neonatalCareQuestions } from './neonatal-care'
import { familyPlanningQuestions } from './family-planning'
import { communityMidwiferyQuestions } from './community-midwifery'
import { publicHealthQuestions } from './public-health'
import { gynecologyQuestions } from './gynecology'
import { mentalHealthQuestions } from './mental-health'
import { researchMethodsQuestions } from './research-methods'
import { ethicsLawQuestions } from './ethics-law'
import { leadershipQuestions } from './leadership'
import { safeMotherhoodQuestions } from './safe-motherhood'
import { perioperativeQuestions } from './perioperative'
import { maleReproductiveQuestions } from './male-reproductive'
import { subjects } from './subjects'

export const allQuestions: Question[] = [
  ...historyMidwiferyQuestions,
  ...psychologyQuestions,
  ...sociologyQuestions,
  ...fundamentalsQuestions,
  ...communicationQuestions,
  ...anatomyQuestions,
  ...physiologyQuestions,
  ...healthAssessmentQuestions,
  ...microbiologyQuestions,
  ...pharmacologyQuestions,
  ...nutritionQuestions,
  ...normalPregnancyQuestions,
  ...normalLabourQuestions,
  ...normalPuerperiumQuestions,
  ...breastfeedingQuestions,
  ...complicatedMidwifery1Questions,
  ...complicatedMidwifery2Questions,
  ...obstetricEmergenciesQuestions,
  ...neonatalCareQuestions,
  ...familyPlanningQuestions,
  ...communityMidwiferyQuestions,
  ...publicHealthQuestions,
  ...gynecologyQuestions,
  ...mentalHealthQuestions,
  ...researchMethodsQuestions,
  ...ethicsLawQuestions,
  ...leadershipQuestions,
  ...safeMotherhoodQuestions,
  ...perioperativeQuestions,
  ...maleReproductiveQuestions,
]

export function getQuestionsBySubject(subjectId: string): Question[] {
  return allQuestions.filter(q => q.subject === subjectId)
}

export function getQuestionCountBySubject(subjectId: string): number {
  return allQuestions.filter(q => q.subject === subjectId).length
}

export function getSubjectById(subjectId: string) {
  return subjects.find(s => s.id === subjectId)
}

export function getQuestionsByLevel(level: number | string): Question[] {
  return allQuestions.filter(q => q.level === level)
}

export function getRandomQuestions(count: number, subjectId?: string): Question[] {
  const pool = subjectId ? getQuestionsBySubject(subjectId) : allQuestions
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
