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
    description: "Quiero entender qué es una acción y cómo interpretar las recomendaciones.",
  },
  {
    level: "medio",
    title: "Ya conozco lo básico",
    description: "Entiendo qué es una inversión, pero quiero aprender a interpretar las recomendaciones.",
  },
  {
    level: "alto",
    title: "Tengo experiencia",
    description: "Conozco de inversiones y quiero entender cómo usar la plataforma.",
  },
]

const stocksSteps: TutorialStep[] = [
  {
    id: "stock-basics",
    section: "Bloque 1 · Qué estás analizando",
    phase: "concepto",
    title: "Primero entiende el objeto de la clase",
    description:
      "Antes de leer una recomendación, necesitas saber qué elemento estás evaluando.",
    category: "stocks",
    targetId: "stock-search",
    placement: "bottom",
    problem:
      "Si partes directo por Comprar o Vender, la recomendación se siente como una respuesta mágica.",
    concept:
      "Una acción representa una participación en una empresa. En StockSense la buscas por símbolo, como AAPL o MSFT.",
    example:
      "AAPL no es solo un código: es Apple Inc. La clase usará ese ejemplo para conectar empresa, precio y señales.",
    practice:
      "Antes de avanzar, ubica mentalmente dos datos: el símbolo de la acción y el nombre de la empresa.",
    takeaway:
      "Esto sirve para que cada análisis tenga contexto y no parezca una apuesta aislada.",
  },
  {
    id: "stock-price",
    section: "Bloque 1 · Qué estás analizando",
    phase: "problema",
    title: "El precio solo no alcanza",
    description:
      "El precio es importante, pero no responde por sí solo si conviene comprar, mantener o vender.",
    category: "stocks",
    targetId: "analysis-summary",
    placement: "bottom",
    problem:
      "Sin contexto, un precio alto puede parecer caro y un precio bajo puede parecer oportunidad, aunque no siempre sea así.",
    concept:
      "StockSense combina precio, tendencia e indicadores para transformar un dato suelto en una lectura más útil.",
    example:
      "Si AAPL vale $182.52, todavía falta preguntar: ¿sube con fuerza?, ¿está sobre sus medias?, ¿el RSI muestra exceso?",
    warning:
      "Evita decidir solo por el precio actual. Úsalo como punto de partida, no como conclusión.",
    takeaway:
      "Usa el precio cuando quieras orientarte; usa los indicadores cuando quieras justificar una decisión.",
  },
]

