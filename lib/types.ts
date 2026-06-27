export type Verdict = "comprar" | "mantener" | "vender"

/** Eje 1: cuánta información técnica puede decodificar el usuario. Controla qué tan técnica es la explicación del indicador. */
export type KnowledgeLevel = "no-sabe" | "sabe"

/** Eje 2: tolerancia al riesgo del usuario. Controla qué indicador viene preseleccionado en el gráfico. */
export type RiskProfile = "conservador" | "moderado" | "arriesgado"

/** Los 3 indicadores que se pueden superponer al precio en el gráfico, uno a la vez. */
export type IndicatorKey = "rsi" | "sma50" | "sma200"

export interface Stock {
  symbol: string
  name: string
  price: number
}

export interface PricePoint {
  date: string
  price: number
  rsi: number
  sma50: number
  sma200: number
  /** true si este punto cae en una zona de sobrecompra/sobreventa de RSI */
  rsiSignal?: Verdict
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
  /** Serie de precios de los últimos 30 días, coherente con el veredicto */
  priceHistory: PricePoint[]
  /** Variación porcentual del precio en el período mostrado, ya redondeada para mostrar directo en UI */
  priceChangePercent: number
}

/** Qué indicador viene preseleccionado en el gráfico según el perfil de riesgo del usuario.
 *  conservador → SMA200: tendencia sólida de largo plazo, ignora ruido de corto plazo.
 *  moderado    → SMA50:  tendencia reciente, balance entre estabilidad y reacción.
 *  arriesgado  → RSI:    momentum de corto plazo, señales de entrada/salida.
 */
export const defaultIndicatorByRisk: Record<RiskProfile, IndicatorKey> = {
  conservador: "sma200",
  moderado: "sma50",
  arriesgado: "rsi",
}