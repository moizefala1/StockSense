"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { KnowledgeOnboarding } from "@/components/tutorial/knowledge-onboarding"
import { useTutorialProfile } from "@/hooks/use-tutorial-profile"
import type { KnowledgeProfile } from "@/lib/tutorial"

export function HomeOnboarding() {
  const router = useRouter()
  const { status, profile, saveProfile } = useTutorialProfile()
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false)

  const handleComplete = (nextProfile: KnowledgeProfile) => {
    saveProfile(nextProfile)
    setIsKnowledgeOpen(false)
    router.push(
      nextProfile.level === "bajo"
        ? "/como-funciona?tutorial=basics"
        : "/analizar?tutorial=analysis"
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

  if (status === "ready" && !profile && isKnowledgeOpen) {
    return <KnowledgeOnboarding onComplete={handleComplete} />
  }

  return null
}