const recommendationsSteps: TutorialStep[] = [
  {
    id: "verdict",
    section: "Bloque 3 · Recomendaciones",
    phase: "concepto",
    title: "El veredicto es el resumen, no la explicación completa",
    description:
      "La tarjeta principal reduce varias señales a una recomendación clara para bajar la carga cognitiva.",
    category: "recommendations",
    targetId: "analysis-summary",
    placement: "bottom",
    problem:
      "Cuando una plataforma muestra demasiados números a la vez, el usuario termina leyendo todo y entendiendo poco.",
    concept:
      "Comprar, Mantener o Vender sintetiza RSI, medias móviles y tendencia. Es una puerta de entrada, no una orden financiera.",
    example:
      "Sin resumen: cuatro indicadores dispersos. Con resumen: primero ves Comprar, después revisas por qué.",
    practice:
      "Mira el veredicto y pregúntate: ¿qué evidencia debería revisar antes de confiar en él?",
    takeaway:
      "Úsalo para orientarte rápido; confirma siempre con confianza, razonamiento e indicadores.",
  },
  {
    id: "confidence",
    section: "Bloque 3 · Recomendaciones",
    phase: "advertencia",
    title: "La confianza evita falsas certezas",
    description:
      "El porcentaje enseña cuánta fuerza tiene la recomendación y recuerda que el mercado sigue siendo incierto.",
    category: "recommendations",
    targetId: "confidence-row",
    placement: "top",
    problem:
      "Una recomendación sin nivel de confianza puede sonar absoluta, aunque esté basada en señales imperfectas.",
    concept:
      "La confianza comunica incertidumbre. No dice que algo va a pasar; dice qué tan coherentes están las señales del análisis.",
    example:
      "Comprar con 85% se interpreta distinto a Comprar con 52%. El texto es el mismo, pero la fuerza del respaldo cambia.",
    warning:
      "No confundas confianza con garantía. Es apoyo para decidir mejor, no predicción segura.",
    takeaway:
      "Úsala cuando necesites medir cuánto peso darle al veredicto.",
  },
  {
    id: "reasoning",
    section: "Bloque 4 · Explicación progresiva",
    phase: "ejemplo",
    title: "El razonamiento aparece cuando lo necesitas",
    description:
      "La explicación no compite con el resumen: se revela cuando quieres profundizar.",
    category: "recommendations",
    targetId: "reasoning-toggle",
    placement: "top",
    problem:
      "Mostrar todo el razonamiento desde el inicio vuelve la pantalla densa y hace que lo importante pierda jerarquía.",
    concept:
      "Esto es progressive disclosure: primero ves lo esencial; luego abres el detalle si necesitas más contexto.",
    example:
      "Sin esto: un párrafo largo debajo del veredicto. Con esto: una pregunta clara, ¿por qué esta recomendación?",
    practice:
      "Antes de avanzar, abre el razonamiento y busca qué señales justifican el resultado.",
    solution:
      "La solución esperada es encontrar una cadena: precio sobre medias, RSI sin exceso y tendencia alineada.",
    takeaway:
      "Úsalo cuando el veredicto te interese, pero todavía no sepas si confiar en él.",
  },
  {
    id: "indicators",
    section: "Bloque 5 · Evidencia",
    phase: "practica",
    title: "Los indicadores son la evidencia de la clase",
    description:
      "Esta sección convierte la recomendación en algo verificable: puedes mirar las señales que la sostienen.",
    category: "recommendations",
    targetId: "indicators-section",
    placement: "top",
    problem:
      "Si solo ves el veredicto, aprendes poco. Si ves la evidencia, entiendes el patrón detrás de la recomendación.",
    concept:
      "RSI, medias móviles y tendencia cumplen roles distintos: fuerza, dirección y contexto temporal.",
    example:
      "Problema/solución: RSI neutral + precio sobre medias + tendencia alcista explica mejor un Comprar que una sola métrica aislada.",
    practice:
      "Ejercicio: compara dos señales. ¿Apuntan en la misma dirección o se contradicen?",
    solution:
      "Si varias señales coinciden, la recomendación gana respaldo. Si chocan, conviene ser más prudente.",
    takeaway:
      "Usa esta sección cuando quieras pasar de aceptar una recomendación a entenderla.",
  },
]

