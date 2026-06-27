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

interface AnalysisResultProps {
  analysis: AnalysisResultType
  onReanalyze: () => void
  onSearchAgain: () => void
  /** Eje 1: cuánta información técnica puede decodificar el usuario, determinado en otra página. Por defecto, el más simple. */
  knowledge?: KnowledgeLevel
  /** Eje 2: tolerancia al riesgo del usuario. Determina qué indicador viene preseleccionado. Por defecto, moderado. */
  risk?: RiskProfile
  tutorialMode?: boolean
}

export function AnalysisResult({
  analysis,
  onReanalyze,
  onSearchAgain,
  knowledge = "no-sabe",
  risk = "moderado",
  tutorialMode = false,
}: AnalysisResultProps) {
  const [showReasoning, setShowReasoning] = useState(tutorialMode)
  const [activeIndicator, setActiveIndicator] = useState<IndicatorKey>(defaultIndicatorByRisk[risk])
  const reasoningOpen = tutorialMode || showReasoning

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">Resultado del análisis</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSearchAgain} className="bg-accent text-background hover:bg-accent/80 hover:text-background">
            <Search className="h-4 w-4" />
            Analizar otra acción
          </Button>
          <Button variant="outline" size="sm" onClick={onSearchAgain} className="border-border bg-primary text-white hover:bg-primary/80 hover:text-white">
            Preguntar a la IA
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          {/* Card 1: identidad de la acción + veredicto + confianza + razonamiento */}
          <Card className="border-border shadow-sm" data-tutorial-id="analysis-summary">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl text-primary">
                    {analysis.symbol} - {analysis.name}
                  </CardTitle>
                  <p className="mt-1 text-xl font-semibold text-muted-foreground">
                    ${analysis.price.toFixed(2)}
                  </p>
                </div>
                <VerdictBadge verdict={analysis.verdict} />
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between items-center" data-tutorial-id="confidence-row">
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
                <div className="mt-2 rounded-lg bg-muted p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-sm leading-relaxed text-foreground/85">{analysis.reasoning}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: disclaimer de qué significan los indicadores, separada del veredicto */}
          <Card
            className="border-border bg-primary-foreground shadow-sm"
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

        {/* Card 3: gráfico + selector de indicador + resumen + explicación de cómo se calcula */}
        <Card className="border-border shadow-sm" data-tutorial-id="indicators-section">
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-primary">Evolución del precio</h3>
              <IndicatorSelector active={activeIndicator} onChange={setActiveIndicator} />
            </div>

            <PriceChart analysis={analysis} activeIndicator={activeIndicator} className="mt-3" />

            <IndicatorSummaryCard
              analysis={analysis}
              indicator={activeIndicator}
              className="mt-5"
            />

            <IndicatorExplainer
              indicator={activeIndicator}
              knowledge={knowledge}
              className="mt-3"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
