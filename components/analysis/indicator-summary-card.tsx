import { cn } from "@/lib/utils"
import type { AnalysisResult, IndicatorKey, Verdict } from "@/lib/types"
import { indicatorExplainers } from "@/lib/indicator-content"

interface IndicatorSummaryCardProps {
  analysis: AnalysisResult
  indicator: IndicatorKey
  className?: string
}

const signalTextClass: Record<Verdict, string> = {
  comprar: "text-success",
  mantener: "text-warning",
  vender: "text-danger",
}

function formatValue(indicator: IndicatorKey, value: number) {
  if (indicator === "rsi") return value.toFixed(2)
  return `$${value.toFixed(2)}`
}

/**
 * Un solo bloque: nombre del indicador + su valor actual + qué dice esa señal en texto.
 * Responde "¿qué dice este indicador ahora mismo?" — distinto de IndicatorExplainer,
 * que responde "¿cómo se calcula?" y vive aparte, en un acordeón cerrado por defecto.
 */
export function IndicatorSummaryCard({ analysis, indicator, className }: IndicatorSummaryCardProps) {
  const data = analysis.indicators[indicator]
  const title = indicatorExplainers[indicator].title

  return (
    <div className={cn("rounded-xl border border-border p-4", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-primary">{title}</p>
        <span className={cn("text-sm font-semibold flex-shrink-0", signalTextClass[data.signal])}>
          {formatValue(indicator, data.value)}
        </span>
      </div>
      <p className={cn("mt-1.5 text-sm leading-relaxed", signalTextClass[data.signal])}>
        {data.description}
      </p>
    </div>
  )
}
