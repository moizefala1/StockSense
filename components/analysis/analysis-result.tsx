"use client"

import { useState } from "react"
import { RefreshCw, Info, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type {
  AnalysisResult as AnalysisResultType,
  IndicatorKey,
  KnowledgeLevel,
  RiskProfile,
} from "@/lib/types"
import { defaultIndicatorByRisk } from "@/lib/types"
import { VerdictBadge } from "@/components/analysis/verdict-badge"
import { PriceChart } from "@/components/analysis/price-chart"
import { IndicatorSelector } from "@/components/analysis/indicator-selector"
import { IndicatorSummaryCard } from "@/components/analysis/indicator-summary-card"
import { IndicatorExplainer } from "@/components/analysis/indicator-explainer"
import { ThresholdConfig } from "@/components/analysis/threshold-config"
import { DEFAULT_THRESHOLDS, type IndicatorThresholds } from "@/lib/types"
import { useAnalysis } from "@/hooks/use-analysis"

interface AnalysisResultProps {
  analysis: AnalysisResultType
  onReanalyze: () => void
  onSearchAgain: () => void
  /** Eje 1: cuánta información técnica puede decodificar el usuario, determinado en otra página. Por defecto, el más simple. */
  knowledge?: KnowledgeLevel
  /** Eje 2: tolerancia al riesgo del usuario. Determina qué indicador viene preseleccionado. Por defecto, moderado. */
  risk?: RiskProfile
  tutorialMode?: boolean
  tutorialStepId?: string | null
}

const tutorialIndicatorByStep: Record<string, IndicatorKey> = {
  "indicator-sma50": "sma50",
  "indicator-rsi": "rsi",
  "indicator-sma200": "sma200",
}

export function AnalysisResult({
  analysis,
  onReanalyze,
  onSearchAgain,
  knowledge = "no-sabe",
  risk = "moderado",
  tutorialMode = false,
  tutorialStepId = null,
}: AnalysisResultProps) {
  const [showReasoning, setShowReasoning] = useState(tutorialMode)
  const [activeIndicator, setActiveIndicator] = useState<IndicatorKey>(defaultIndicatorByRisk[risk])
  const reasoningOpen = tutorialMode || showReasoning
  const tutorialIndicator = tutorialStepId ? tutorialIndicatorByStep[tutorialStepId] : undefined
  const displayedIndicator = tutorialMode && tutorialIndicator ? tutorialIndicator : activeIndicator

    const [thresholds, setThresholds] = useState<IndicatorThresholds>(DEFAULT_THRESHOLDS)


  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">Resultado del análisis</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSearchAgain}
            className="bg-accent text-background hover:bg-accent/80 hover:text-background"
          >
            <Search className="h-4 w-4" />
            Analizar otra acción
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSearchAgain}
            className="border-border bg-primary text-white hover:bg-primary/80 hover:text-white"
          >
            Preguntar a la IA
          </Button>
        </div>
      </div>

      <div
        className="grid scroll-mt-6 gap-6 lg:grid-cols-2 lg:items-start"
        data-tutorial-id="analysis-results-overview"
      >
        <div className="space-y-6">
          <Card className="border-border shadow-sm" data-tutorial-id="analysis-summary">
            <CardHeader data-tutorial-id="analysis-overview">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div data-tutorial-id="stock-price">
                  <CardTitle className="text-2xl text-primary">
                    {analysis.symbol} - {analysis.name}
                  </CardTitle>
                  <p className="mt-1 text-xl font-semibold text-muted-foreground">
                    ${analysis.price.toFixed(2)}
                  </p>
                </div>
                <div
                  data-tutorial-id="analysis-recommendation"
                  className={cn(
                    "relative rounded-full",
                    tutorialStepId === "recommendation" && "ring-4 ring-accent/20"
                  )}
                >
                  <VerdictBadge verdict={analysis.verdict} />
                  {tutorialMode && tutorialStepId === "stock-price" && (
                    <div
                      className="absolute -inset-1 rounded-full border border-border bg-muted shadow-inner"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div
                className="flex scroll-mt-28 justify-between items-center"
                data-tutorial-id="confidence-row"
              >
                <p className="text-sm text-muted-foreground">Confianza: {analysis.confidence}%</p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReanalyze}
                  className="group border-border text-muted-foreground"
                >
                  <RefreshCw className="h-4 w-4 text-primary group-hover:transition-transform group-hover:duration-300 group-hover:rotate-180" />
                  Actualizar análisis
                </Button>
              </div>

              <div className="scroll-mt-28" data-tutorial-id="reasoning-section">
                <button
                  type="button"
                  onClick={() => setShowReasoning(!reasoningOpen)}
                  data-tutorial-id="reasoning-toggle"
                  className="mt-4 flex w-full items-center justify-between rounded-lg bg-muted p-4 text-left transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
                >
                  <span className="text-sm font-medium text-primary">
                    ¿Por qué esta recomendación?
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground/50 transition-transform duration-200",
                      reasoningOpen && "rotate-180"
                    )}
                  />
                </button>

                {reasoningOpen && (
                  <div className="mt-2 rounded-lg bg-muted p-4 animate-in fade-in-0 slide-in-from-top-1 duration-300">
                    <p className="text-sm leading-relaxed text-foreground/85">{analysis.reasoning}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <ThresholdConfig
              thresholds={thresholds}
              onThresholdsChange={setThresholds}
            />
          </div>

          <Card
            className="scroll-mt-28 border-border bg-primary-foreground shadow-sm"
            data-tutorial-id="education-note"
          >
            <CardContent>
              <div className="flex gap-3">
                <Info className="h-5 w-5 flex-shrink-0 text-accent" />
                <h3 className="text-sm font-semibold text-primary">¿Qué significan estos indicadores?</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Estos indicadores técnicos analizan patrones históricos de precio y volumen.
                Aunque son herramientas útiles, el mercado sigue siendo incierto y ningún
                indicador garantiza resultados. Usa esta información como apoyo para tu
                investigación y no como única base para decidir.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4" data-tutorial-id="indicators-section">
          <Card className="scroll-mt-28 border-border shadow-sm" data-tutorial-id="indicators-overview">
            <CardContent>
              <div className="flex items-center justify-between gap-4 mb-1">
                <h3 className="font-medium text-primary">Evolución del precio</h3>
                <IndicatorSelector active={displayedIndicator} onChange={setActiveIndicator} />
              </div>

              <PriceChart analysis={analysis} activeIndicator={displayedIndicator} className="mt-3" />
            </CardContent>
          </Card>

          <div className="space-y-4 scroll-mt-28" data-tutorial-id="indicators-info-stack">
            <Card
              className="border-border bg-primary-foreground shadow-sm"
              data-tutorial-id="indicators-general-info"
            >
              <CardContent className="py-0">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 flex-shrink-0 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold text-primary">En general</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      Aquí tienes más información de los indicadores. Cada botón cambia el gráfico y
                      la tarjeta de abajo para mostrar qué está midiendo esa señal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div
              className="scroll-mt-28"
              data-tutorial-id={`indicator-card-${displayedIndicator}`}
            >
              <IndicatorSummaryCard
                analysis={analysis}
                indicator={displayedIndicator}
                className={cn(
                  "bg-card shadow-sm transition-shadow",
                  tutorialIndicator === displayedIndicator && "ring-4 ring-accent/20"
                )}
              />
            </div>

            <IndicatorExplainer
              indicator={displayedIndicator}
              knowledge={knowledge}
              className="bg-card shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
