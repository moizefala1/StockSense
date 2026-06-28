"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { KnowledgeOnboarding } from "@/components/tutorial/knowledge-onboarding"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import { useTutorialPageTransition } from "@/components/tutorial/tutorial-page-transition"
import { useTutorialProfile } from "@/hooks/use-tutorial-profile"
import { homeAnalysisEntrySteps, type KnowledgeProfile } from "@/lib/tutorial"

export function HomeOnboarding() {
  const router = useRouter()
  const { status, profile, saveProfile } = useTutorialProfile()
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false)
  const [isAnalysisEntryOpen, setIsAnalysisEntryOpen] = useState(false)
  const { isTransitionSettling, startTransition } = useTutorialPageTransition()

  const handleComplete = (nextProfile: KnowledgeProfile) => {
    saveProfile(nextProfile)
    setIsKnowledgeOpen(false)

    if (nextProfile.level === "bajo") {
      const href = "/como-funciona?tutorial=basics"
      startTransition({
        href,
        onNavigate: () => router.push(href),
      })
      return
    }

    setIsAnalysisEntryOpen(true)
    router.push("/?tutorial=analysis-entry")
  }

  useEffect(() => {
    if (status !== "ready" || profile || isKnowledgeOpen) return

    let hasTriggered = false

    const openTutorial = () => {
      if (hasTriggered) return
      hasTriggered = true
      setIsKnowledgeOpen(true)
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest("a, button")) return

      event.preventDefault()
      openTutorial()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        return
      }

      openTutorial()
    }

    window.addEventListener("wheel", openTutorial, { passive: true })
    window.addEventListener("scroll", openTutorial, { passive: true })
    window.addEventListener("touchmove", openTutorial, { passive: true })
    window.addEventListener("keydown", handleKeyDown)
    document.addEventListener("click", handleClick, true)

    return () => {
      window.removeEventListener("wheel", openTutorial)
      window.removeEventListener("scroll", openTutorial)
      window.removeEventListener("touchmove", openTutorial)
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("click", handleClick, true)
    }
  }, [isKnowledgeOpen, profile, status])

  useEffect(() => {
    if (status !== "ready" || !profile) return

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      if (params.get("tutorial") === "analysis-entry") {
        setIsAnalysisEntryOpen(true)
      }
    }, 0)

    return () => window.clearTimeout(timer)
  }, [profile, status])

  return (
    <>
      {status === "ready" && profile && isAnalysisEntryOpen && !isTransitionSettling && (
        <TutorialOverlay
          isOpen
          level={profile.level}
          steps={homeAnalysisEntrySteps}
          onClose={() => {
            setIsAnalysisEntryOpen(false)
            router.replace("/")
          }}
          onFinish={() => {
            const href = "/analizar?tutorial=analysis"
            startTransition({
              href,
              beforeNavigate: () => setIsAnalysisEntryOpen(false),
              onNavigate: () => router.push(href),
            })
          }}
        />
      )}

      {status === "ready" && !profile && isKnowledgeOpen && (
        <KnowledgeOnboarding onComplete={handleComplete} />
      )}
    </>
  )
}
