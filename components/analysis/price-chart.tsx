"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Dot,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnalysisResult, IndicatorKey, PricePoint, TimeRange, Verdict } from "@/lib/types"
import { DEFAULT_TIME_RANGE, TIME_RANGE_LABELS } from "@/lib/types"
import { TimeRangeSelector } from "@/components/analysis/time-range-selector"

interface PriceChartProps {
  analysis: AnalysisResult
  /** Indicador actualmente superpuesto a la línea de precio. Controlado por IndicatorSelector. */
  activeIndicator: IndicatorKey
  className?: string
}

const verdictTextClass: Record<Verdict, string> = {
  comprar: "text-success",
  mantener: "text-warning",
  vender: "text-danger",
}

const verdictBgClass: Record<Verdict, string> = {
  comprar: "bg-success/10",
  mantener: "bg-warning/10",
  vender: "bg-danger/10",
}

// Hex de respaldo solo para lo que Recharts no puede resolver vía clases Tailwind.
// Deben coincidir 1:1 con --success / --warning / --danger del Style Guide.
const verdictHex: Record<Verdict, string> = {
  comprar: "oklch(0.62 0.170 145)",
  mantener: "oklch(0.72 0.145 75)",
  vender: "oklch(0.58 0.210 25)",
}

const verdictLabel: Record<Verdict, string> = {
  comprar: "al alza",
  mantener: "estable",
  vender: "a la baja",
}

const VerdictIcon = {
  comprar: TrendingUp,
  mantener: Minus,
  vender: TrendingDown,
}

const indicatorAxisLabel: Record<IndicatorKey, string> = {
  rsi: "RSI",
  sma50: "Media 50d",
  sma200: "Media 200d",
}

function filterByRange(history: PricePoint[], range: TimeRange): PricePoint[] {
  if (range === "1y") return history

  const last = history[history.length - 1]
  if (!last) return history

  if (range === "ytd") {
    const startOfYear = new Date(last.date)
    startOfYear.setMonth(0, 1)
    const cutoff = startOfYear.toISOString().split("T")[0]
    const filtered = history.filter((p) => p.date >= cutoff)
    return filtered.length > 0 ? filtered : history
  }

  if (range === "6m") {
    const start = new Date(last.date)
    start.setMonth(start.getMonth() - 6, 1)
    const cutoff = start.toISOString().split("T")[0]
    const filtered = history.filter((p) => p.date >= cutoff)
    return filtered.length > 0 ? filtered : history
  }

  return history.slice(-30)
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: PricePoint }>
  activeIndicator: IndicatorKey
}

function CustomTooltip({ active, payload, activeIndicator }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload

  const indicatorValue =
    activeIndicator === "rsi"
      ? point.rsi.toFixed(1)
      : activeIndicator === "sma50"
        ? `$${point.sma50.toFixed(2)}`
        : `$${point.sma200.toFixed(2)}`

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-sm">
      <p className="text-muted-foreground text-xs mb-1">{formatDateShort(point.date)}</p>
      <p className="font-semibold text-primary">${point.price.toFixed(2)}</p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {indicatorAxisLabel[activeIndicator]}: {indicatorValue}
      </p>
    </div>
  )
}

/** Punto destacado en la serie: marca señales de sobrecompra/sobreventa, solo visible si activeIndicator === "rsi". */
interface SignalDotProps {
  cx?: number
  cy?: number
  payload: PricePoint
}

function SignalDot({ cx = 0, cy = 0, payload }: SignalDotProps) {
  if (!payload.rsiSignal) return <></>
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={5}
      fill={verdictHex[payload.rsiSignal as Verdict]}
      stroke="var(--surface)"
      strokeWidth={2}
    />
  )
}

