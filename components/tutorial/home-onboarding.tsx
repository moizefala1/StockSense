"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KnowledgeOnboarding } from "@/components/tutorial/knowledge-onboarding"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import { useTutorialProfile } from "@/hooks/use-tutorial-profile"
import { homeTutorialSteps, type KnowledgeProfile } from "@/lib/tutorial"

export function HomeOnboarding() {
  const router = useRouter()
  const { status, profile, saveProfile } = useTutorialProfile()
  const [homeTutorialProfile, setHomeTutorialProfile] = useState<KnowledgeProfile | null>(null)
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false)

  const handleComplete = (nextProfile: KnowledgeProfile) => {
    saveProfile(nextProfile)
    setIsKnowledgeOpen(false)
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

  if (status === "ready" && !profile && isKnowledgeOpen) {
    return <KnowledgeOnboarding onComplete={handleComplete} />
  }

  if (status === "ready" && !profile) {
    return (
      <Button
        type="button"
        onClick={() => setIsKnowledgeOpen(true)}
        className="fixed bottom-6 right-6 z-40 shadow-lg"
      >
        <GraduationCap className="h-4 w-4" />
        Iniciar tutorial
      </Button>
    )
  }

  return null
}
