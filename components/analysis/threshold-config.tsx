"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Info, RotateCcw, SlidersHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { DEFAULT_THRESHOLDS, type IndicatorThresholds } from "@/lib/types"

interface ThresholdConfigProps {
  thresholds: IndicatorThresholds
  onThresholdsChange: (thresholds: IndicatorThresholds) => void
}

export function ThresholdConfig({ thresholds, onThresholdsChange }: ThresholdConfigProps) {
  const [expanded, setExpanded] = useState(false)

  const handleRsiChange = ([oversold, overbought]: number[]) => {
    onThresholdsChange({ ...thresholds, rsiOversold: oversold, rsiOverbought: overbought })
  }

  const handleSmaSliderChange = ([value]: number[]) => {
    const rounded = Math.round(value * 2) / 2
    onThresholdsChange({ ...thresholds, smaMargin: rounded })
  }

  const handleSmaInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value)
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(20, parsed))
      const rounded = Math.round(clamped * 2) / 2
      onThresholdsChange({ ...thresholds, smaMargin: rounded })
    }
  }

  const handleSmaInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }

  const handleReset = () => {
    onThresholdsChange({ ...DEFAULT_THRESHOLDS })
  }

  const isDefault =
    thresholds.rsiOversold === DEFAULT_THRESHOLDS.rsiOversold &&
    thresholds.rsiOverbought === DEFAULT_THRESHOLDS.rsiOverbought &&
    thresholds.smaMargin === DEFAULT_THRESHOLDS.smaMargin

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="border-border shadow-sm">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-primary">
              Umbrales de indicadores
            </span>
            {!expanded && (
              <span className="text-xs text-muted-foreground">
                RSI {thresholds.rsiOversold}–{thresholds.rsiOverbought}, SMA {thresholds.smaMargin}%
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground/50 transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </button>

        {expanded && (
          <CardContent className="space-y-6 pb-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <label className="text-sm font-medium text-muted-foreground">
                    RSI — Sobreventa / Sobrecompra
                  </label>
                  <Link
                    href="/como-funciona#indicadores"
                    className="inline-flex text-muted-foreground/50 hover:text-accent transition-colors"
                    aria-label="Más información sobre RSI"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </Link>
                </span>
              </div>
              <div className="flex items-center gap-3 px-0.5">
                <span className="w-7 text-xs tabular-nums text-muted-foreground">
                  {thresholds.rsiOversold}
                </span>
                <Slider
                  value={[thresholds.rsiOversold, thresholds.rsiOverbought]}
                  onValueChange={handleRsiChange}
                  min={0}
                  max={100}
                  step={1}
                  minStepsBetweenThumbs={5}
                  aria-label="Umbrales RSI sobreventa y sobrecompra"
                />
                <span className="w-7 text-right text-xs tabular-nums text-muted-foreground">
                  {thresholds.rsiOverbought}
                </span>
              </div>
              <div className="flex justify-between px-0.5 text-[10px] text-muted-foreground/50">
                <span>Sobreventa</span>
                <span>Neutral</span>
                <span>Sobrecompra</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="flex items-center gap-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  SMA — Distancia desde la media móvil
                </label>
                <Link
                  href="/como-funciona#indicadores"
                  className="inline-flex text-muted-foreground/50 hover:text-accent transition-colors"
                  aria-label="Más información sobre SMA"
                >
                  <Info className="h-3.5 w-3.5" />
                </Link>
              </span>

              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex h-3 rounded-sm overflow-hidden">
                  <div className="flex-1 bg-success/30" />
                  <div
                    className="bg-warning/40 transition-all duration-150"
                    style={{ width: `${3 + (thresholds.smaMargin / 20) * 47}%` }}
                  />
                  <div className="flex-1 bg-danger/20" />
                </div>
                <div className="mt-1.5 flex justify-between">
                  <span className="text-[10px] text-success">
                    Comprar <span className="text-muted-foreground/70">(sobre SMA)</span>
                  </span>
                  <span className="text-[10px] text-warning">
                    Mantener <span className="text-muted-foreground/70">(−{thresholds.smaMargin}%)</span>
                  </span>
                  <span className="text-[10px] text-danger">
                    Vender <span className="text-muted-foreground/70">(bajo −{thresholds.smaMargin}%)</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Slider
                  value={[thresholds.smaMargin]}
                  onValueChange={handleSmaSliderChange}
                  min={0}
                  max={20}
                  step={0.5}
                  aria-label="Margen SMA"
                  className="flex-1"
                />
                <div className="flex items-center gap-1">
                  <Input
                    key={thresholds.smaMargin}
                    defaultValue={thresholds.smaMargin}
                    onBlur={handleSmaInputBlur}
                    onKeyDown={handleSmaInputKeyDown}
                    className="h-8 w-14 text-center text-sm tabular-nums"
                    aria-label="Valor del margen SMA"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Predeterminados: RSI 30–70, SMA 5%
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={isDefault}
                className="text-muted-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restablecer
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
