"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, AlertCircle, X, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/hooks/use-analysis"
import { useTutorialProfile } from "@/hooks/use-tutorial-profile"
import { StockSearch } from "@/components/analysis/stock-search"
import { AnalysisResult } from "@/components/analysis/analysis-result"
import { ThresholdConfig } from "@/components/analysis/threshold-config"
import { TutorialOverlay } from "@/components/tutorial/tutorial-overlay"
import { TutorialSkeleton } from "@/components/tutorial/tutorial-skeleton"
import { DEFAULT_THRESHOLDS, type IndicatorThresholds } from "@/lib/types"
import {
  tutorialDemoAnalysis,
  tutorialStepsByLevel,
} from "@/lib/tutorial"

// ── Skeleton ──────────────────────────────────────────────────────────────────
// Refleja el layout real de AnalysisResult: 2 columnas en lg, 3 cards.
// Los placeholders tienen las mismas dimensiones aproximadas que el contenido real
// para que la transición skeleton → resultado no produzca saltos de layout.

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-[pulse_1.2s_ease-in-out_infinite] rounded-md bg-muted ${className ?? ""}`}
    />
  )
}

function AnalysisSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Fila header: "Resultado del análisis" + botón "Analizar otra acción" */}
      <div className="flex items-center justify-between">
        <Shimmer className="h-7 w-52" />
        <Shimmer className="h-9 w-44 rounded-lg" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Columna izquierda: Card veredicto + Card disclaimer */}
        <div className="space-y-6">
          {/* Card 1 — veredicto */}
          <Card className="border-border shadow-sm">
            <div className="p-6 pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Shimmer className="h-7 w-56" />
                  <Shimmer className="h-6 w-24" />
                </div>
                <Shimmer className="h-12 w-32 rounded-full" />
              </div>
            </div>
            <CardContent className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Shimmer className="h-5 w-28" />
                <Shimmer className="h-8 w-36 rounded-lg" />
              </div>
              <Shimmer className="h-12 w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Card 2 — disclaimer */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Shimmer className="h-5 w-5 rounded-full" />
                <Shimmer className="h-5 w-48" />
              </div>
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-5/6" />
              <Shimmer className="h-4 w-4/6" />
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: Card gráfico */}
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 space-y-4">
            {/* Título + selector de indicador */}
            <div className="flex items-center justify-between">
              <Shimmer className="h-5 w-36" />
              <Shimmer className="h-8 w-48 rounded-lg" />
            </div>

            {/* Header del gráfico: ícono + texto + % */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shimmer className="h-7 w-7 rounded-full" />
                <Shimmer className="h-4 w-32" />
              </div>
              <Shimmer className="h-6 w-14" />
            </div>

            {/* Área del gráfico */}
            <Shimmer className="h-[220px] w-full rounded-lg" />

            {/* Leyenda */}
            <div className="flex items-center gap-4">
              <Shimmer className="h-4 w-12" />
              <Shimmer className="h-4 w-20" />
            </div>

            {/* IndicatorSummaryCard */}
            <div className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Shimmer className="h-4 w-40" />
                <Shimmer className="h-4 w-16" />
              </div>
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-4/5" />
            </div>

            {/* IndicatorExplainer (acordeón cerrado) */}
            <Shimmer className="h-12 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ── Toast de error ────────────────────────────────────────────────────────────
// Aparece flotante en la esquina superior derecha. Se cierra solo a los 5s o al
// hacer click en la X. No bloquea la UI — el buscador ya está visible detrás.

interface ErrorToastProps {
  message: string
  onClose: () => void
}

function ErrorToast({ message, onClose }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-6 right-6 z-50 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200 max-w-sm"
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-destructive">No pudimos completar el análisis</p>
        <p className="text-xs text-destructive/80 mt-0.5">{message} Inténtalo de nuevo.</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="flex-shrink-0 text-destructive/60 hover:text-destructive transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── StockAnalysis ─────────────────────────────────────────────────────────────

export function StockAnalysis() {
  const router = useRouter()
  const [thresholds, setThresholds] = useState<IndicatorThresholds>(DEFAULT_THRESHOLDS)

  const {
    searchQuery,
    setSearchQuery,
    analysis,
    isAnalyzing,
    error,
    filteredStocks,
    analyze,
    reanalyze,
    reset,
  } = useAnalysis(thresholds)

  const { status, profile, isTutorialCompleted, completeTutorial, restartTutorial } =
    useTutorialProfile()
  const [manualTutorialOpen, setManualTutorialOpen] = useState(false)
  const [tutorialStepId, setTutorialStepId] = useState<string | null>(null)

  const handleTutorialFinish = () => {
    completeTutorial()
    setManualTutorialOpen(false)
    setTutorialStepId(null)
  }

  const handleRestartTutorial = () => {
    if (profile) {
      restartTutorial()
      if (profile.level === "bajo") {
        router.push("/como-funciona?tutorial=basics")
      } else {
        setManualTutorialOpen(true)
      }
    }
  }

  const tutorialOpen =
    Boolean(profile) &&
    (manualTutorialOpen || (status === "ready" && !isTutorialCompleted))

  const userKnowledge = profile && profile.level !== "bajo" ? "sabe" as const : "no-sabe" as const
  const userRisk = "moderado" as const

  const visibleAnalysis = analysis ?? (tutorialOpen ? tutorialDemoAnalysis : null)
  const tutorialSteps = profile ? tutorialStepsByLevel[profile.level] : []

  // Cuando hay error, volvemos al buscador automáticamente — el toast flota encima.
  // El usuario puede cerrar el toast y reintentar desde el buscador.
  const showSearch = (!analysis && !isAnalyzing) || tutorialOpen
  const showEmpty = status === "ready" && showSearch && !visibleAnalysis && !error

  return (
    <main className="flex-1 px-6 py-10 lg:px-8">
      {/* Toast de error — flotante, independiente del contenido de abajo */}
      {error && status === "ready" && !isAnalyzing && !tutorialOpen && (
        <ErrorToast
          message="No pudimos completar el análisis."
          onClose={reset}
        />
      )}

      <div className="mx-auto max-w-6xl">
        {status === "ready" && profile && (
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

        {showSearch && (
          <StockSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isAnalyzing={isAnalyzing}
            filteredStocks={filteredStocks}
            analysis={visibleAnalysis}
            onAnalyze={analyze}
          />
        )}

        <div className="mb-6">
          <ThresholdConfig
            thresholds={thresholds}
            onThresholdsChange={setThresholds}
          />
        </div>

        {status === "checking" && !isAnalyzing && <TutorialSkeleton />}

        {showEmpty && (
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

        {isAnalyzing && <AnalysisSkeleton />}

        {visibleAnalysis && !isAnalyzing && (
          <AnalysisResult
            analysis={visibleAnalysis}
            onReanalyze={reanalyze}
            onSearchAgain={reset}
            knowledge={userKnowledge}
            risk={userRisk}
            tutorialMode={tutorialOpen}
            tutorialStepId={tutorialStepId}
          />
        )}

        {tutorialOpen && <div className="h-[45vh]" aria-hidden="true" />}
      </div>

      {profile && tutorialSteps.length > 0 && (
        <TutorialOverlay
          key={`${profile.createdAt}-${tutorialOpen ? "open" : "closed"}`}
          isOpen={tutorialOpen}
          level={profile.level}
          steps={tutorialSteps}
          onFinish={handleTutorialFinish}
          onStepChange={setTutorialStepId}
        />
      )}
    </main>
  )
}