export function PriceChart({ analysis, activeIndicator, className }: PriceChartProps) {
  const { verdict } = analysis
  const [timeRange, setTimeRange] = useState<TimeRange>(DEFAULT_TIME_RANGE)
  const colorHex = verdictHex[verdict]
  const textClass = verdictTextClass[verdict]
  const bgClass = verdictBgClass[verdict]
  const Icon = VerdictIcon[verdict]

  const gradientId = useMemo(() => `price-gradient-${analysis.symbol}`, [analysis.symbol])

  const isRsiActive = activeIndicator === "rsi"

  const visibleHistory = useMemo(
    () => filterByRange(analysis.priceHistory, timeRange),
    [analysis.priceHistory, timeRange]
  )

  const displayChangePercent = useMemo(() => {
    if (visibleHistory.length < 2) return 0
    const first = visibleHistory[0].price
    const last = visibleHistory[visibleHistory.length - 1].price
    return Math.round(((last - first) / first) * 1000) / 10
  }, [visibleHistory])

  const isPositiveChange = displayChangePercent >= 0

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-7 w-7 items-center justify-center rounded-full", bgClass)}>
            <Icon className={cn("h-4 w-4", textClass)} />
          </div>
          <p className="text-sm text-muted-foreground">
            {TIME_RANGE_LABELS[timeRange]} ·{" "}
            <span className={cn("font-medium", textClass)}>{verdictLabel[verdict]}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className={cn("text-lg font-semibold", textClass)}>
            {isPositiveChange ? "+" : ""}
            {displayChangePercent}%
          </p>
          <TimeRangeSelector active={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={visibleHistory} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorHex} stopOpacity={0.25} />
                <stop offset="100%" stopColor={colorHex} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />

            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              tick={{ fontSize: 11, fill: "var(--muted-fg)" }}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(visibleHistory.length / 4)}
            />

            {/* Eje del precio (izquierda) */}
            <YAxis
              yAxisId="price"
              domain={["auto", "auto"]}
              tick={{ fontSize: 11, fill: "var(--muted-fg)" }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(v) => `$${Math.round(v)}`}
            />

            {/* Eje del RSI (derecha, 0-100), solo se monta cuando RSI está activo */}
            {isRsiActive && (
              <YAxis
                yAxisId="rsi"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "var(--muted-fg)" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
            )}

            <Tooltip content={<CustomTooltip activeIndicator={activeIndicator} />} />

            {/* Línea base: el precio. Siempre presente, fija. */}
            <Area
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke={colorHex}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 5, fill: colorHex, stroke: "var(--surface)", strokeWidth: 2 }}
            />

            {/* Línea del indicador activo — una sola a la vez, intercambiable con el selector */}
            {activeIndicator === "sma50" && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="sma50"
                stroke="var(--secondary)"
                strokeWidth={2}
                strokeDasharray="8 8"
                dot={false}
                activeDot={{ r: 4, fill: "var(--secondary)", stroke: "var(--surface)", strokeWidth: 2 }}
              />
            )}

            {activeIndicator === "sma200" && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="sma200"
                stroke="var(--secondary)"
                strokeWidth={2}
                strokeDasharray="2 2"
                dot={false}
                activeDot={{ r: 4, fill: "var(--secondary)", stroke: "var(--surface)", strokeWidth: 2 }}
              />
            )}

            {isRsiActive && (
              <Line
                yAxisId="rsi"
                type="monotone"
                dataKey="rsi"
                stroke="var(--secondary)"
                strokeWidth={2}
                dot={(props) => <SignalDot key={props.payload.date} {...props} />}
                activeDot={{ r: 4, fill: "var(--secondary)", stroke: "var(--surface)", strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 rounded-full" style={{ backgroundColor: colorHex }} />
          Precio
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <span
            className={cn(
              "inline-block w-3 h-0.5",
              activeIndicator === "rsi" ? "" : "border-t-2",
              activeIndicator === "sma50" && "border-dashed",
              activeIndicator === "sma200" && "border-dotted"
            )}
            style={{
              borderColor: "var(--secondary)",
              backgroundColor: activeIndicator === "rsi" ? "var(--secondary)" : undefined,
            }}
          />
          {indicatorAxisLabel[activeIndicator]}
        </span>
      </div>
    </div>
  )
}
