import type { AnalysisResult, PricePoint } from "@/lib/types"

export type KnowledgeLevel = "bajo" | "medio" | "alto"

export interface KnowledgeProfile {
  level: KnowledgeLevel
  goal: string
  createdAt: string
  version: string
}

export interface TutorialStep {
  id: string
  section: string
  phase:
    | "inicio"
    | "problema"
    | "concepto"
    | "ejemplo"
    | "practica"
    | "solucion"
    | "advertencia"
    | "resumen"
  title: string
  description: string
  category: "stocks" | "recommendations" | "page"
  targetId: string
  placement: "top" | "bottom" | "left" | "right"
  scrollPosition?: "start" | "center" | "end"
  panelMode?: "default" | "navigation"
  panelWidth?: "default" | "wide" | "compact"
  nextLabel?: string
  finishLabel?: string
  problem?: string
  concept?: string
  example?: string
  practice?: string
  solution?: string
  warning?: string
  takeaway?: string
}

export const knowledgeLevelOptions: Array<{
  level: KnowledgeLevel
  title: string
  description: string
}> = [
  {
    level: "bajo",
    title: "Estoy empezando",
    description: "Quiero entender qué es una acción, cómo interpretar las recomendaciones y aprender a usar la página.",
  },
  {
    level: "medio",
    title: "Ya conozco lo básico",
    description: "Entiendo qué es una inversión, pero quiero aprender a interpretar las recomendaciones y a usar la página.",
  },
  {
    level: "alto",
    title: "Tengo experiencia",
    description: "Conozco de inversiones y quiero entender cómo usar la plataforma.",
  },
]

export const investmentBasicsTutorialSteps: TutorialStep[] = [
  {
    id: "stock-definition",
    section: "Conceptos básicos",
    phase: "concepto",
    title: "¿Qué es una acción?",
    description:
      "Una acción representa una pequeña parte de una empresa. Cuando compras una, pasas a ser dueño de una fracción de esa compañía y su valor puede subir o bajar.",
    category: "stocks",
    targetId: "investment-stock-definition",
    placement: "bottom",
    panelMode: "navigation",
    panelWidth: "compact",
  },
  {
    id: "investing-definition",
    section: "Conceptos básicos",
    phase: "concepto",
    title: "¿Qué es invertir?",
    description: "",
    category: "page",
    targetId: "investing-definition",
    placement: "bottom",
    panelMode: "navigation",
    panelWidth: "compact",
  },
  {
    id: "why-invest",
    section: "Conceptos básicos",
    phase: "concepto",
    title: "¿Por qué invertir?",
    description: "",
    category: "page",
    targetId: "why-investing",
    placement: "bottom",
    panelMode: "navigation",
    panelWidth: "compact",
  },
  {
    id: "investing-rules",
    section: "Conceptos básicos",
    phase: "advertencia",
    title: "Las tres reglas más importantes",
    description: "",
    category: "page",
    targetId: "investing-rules",
    placement: "bottom",
    panelMode: "navigation",
    panelWidth: "compact",
  },
  {
    id: "investing-platforms",
    section: "Conceptos básicos",
    phase: "ejemplo",
    title: "Plataformas recomendadas en Chile",
    description: "",
    category: "page",
    targetId: "investing-platforms",
    placement: "bottom",
    panelMode: "navigation",
    panelWidth: "compact",
    finishLabel: "Ir a analizar",
  },
]

const analysisCoreSteps: TutorialStep[] = [
  {
    id: "search-flow",
    section: "Analizar una acción",
    phase: "inicio",
    title: "Busca una acción",
    description:
      "Escribe en el buscador el nombre de la empresa que quieres analizar o selecciona una de las acciones populares.",
    category: "page",
    targetId: "stock-search-panel",
    placement: "bottom",
    panelWidth: "wide",
  },
  {
    id: "stock-price",
    section: "Resultado del análisis",
    phase: "concepto",
    title: "El precio es solo una parte",
    description:
      "Aquí verás el precio actual y cómo se genera la recomendación.",
    category: "stocks",
    targetId: "analysis-summary",
    placement: "bottom",
    scrollPosition: "start",
  },
  {
    id: "recommendation",
    section: "Resultado del análisis",
    phase: "solucion",
    title: "Recomendación",
    description:
      "Esta tarjeta resume el análisis en una recomendación directa: comprar, mantener o vender. Así podrás ahorrar tiempo al recibir la indicación lista.",
    category: "recommendations",
    targetId: "analysis-recommendation",
    placement: "bottom",
  },
]

const recommendationsSteps: TutorialStep[] = [
  {
    id: "confidence",
    section: "Recomendación",
    phase: "advertencia",
    title: "Confianza de la señal",
    description:
      "La confianza muestra qué tan alineadas están las señales del análisis. No es una garantía, pero ayuda a interpretar el resultado.",
    category: "recommendations",
    targetId: "confidence-row",
    placement: "bottom",
    scrollPosition: "start",
  },
  {
    id: "reasoning",
    section: "Recomendación",
    phase: "ejemplo",
    title: "Revisa el razonamiento",
    description:
      "Aquí puedes entender qué señales explican la recomendación antes de tomar una decisión.",
    category: "recommendations",
    targetId: "reasoning-section",
    placement: "bottom",
    scrollPosition: "start",
  },
  {
    id: "indicators",
    section: "Evidencia",
    phase: "practica",
    title: "Los indicadores muestran la evidencia",
    description:
      "Revisa el RSI, las medias móviles y la tendencia para comprender qué datos sostienen la recomendación.",
    category: "recommendations",
    targetId: "indicators-overview",
    placement: "bottom",
    scrollPosition: "start",
  },
]

