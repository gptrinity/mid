import { useState, useEffect, useCallback } from 'react'
import type { StudiedTopics } from '../types'

const STORAGE_KEY = 'midwise_studied_topics'

function loadProgress(): StudiedTopics {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(data: StudiedTopics) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useStudyProgress() {
  const [progress, setProgress] = useState<StudiedTopics>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const toggleTopic = useCallback((subjectId: string, topic: string) => {
    setProgress(prev => {
      const current = prev[subjectId] || []
      const exists = current.includes(topic)
      const updated = exists ? current.filter(t => t !== topic) : [...current, topic]
      return { ...prev, [subjectId]: updated }
    })
  }, [])

  const isTopicStudied = useCallback((subjectId: string, topic: string): boolean => {
    return (progress[subjectId] || []).includes(topic)
  }, [progress])

  const getStudiedCount = useCallback((subjectId: string): number => {
    return (progress[subjectId] || []).length
  }, [progress])

  const getStudiedTopics = useCallback((subjectId: string): string[] => {
    return progress[subjectId] || []
  }, [progress])

  const getAllProgress = useCallback((): StudiedTopics => {
    return progress
  }, [progress])

  const getTotalStudied = useCallback((): number => {
    return Object.values(progress).reduce((sum, topics) => sum + topics.length, 0)
  }, [progress])

  return { toggleTopic, isTopicStudied, getStudiedCount, getStudiedTopics, getAllProgress, getTotalStudied }
}
