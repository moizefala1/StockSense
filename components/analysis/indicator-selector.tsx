"use client"

import { cn } from "@/lib/utils"
import type { IndicatorKey } from "@/lib/types"
import { indicatorExplainers } from "@/lib/indicator-content"

interface IndicatorSelectorProps {
  active: IndicatorKey
  onChange: (indicator: IndicatorKey) => void
  className?: string
}

const order: IndicatorKey[] = ["rsi", "sma50", "sma200"]

export function IndicatorSelector({ active, onChange, className }: IndicatorSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Seleccionar indicador a mostrar en el gráfico"
      className={cn("inline-flex items-center gap-1 rounded-lg bg-muted p-1", className)}
    >
      {order.map((key) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
            active === key
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {indicatorExplainers[key].shortLabel}
        </button>
      ))}
    </div>
  )
}