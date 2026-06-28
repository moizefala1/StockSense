"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { IndicatorKey, KnowledgeLevel } from "@/lib/types"
import { indicatorExplainers } from "@/lib/indicator-content"

interface IndicatorExplainerProps {
  indicator: IndicatorKey
  knowledge: KnowledgeLevel
  className?: string
}

export function IndicatorExplainer({ indicator, knowledge, className }: IndicatorExplainerProps) {
  const [open, setOpen] = useState(false)
  const content = indicatorExplainers[indicator]
  const text = knowledge === "sabe" ? content.technical : content.simple

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
      >
        <span className="text-sm font-medium text-primary">
          ¿Cómo se calcula este indicador?
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 text-muted-foreground/50 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-base font-semibold text-primary mb-2">{content.title}</h4>
          <p className="text-sm leading-relaxed text-foreground/85">{text}</p>

          {knowledge === "sabe" && (
            <div className="mt-4 rounded-md bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Cálculo</p>
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-primary">
                {content.formula}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
