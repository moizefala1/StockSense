export type Verdict = "comprar" | "mantener" | "vender"

export interface IndicatorThresholds {
  rsiOversold: number
  rsiOverbought: number
  smaMargin: number
}

export const DEFAULT_THRESHOLDS: IndicatorThresholds = {
  rsiOversold: 30,
  rsiOverbought: 70,
  smaMargin: 5,
}

export interface Stock {
  symbol: string
  name: string
  price: number
}

export interface IndicatorData {
  value: number
  signal: Verdict
  description: string
}

export interface TrendData {
  value: string
  signal: Verdict
  description: string
}

export interface AnalysisIndicators {
  rsi: IndicatorData
  sma50: IndicatorData
  sma200: IndicatorData
  trend: TrendData
}

export interface AnalysisResult {
  symbol: string
  name: string
  price: number
  verdict: Verdict
  confidence: number
  indicators: AnalysisIndicators
  reasoning: string
}
