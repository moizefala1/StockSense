import { useState } from "react"
import { RefreshCw, Info, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AnalysisResult as AnalysisResultType } from "@/lib/types"
import { VerdictBadge } from "@/components/analysis/verdict-badge"
import { IndicatorCard } from "@/components/analysis/indicator-card"

interface AnalysisResultProps {
  analysis: AnalysisResultType
  onReanalyze: () => void
}

export function AnalysisResult({ analysis, onReanalyze }: AnalysisResultProps) {
  const [showReasoning, setShowReasoning] = useState(false)
  const [showIndicators, setShowIndicators] = useState(false)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="mb-4 text-xl font-semibold text-primary">Resultado del análisis</h2>

      <Card className="border-border shadow-sm">
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
          <div className="flex justify-between items-center">
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
            onClick={() => setShowReasoning(!showReasoning)}
            className="mt-4 flex w-full items-center justify-between rounded-lg bg-muted p-4 text-left transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          >
            <span className="text-sm font-medium text-primary">
              ¿Por qué esta recomendación?
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground/50 transition-transform duration-200",
                showReasoning && "rotate-180"
              )}
            />
          </button>

          {showReasoning && (
            <div className="mt-2 rounded-lg bg-muted p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-sm leading-relaxed text-foreground/85">{analysis.reasoning}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <button
          type="button"
          onClick={() => setShowIndicators(!showIndicators)}
          className="mb-4 flex w-full items-center justify-between text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-primary">Indicadores técnicos</h2>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground/50 transition-transform duration-200",
              showIndicators && "rotate-180"
            )}
          />
        </button>

        {showIndicators && (
          <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <IndicatorCard
              title="RSI (14 días)"
              value={analysis.indicators.rsi.value}
              signal={analysis.indicators.rsi.signal}
              description={analysis.indicators.rsi.description}
              tooltip="El RSI mide la velocidad y el cambio de los movimientos de precio. Bajo 30 puede sugerir sobreventa y sobre 70 puede sugerir sobrecompra."
            />

            <IndicatorCard
              title="Media Móvil 50 días"
              value={`$${analysis.indicators.sma50.value.toFixed(2)}`}
              signal={analysis.indicators.sma50.signal}
              description={analysis.indicators.sma50.description}
              tooltip="La media móvil de 50 días representa la tendencia de corto plazo. Estar por encima suele interpretarse como una señal positiva."
            />

            <IndicatorCard
              title="Media Móvil 200 días"
              value={`$${analysis.indicators.sma200.value.toFixed(2)}`}
              signal={analysis.indicators.sma200.signal}
              description={analysis.indicators.sma200.description}
              tooltip="La media móvil de 200 días representa la tendencia de largo plazo. Estar por encima suele interpretarse como una señal alcista."
            />

            <IndicatorCard
              title="Tendencia General"
              value={analysis.indicators.trend.value}
              signal={analysis.indicators.trend.signal}
              description={analysis.indicators.trend.description}
              tooltip="La tendencia general se estima observando la dirección predominante del precio durante las últimas semanas."
            />
          </div>
        )}
      </div>

      <Card className="border-border bg-primary-foreground shadow-sm">
        <CardContent className="py-2 px-7">
          <div className="flex gap-4">
            <Info className="h-6 w-6 flex-shrink-0 text-accent" />
            <h3 className="font-semibold text-primary">¿Qué significan estos indicadores?</h3>
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
  )
}
