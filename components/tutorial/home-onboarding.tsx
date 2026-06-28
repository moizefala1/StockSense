"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { KnowledgeOnboarding } from "@/components/tutorial/knowledge-onboarding"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import { useTutorialProfile } from "@/hooks/use-tutorial-profile"
import { homeAnalysisEntrySteps, type KnowledgeProfile } from "@/lib/tutorial"

export function HomeOnboarding() {
  const router = useRouter()
  const { status, profile, saveProfile } = useTutorialProfile()
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false)
  const [isAnalysisEntryOpen, setIsAnalysisEntryOpen] = useState(false)

  const handleComplete = (nextProfile: KnowledgeProfile) => {
    saveProfile(nextProfile)
    setIsKnowledgeOpen(false)
    router.push(
      nextProfile.level === "bajo"
        ? "/como-funciona?tutorial=basics"
        : "/?tutorial=analysis-entry"
    )
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

    const params = new URLSearchParams(window.location.search)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAnalysisEntryOpen(params.get("tutorial") === "analysis-entry")
  }, [profile, status])

  if (status === "ready" && profile && isAnalysisEntryOpen) {
    return (
      <TutorialOverlay
        isOpen
        level={profile.level}
        steps={homeAnalysisEntrySteps}
        onFinish={() => {
          setIsAnalysisEntryOpen(false)
          router.push("/analizar?tutorial=analysis")
        }}
      />
    )
  }

  if (status === "ready" && !profile && isKnowledgeOpen) {
    return <KnowledgeOnboarding onComplete={handleComplete} />
  }

  return null
}