const pageSteps: TutorialStep[] = [
  {
    id: "analysis-intro",
    section: "Bloque 2 · Recorrido cognitivo",
    phase: "inicio",
    title: "La página sigue un recorrido de clase",
    description:
      "Qué veremos ahora: buscar una acción, leer el resumen, revisar la evidencia y cerrar con límites de uso.",
    category: "page",
    targetId: "stock-search",
    placement: "bottom",
    problem:
      "El problema real es que invertir suele sentirse como saltar entre datos sin orden.",
    concept:
      "StockSense organiza la página como un recorrido cognitivo: entrada clara, resultado visible, detalle progresivo y cierre seguro.",
    example:
      "Ruta de clase: buscar AAPL → leer Comprar/Mantener/Vender → abrir el porqué → contrastar indicadores.",
    takeaway:
      "Esto sirve para que sepas siempre cuál es el siguiente paso razonable.",
  },
  {
    id: "search-flow",
    section: "Bloque 2 · Recorrido cognitivo",
    phase: "ejemplo",
    title: "El buscador es el punto de partida",
    description:
      "La primera acción de la clase es simple: elegir qué empresa quieres analizar.",
    category: "page",
    targetId: "stock-search",
    placement: "bottom",
    problem:
      "Si la página empieza mostrando demasiadas opciones, la persona no sabe dónde actuar primero.",
    concept:
      "Un buen affordance hace evidente la acción disponible. Aquí la acción principal es buscar por símbolo o elegir una acción popular.",
    example:
      "Opción A: escribir AAPL. Opción B: partir desde una acción popular si no recuerdas el símbolo.",
    practice:
      "Ejercicio: identifica cuál sería tu primera acción si quisieras analizar Apple.",
    solution:
      "La respuesta esperada es usar el buscador o seleccionar AAPL desde una lista sugerida.",
    takeaway:
      "Úsalo cuando ya tengas una empresa en mente o quieras explorar una alternativa conocida.",
  },
  {
    id: "result-card",
    section: "Bloque 2 · Recorrido cognitivo",
    phase: "solucion",
    title: "Primero lee el resumen, después profundiza",
    description:
      "La jerarquía visual evita que tengas que descifrar toda la pantalla a la vez.",
    category: "page",
    targetId: "analysis-summary",
    placement: "bottom",
    problem:
      "Sin jerarquía, todos los datos parecen igual de importantes y aumenta la confusión.",
    concept:
      "La tarjeta resume identidad, precio, veredicto y confianza. Es la vista general de la situación.",
    example:
      "Sin esto: buscarías el dato clave entre varias tarjetas. Con esto: empiezas por una conclusión visible.",
    takeaway:
      "Úsalo como mapa rápido antes de revisar el razonamiento y la evidencia.",
  },
  {
    id: "support-card",
    section: "Bloque 6 · Cierre seguro",
    phase: "advertencia",
    title: "Cierra cada análisis con su límite",
    description:
      "Una buena clase no solo enseña qué mirar; también enseña qué no concluir de más.",
    category: "page",
    targetId: "education-note",
    placement: "top",
    problem:
      "Si una interfaz financiera suena demasiado segura, puede empujar decisiones apresuradas.",
    concept:
      "La nota educativa pone el marco correcto: los indicadores apoyan la investigación, pero no garantizan resultados.",
    warning:
      "No uses StockSense como única base para invertir. Contrasta con contexto, objetivos personales y riesgo.",
    takeaway:
      "Esto sirve para mantener el tutorial responsable y la decisión final en manos del usuario.",
  },
]

export const homeTutorialSteps: TutorialStep[] = [
  {
    id: "home-intro",
    section: "Inicio claro",
    phase: "inicio",
    title: "Clase guiada: de duda a decisión",
    description:
      "Qué veremos: cómo StockSense transforma una acción en una recomendación clara y cómo revisar la evidencia antes de decidir.",
    category: "page",
    targetId: "home-hero",
    placement: "bottom",
    problem:
      "El problema real es la sobrecarga: muchos datos, poca claridad y miedo a interpretar mal una señal.",
    concept:
      "El tutorial funcionará como una clase breve: problema, concepto, ejemplo visual, práctica guiada y resumen.",
    example:
      "Caso de clase: partiremos desde la idea de analizar una acción y luego iremos a la página Analizar.",
    takeaway:
      "Al terminar esta introducción, pasaremos automáticamente al recorrido práctico.",
  },
]

const summarySteps: TutorialStep[] = [
  {
    id: "tutorial-summary",
    section: "Resumen final",
    phase: "resumen",
    title: "Cheatsheet para usar StockSense",
    description:
      "Cierra el recorrido con una secuencia simple para repetir cada vez que analices una acción.",
    category: "page",
    targetId: "analysis-summary",
    placement: "bottom",
    concept:
      "Qué veremos → por qué importa → definición corta → ejemplo → errores comunes → práctica → solución → resumen.",
    example:
      "En la página: busca la acción → lee el veredicto → revisa confianza → abre el razonamiento → compara indicadores → recuerda el límite educativo.",
    practice:
      "La próxima vez que uses la página, intenta explicar en una frase por qué el veredicto tiene sentido.",
    solution:
      "Una buena respuesta menciona al menos dos evidencias, por ejemplo tendencia y medias móviles, no solo el color del veredicto.",
    takeaway:
      "Úsalo cuando quieras decidir con más claridad, no cuando busques una garantía automática.",
  },
]

export const tutorialStepsByLevel: Record<KnowledgeLevel, TutorialStep[]> = {
  bajo: [...stocksSteps, ...pageSteps, ...recommendationsSteps, ...summarySteps],
  medio: [...pageSteps, ...recommendationsSteps, ...summarySteps],
  alto: [...pageSteps, ...summarySteps],
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
