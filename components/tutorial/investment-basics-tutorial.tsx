"use client"

import { useEffect, useLayoutEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import { useTutorialPageTransition } from "@/components/tutorial/tutorial-page-transition"
import { investmentBasicsTutorialSteps } from "@/lib/tutorial"

export function InvestmentBasicsTutorial() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { isTransitionSettling, startTransition } = useTutorialPageTransition()

  const continueToHome = () => {
    const href = "/?tutorial=analysis-entry"
    startTransition({
      href,
      direction: "backward",
      beforeNavigate: () => setIsOpen(false),
      onNavigate: () => router.push(href),
    })
  }

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("tutorial") !== "basics") return

    const target = document.querySelector<HTMLElement>(
      '[data-tutorial-id="investment-basics-intro"]'
    )
    if (!target) return

    const targetTop = window.scrollY + target.getBoundingClientRect().top - 96
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" })
  }, [])

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
      onClose={continueToHome}
      onFinish={continueToHome}
    />
  )
}
