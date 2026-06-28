"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import { useTutorialPageTransition } from "@/components/tutorial/tutorial-page-transition"
import { investmentBasicsTutorialSteps } from "@/lib/tutorial"

export function InvestmentBasicsTutorial() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { isTransitionSettling, startTransition } = useTutorialPageTransition()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      setIsOpen(params.get("tutorial") === "basics")
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <TutorialOverlay
      isOpen={isOpen && !isTransitionSettling}
      level="bajo"
      steps={investmentBasicsTutorialSteps}
      onClose={() => {
        setIsOpen(false)
        router.replace("/como-funciona")
      }}
      onFinish={() => {
        const href = "/?tutorial=analysis-entry"
        startTransition({
          href,
          direction: "backward",
          beforeNavigate: () => setIsOpen(false),
          onNavigate: () => router.push(href),
        })
      }}
    />
  )
}
