"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import { investmentBasicsTutorialSteps } from "@/lib/tutorial"

export function InvestmentBasicsTutorial() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setIsOpen(params.get("tutorial") === "basics")
  }, [])

  return (
    <TutorialOverlay
      isOpen={isOpen}
      level="bajo"
      steps={investmentBasicsTutorialSteps}
      onFinish={() => {
        setIsOpen(false)
        router.push("/?tutorial=analysis-entry")
      }}
    />
  )
}
