"use client"

import { cn } from "@/lib/utils"
import { TIME_RANGE_LABELS, type TimeRange } from "@/lib/types"

interface TimeRangeSelectorProps {
  active: TimeRange
  onChange: (range: TimeRange) => void
  className?: string
}

const order: TimeRange[] = ["1m", "6m", "ytd", "1y"]

export function TimeRangeSelector({ active, onChange, className }: TimeRangeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Seleccionar rango temporal del gráfico"
      className={cn("inline-flex items-center gap-1 rounded-lg bg-muted p-1", className)}
    >
      {order.map((range) => (
        <button
          key={range}
          type="button"
          role="tab"
          aria-selected={active === range}
          onClick={() => onChange(range)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
            active === range
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {TIME_RANGE_LABELS[range]}
        </button>
      ))}
    </div>
  )
}
