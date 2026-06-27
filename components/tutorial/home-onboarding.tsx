"use client"

import { useEffect, useState } from "react"
import { KnowledgeOnboarding } from "@/components/tutorial/knowledge-onboarding"
import {
  KNOWLEDGE_PROFILE_STORAGE_KEY,
  TUTORIAL_COMPLETED_STORAGE_KEY,
  clearTutorialCookies,
  readKnowledgeProfileCookie,
  saveKnowledgeProfileCookie,
  type KnowledgeProfile,
} from "@/lib/tutorial"

type HomeOnboardingState = "checking" | "show" | "hidden"

export function HomeOnboarding() {
  const [state, setState] = useState<HomeOnboardingState>("checking")

  useEffect(() => {
    window.localStorage.removeItem(KNOWLEDGE_PROFILE_STORAGE_KEY)
    window.localStorage.removeItem(TUTORIAL_COMPLETED_STORAGE_KEY)

    const timer = window.setTimeout(() => {
      setState(readKnowledgeProfileCookie() ? "hidden" : "show")
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const handleComplete = (profile: KnowledgeProfile) => {
    clearTutorialCookies()
    saveKnowledgeProfileCookie(profile)
    setState("hidden")
  }

  if (state !== "show") return null

  return <KnowledgeOnboarding onComplete={handleComplete} />
}
