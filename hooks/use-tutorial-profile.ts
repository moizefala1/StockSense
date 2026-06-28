"use client"

import { useCallback, useEffect, useState } from "react"
import {
  KNOWLEDGE_PROFILE_STORAGE_KEY,
  TUTORIAL_COMPLETED_STORAGE_KEY,
  clearTutorialCompletedCookie,
  clearTutorialCookies,
  readKnowledgeProfileCookie,
  readTutorialCompletedCookie,
  saveKnowledgeProfileCookie,
  saveTutorialCompletedCookie,
  type KnowledgeProfile,
} from "@/lib/tutorial"

type TutorialProfileStatus = "checking" | "ready"

export function useTutorialProfile() {
  const [status, setStatus] = useState<TutorialProfileStatus>("checking")
  const [profile, setProfile] = useState<KnowledgeProfile | null>(null)
  const [isTutorialCompleted, setIsTutorialCompleted] = useState(false)

  useEffect(() => {
    window.localStorage.removeItem(KNOWLEDGE_PROFILE_STORAGE_KEY)
    window.localStorage.removeItem(TUTORIAL_COMPLETED_STORAGE_KEY)

    const timer = window.setTimeout(() => {
      setProfile(readKnowledgeProfileCookie())
      setIsTutorialCompleted(readTutorialCompletedCookie())
      setStatus("ready")
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const saveProfile = useCallback((nextProfile: KnowledgeProfile) => {
    clearTutorialCookies()
    saveKnowledgeProfileCookie(nextProfile)
    setProfile(nextProfile)
    setIsTutorialCompleted(false)
  }, [])

  const completeTutorial = useCallback(() => {
    saveTutorialCompletedCookie()
    setIsTutorialCompleted(true)
  }, [])

  const restartTutorial = useCallback(() => {
    clearTutorialCompletedCookie()
    setIsTutorialCompleted(false)
  }, [])

  return {
    status,
    profile,
    isTutorialCompleted,
    saveProfile,
    completeTutorial,
    restartTutorial,
  }
}
