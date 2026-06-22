"use client"

import { useEffect, useState } from "react"
import { RefreshCw, AlertCircle, TrendingUp, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/hooks/use-analysis"
import { StockSearch } from "@/components/analysis/stock-search"
import { AnalysisResult } from "@/components/analysis/analysis-result"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import {
  KNOWLEDGE_PROFILE_STORAGE_KEY,
  TUTORIAL_COMPLETED_STORAGE_KEY,
  clearTutorialCompletedCookie,
  readKnowledgeProfileCookie,
  readTutorialCompletedCookie,
  saveTutorialCompletedCookie,
  tutorialDemoAnalysis,
  tutorialStepsByLevel,
  type KnowledgeProfile,
} from "@/lib/tutorial"

type TutorialGate = "checking" | "ready"

export function StockAnalysis() {
  const {
    searchQuery,
    setSearchQuery,
    analysis,
    isAnalyzing,
    error,
    filteredStocks,
    analyze,
    reanalyze,
  } = useAnalysis()

  const [profile, setProfile] = useState<KnowledgeProfile | null>(null)
  const [tutorialGate, setTutorialGate] = useState<TutorialGate>("checking")
  const [tutorialOpen, setTutorialOpen] = useState(false)

  useEffect(() => {
    window.localStorage.removeItem(KNOWLEDGE_PROFILE_STORAGE_KEY)
    window.localStorage.removeItem(TUTORIAL_COMPLETED_STORAGE_KEY)

    const storedProfile = readKnowledgeProfileCookie()
    const tutorialCompleted = readTutorialCompletedCookie()
    const timer = window.setTimeout(() => {
      if (!storedProfile) {
        setProfile(null)
        setTutorialOpen(false)
        setTutorialGate("ready")
        return
      }

      setProfile(storedProfile)
      setTutorialOpen(!tutorialCompleted)
      setTutorialGate("ready")
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const handleTutorialFinish = () => {
    saveTutorialCompletedCookie()
    setTutorialOpen(false)
  }

  const handleRestartTutorial = () => {
    clearTutorialCompletedCookie()

    if (!profile) {
      return
    }

    setTutorialOpen(true)
  }

  const visibleAnalysis = analysis ?? (tutorialOpen ? tutorialDemoAnalysis : null)
  const tutorialSteps = profile ? tutorialStepsByLevel[profile.level] : []

  return (
    <main className="flex-1 px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {tutorialGate === "ready" && profile && (
          <div className="mb-3 flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRestartTutorial}
              className="text-muted-foreground"
            >
              <GraduationCap className="h-4 w-4" />
              Ver tutorial
            </Button>
          </div>
        )}

        <StockSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isAnalyzing={isAnalyzing}
          filteredStocks={filteredStocks}
          analysis={visibleAnalysis}
          onAnalyze={analyze}
        />

        {error && !isAnalyzing && !tutorialOpen && (
          <Card className="mx-auto max-w-3xl border-destructive/20 bg-destructive/5 shadow-sm">
            <CardContent className="py-10 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-4 text-lg font-medium text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={reanalyze}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar análisis
              </Button>
            </CardContent>
          </Card>
        )}

        {!isAnalyzing && !visibleAnalysis && !error && (
          <Card className="mx-auto max-w-3xl border-border shadow-sm">
            <CardContent className="py-12 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                Selecciona una acción para comenzar el análisis
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Busca por símbolo o elige una de las acciones populares
              </p>
            </CardContent>
          </Card>
        )}

        {isAnalyzing && (
          <Card className="mx-auto max-w-3xl py-8 border-slate-200 shadow-sm">
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="space-y-3">
                  <div className="h-9.5 w-46 animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-slate-300" />
                  <div className="h-6.5 w-21 animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-slate-300" />
                </div>

                <div className="h-16 w-33 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-slate-300" />
              </div>
            </CardContent>

            <CardContent className="space-y-4">

              <div className="h-20 animate-[pulse_1s_ease-in-out_infinite] rounded-2xl bg-slate-300" />

              <div className="flex items-center justify-between">
                <div className="h-6 w-28 animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-slate-300" />
                <div className="h-8 w-36 animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-slate-300" />
              </div>

            </CardContent>
          </Card>
        )}

        {visibleAnalysis && !isAnalyzing && (
          <AnalysisResult
            analysis={visibleAnalysis}
            onReanalyze={reanalyze}
            tutorialMode={tutorialOpen}
          />
        )}
      </div>

      {profile && tutorialSteps.length > 0 && (
        <TutorialOverlay
          key={`${profile.createdAt}-${tutorialOpen ? "open" : "closed"}`}
          isOpen={tutorialOpen}
          level={profile.level}
          steps={tutorialSteps}
          onFinish={handleTutorialFinish}
        />
      )}
    </main>
  )
}
