import type { AnalysisResult } from "@/lib/types"

export type KnowledgeLevel = "bajo" | "medio" | "alto"

export interface KnowledgeProfile {
  level: KnowledgeLevel
  goal: string
  createdAt: string
  version: string
}

export interface TutorialStep {
  id: string
  title: string
  description: string
  category: "stocks" | "recommendations" | "page"
  targetId: string
  placement: "top" | "bottom" | "left" | "right"
}

export const knowledgeLevelOptions: Array<{
  level: KnowledgeLevel
  title: string
  description: string
}> = [
  {
    level: "bajo",
    title: "Estoy empezando",
    description: "Quiero entender que es una accion, como se lee una recomendacion y como usar la pagina.",
  },
  {
    level: "medio",
    title: "Ya conozco lo basico",
    description: "Entiendo que es invertir, pero quiero saber como se construye el veredicto.",
  },
  {
    level: "alto",
    title: "Tengo experiencia",
    description: "Solo necesito ubicar el flujo, los controles y las secciones principales.",
  },
]

const stocksSteps: TutorialStep[] = [
  {
    id: "stock-basics",
    title: "Primero: que estas analizando",
    description:
      "Una accion representa una participacion en una empresa. En StockSense partes buscando un simbolo, como AAPL o MSFT, para ver una lectura simplificada de esa empresa.",
    category: "stocks",
    targetId: "stock-search",
    placement: "bottom",
  },
  {
    id: "stock-price",
    title: "El precio es solo una senal",
    description:
      "El precio actual no dice por si solo si conviene comprar o vender. Por eso la pagina lo combina con indicadores que muestran tendencia, fuerza y posibles zonas de riesgo.",
    category: "stocks",
    targetId: "analysis-summary",
    placement: "bottom",
  },
]

const recommendationsSteps: TutorialStep[] = [
  {
    id: "verdict",
    title: "El veredicto resume varias senales",
    description:
      "Comprar, Mantener o Vender no sale de una sola metrica. El mock combina RSI, medias moviles y tendencia general para entregar una recomendacion clara.",
    category: "recommendations",
    targetId: "analysis-summary",
    placement: "bottom",
  },
  {
    id: "confidence",
    title: "La confianza comunica incertidumbre",
    description:
      "El porcentaje ayuda a no presentar el resultado como una verdad absoluta. Es feedback para tomar una decision informada, no una orden financiera.",
    category: "recommendations",
    targetId: "confidence-row",
    placement: "top",
  },
  {
    id: "reasoning",
    title: "Abre el razonamiento antes de decidir",
    description:
      "Este bloque usa progressive disclosure: mantiene la pantalla limpia y permite abrir la explicacion cuando necesitas entender por que se recomienda una accion.",
    category: "recommendations",
    targetId: "reasoning-toggle",
    placement: "top",
  },
  {
    id: "indicators",
    title: "Los indicadores muestran la evidencia",
    description:
      "RSI, media movil de 50 dias, media movil de 200 dias y tendencia general son las piezas que justifican el veredicto. Estan agrupadas para comparar rapido.",
    category: "recommendations",
    targetId: "indicators-section",
    placement: "top",
  },
]

const pageSteps: TutorialStep[] = [
  {
    id: "search-flow",
    title: "Busca o elige una accion popular",
    description:
      "El punto focal inicial es la busqueda. Puedes escribir un simbolo o partir desde las acciones populares para reducir friccion.",
    category: "page",
    targetId: "stock-search",
    placement: "bottom",
  },
  {
    id: "result-card",
    title: "Lee primero el resumen",
    description:
      "La jerarquia visual pone arriba el nombre, precio y veredicto. Asi puedes escanear el resultado antes de entrar al detalle.",
    category: "page",
    targetId: "analysis-summary",
    placement: "bottom",
  },
  {
    id: "support-card",
    title: "Usa la nota educativa como limite",
    description:
      "El cierre recuerda que los datos son apoyo educativo. Es una decision de tono y de seguridad para evitar que el usuario confunda la herramienta con asesoria financiera.",
    category: "page",
    targetId: "education-note",
    placement: "top",
  },
]

export const tutorialStepsByLevel: Record<KnowledgeLevel, TutorialStep[]> = {
  bajo: [...stocksSteps, ...recommendationsSteps, ...pageSteps],
  medio: [...recommendationsSteps, ...pageSteps],
  alto: pageSteps,
}

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
}

export const KNOWLEDGE_PROFILE_STORAGE_KEY = "stocksense-knowledge-profile"
export const TUTORIAL_COMPLETED_STORAGE_KEY = "stocksense-tutorial-completed"
export const TUTORIAL_PROFILE_VERSION = "tutorial-profile-v3"
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
