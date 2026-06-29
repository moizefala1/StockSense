"use client"

import { useState } from "react"
import { ChevronDown, TrendingDown, TrendingUp, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import type { IndicatorKey, KnowledgeLevel } from "@/lib/types"
import { indicatorExplainers, type RsiZone } from "@/lib/indicator-content"
import { Badge } from "@/components/ui/badge"

interface IndicatorExplainerProps {
  indicator: IndicatorKey
  knowledge: KnowledgeLevel
  className?: string
}

const zoneStyles: Record<RsiZone, { badge: string; icon: typeof TrendingDown; label: string }> = {
  oversold: { badge: "bg-success/15 text-success border-success/30", icon: TrendingDown, label: "Sobreventa" },
  neutral: { badge: "bg-warning/15 text-warning border-warning/30", icon: Activity, label: "Neutral" },
  overbought: { badge: "bg-danger/15 text-danger border-danger/30", icon: TrendingUp, label: "Sobrecompra" },
}

export function IndicatorExplainer({ indicator, knowledge, className }: IndicatorExplainerProps) {
  const [open, setOpen] = useState(false)
  const content = indicatorExplainers[indicator]
  const text = knowledge === "sabe" ? content.technical : content.simple
  const examples = content.examples ?? []
  const hasRsiMarkers = examples.some((e) => typeof e.rsiValue === "number")

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

          {examples.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Ejemplos prácticos
              </p>

              {hasRsiMarkers && (
                <div className="mb-5">
                  <RsiScale examples={examples} />
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {examples.map((example, index) => {
                  const zone = example.zone ? zoneStyles[example.zone] : null
                  const Icon = zone?.icon ?? Activity
                  return (
                    <div
                      key={index}
                      className="flex flex-col rounded-lg border border-border bg-muted/40 p-3"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={cn(
                            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                            zone ? zone.badge : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        {example.rsiValue !== undefined && (
                          <Badge variant="outline" className={cn("font-mono", zone?.badge)}>
                            RSI {example.rsiValue}
                          </Badge>
                        )}
                      </div>
                      {zone && (
                        <p className={cn("text-xs font-medium mb-1.5", zone.badge.split(" ")[1])}>
                          {zone.label}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed text-foreground/90">
                        <span className="font-medium text-primary">Situación: </span>
                        {example.situation}
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/90 mt-1.5">
                        <span className="font-medium text-primary">Lectura: </span>
                        {example.reading}
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/90 mt-1.5">
                        <span className="font-medium text-primary">Qué hacer: </span>
                        {example.takeaway}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface RsiScaleProps {
  examples: NonNullable<typeof indicatorExplainers.rsi.examples>
}

function RsiScale({ examples }: RsiScaleProps) {
  const markers = examples
    .filter((e) => typeof e.rsiValue === "number" && e.zone)
    .map((e) => ({ value: e.rsiValue as number, zone: e.zone as RsiZone }))

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2">Escala RSI (0–100)</p>
      <div className="relative h-3 w-full overflow-hidden rounded-full">
        <div className="absolute inset-y-0 left-0 h-full bg-success/60" style={{ width: "30%" }} />
        <div
          className="absolute inset-y-0 h-full bg-warning/50"
          style={{ left: "30%", width: "40%" }}
        />
        <div
          className="absolute inset-y-0 h-full bg-danger/60"
          style={{ left: "70%", width: "30%" }}
        />
      </div>
      <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
        <span className="absolute left-0">0</span>
        <span className="absolute" style={{ left: "30%", transform: "translateX(-50%)" }}>30</span>
        <span className="absolute" style={{ left: "70%", transform: "translateX(-50%)" }}>70</span>
        <span className="absolute right-0">100</span>
      </div>
      {markers.length > 0 && (
        <div className="relative mt-2 h-6">
          {markers.map((m, i) => {
            const zone = zoneStyles[m.zone]
            const Icon = zone.icon
            return (
              <div
                key={i}
                className="absolute flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${m.value}%` }}
              >
                <Icon className={cn("h-3.5 w-3.5", zone.badge.split(" ")[1])} />
                <span className={cn("mt-0.5 text-[10px] font-mono", zone.badge.split(" ")[1])}>
                  {m.value}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