const supportStep: TutorialStep = {
  id: "support-card",
  section: "Uso responsable",
  phase: "advertencia",
  title: "Recuerda el límite del análisis",
  description:
    "StockSense entrega apoyo educativo. Los indicadores ayudan a investigar, pero no garantizan resultados ni reemplazan tu criterio.",
  category: "page",
    targetId: "education-note",
    placement: "bottom",
    scrollPosition: "start",
}

export const homeTutorialSteps: TutorialStep[] = [
  {
    id: "home-intro",
    section: "Inicio claro",
    phase: "inicio",
    title: "Bienvenido a StockSense",
    description:
      "Esta es la página de inicio. Aquí conocerás el objetivo de StockSense.",
    category: "page",
    targetId: "home-hero-content",
    placement: "bottom",
  },
]

export const tutorialStepsByLevel: Record<KnowledgeLevel, TutorialStep[]> = {
  bajo: [...analysisCoreSteps, ...recommendationsSteps, supportStep],
  medio: [...analysisCoreSteps, ...recommendationsSteps, supportStep],
  alto: [...analysisCoreSteps, supportStep],
}

const tutorialPriceHistory: PricePoint[] = Array.from({ length: 30 }, (_, index) => {
  const price = 164.8 + index * 0.61 + Math.sin(index / 2) * 0.8
  const rsi = 44 + index * 0.35 + Math.sin(index / 3) * 4

  return {
    date: new Date(Date.UTC(2026, 4, 29 + index)).toISOString().slice(0, 10),
    price: Math.round(price * 100) / 100,
    rsi: Math.round(rsi * 10) / 10,
    sma50: Math.round((163.9 + index * 0.49) * 100) / 100,
    sma200: Math.round((160.2 + index * 0.16) * 100) / 100,
  }
})

export const tutorialDemoAnalysis: AnalysisResult = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 182.52,
  verdict: "comprar",
  confidence: 85,
  reasoning:
    "El mock combina senales positivas: el precio esta sobre las medias moviles principales, el RSI no marca sobrecompra extrema y la tendencia general es alcista. Por eso el resultado se resume como Comprar.",
  indicators: {
    rsi: {
      value: 42.5,
      signal: "mantener",
      description: "El RSI esta en una zona neutral: no muestra sobrecompra ni sobreventa extrema.",
    },
    sma50: {
      value: 178.2,
      signal: "comprar",
      description: "El precio esta por encima de la media de 50 dias, lo que sugiere fuerza de corto plazo.",
    },
    sma200: {
      value: 164.8,
      signal: "comprar",
      description: "El precio esta por encima de la media de 200 dias, una senal positiva de largo plazo.",
    },
    trend: {
      value: "Alcista",
      signal: "comprar",
      description: "La tendencia general sube y refuerza el veredicto de compra.",
    },
  },
  priceHistory: tutorialPriceHistory,
  priceChangePercent: 10.8,
}

export const KNOWLEDGE_PROFILE_STORAGE_KEY = "stocksense-knowledge-profile"
export const TUTORIAL_COMPLETED_STORAGE_KEY = "stocksense-tutorial-completed"
export const TUTORIAL_PROFILE_VERSION = "tutorial-profile-v6"
export const KNOWLEDGE_PROFILE_COOKIE_KEY = "stocksense_knowledge_profile"
export const TUTORIAL_COMPLETED_COOKIE_KEY = "stocksense_tutorial_completed"

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 120

function isKnowledgeLevel(value: unknown): value is KnowledgeLevel {
  return value === "bajo" || value === "medio" || value === "alto"
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`))

  return cookie ? cookie.slice(name.length + 1) : null
}

function setCookieValue(name: string, value: string, maxAge = COOKIE_MAX_AGE_SECONDS) {
  if (typeof document === "undefined") return

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function deleteCookieValue(name: string) {
  if (typeof document === "undefined") return

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

export function readKnowledgeProfileCookie(): KnowledgeProfile | null {
  const rawProfile = getCookieValue(KNOWLEDGE_PROFILE_COOKIE_KEY)
  if (!rawProfile) return null

  try {
    const profile = JSON.parse(decodeURIComponent(rawProfile)) as KnowledgeProfile

    if (
      profile.version !== TUTORIAL_PROFILE_VERSION ||
      !isKnowledgeLevel(profile.level) ||
      typeof profile.goal !== "string" ||
      typeof profile.createdAt !== "string"
    ) {
      return null
    }

    return profile
  } catch {
    return null
  }
}

export function saveKnowledgeProfileCookie(profile: KnowledgeProfile) {
  setCookieValue(KNOWLEDGE_PROFILE_COOKIE_KEY, encodeURIComponent(JSON.stringify(profile)))
}

export function readTutorialCompletedCookie() {
  return getCookieValue(TUTORIAL_COMPLETED_COOKIE_KEY) === "true"
}

export function saveTutorialCompletedCookie() {
  setCookieValue(TUTORIAL_COMPLETED_COOKIE_KEY, "true")
}

export function clearTutorialCompletedCookie() {
  deleteCookieValue(TUTORIAL_COMPLETED_COOKIE_KEY)
}

export function clearTutorialCookies() {
  deleteCookieValue(KNOWLEDGE_PROFILE_COOKIE_KEY)
  deleteCookieValue(TUTORIAL_COMPLETED_COOKIE_KEY)
}
