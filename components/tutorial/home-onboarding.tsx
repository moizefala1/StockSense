"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { KnowledgeOnboarding } from "@/components/tutorial/knowledge-onboarding"
import { TutorialSkeleton } from "@/components/tutorial/tutorial-skeleton"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import { useTutorialProfile } from "@/hooks/use-tutorial-profile"
import { homeTutorialSteps, type KnowledgeProfile } from "@/lib/tutorial"

export function HomeOnboarding() {
  const router = useRouter()
  const { status, profile, saveProfile } = useTutorialProfile()
  const [homeTutorialProfile, setHomeTutorialProfile] = useState<KnowledgeProfile | null>(null)

  const handleComplete = (nextProfile: KnowledgeProfile) => {
    saveProfile(nextProfile)
    setHomeTutorialProfile(nextProfile)
  }

  if (homeTutorialProfile) {
    return (
      <TutorialOverlay
        isOpen
        level={homeTutorialProfile.level}
        steps={homeTutorialSteps}
        onFinish={() => {
          setHomeTutorialProfile(null)
          router.push("/analizar")
        }}
      />
    )
  }

  if (status === "ready" && !profile) {
    return <KnowledgeOnboarding onComplete={handleComplete} />
  }

  if (status === "checking") {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/60 px-4 py-6 backdrop-blur-sm">
        <TutorialSkeleton />
      </div>
    )
  }

  return null
}
