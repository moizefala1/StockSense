import type { IndicatorKey, KnowledgeLevel } from "@/lib/types"

export interface IndicatorExplainerContent {
  title: string
  shortLabel: string
  /** Texto en lenguaje llano, sin jerga, para knowledge === "no-sabe" */
  simple: string
  /** Explicación técnica con la fórmula/cálculo real, para knowledge === "sabe" */
  technical: string
  /** Fórmula matemática mostrada como texto monoespaciado, solo nivel técnico */
  formula: string
}

export const indicatorExplainers: Record<IndicatorKey, IndicatorExplainerContent> = {
  rsi: {
    title: "RSI · Índice de Fuerza Relativa",
    shortLabel: "RSI",
    simple:
      "El RSI mide qué tan \"caliente\" o \"fría\" está una acción comparando lo rápido que subió contra lo rápido que bajó en los últimos días. Cuando el número es muy bajo, la acción pudo haber bajado demasiado rápido y podría estar lista para recuperarse. Cuando es muy alto, pudo haber subido demasiado rápido y podría venir una corrección.",
    technical:
      "El RSI (Relative Strength Index) es un oscilador de momentum que mide la velocidad y magnitud de los movimientos de precio en una escala de 0 a 100, calculado típicamente sobre una ventana de 14 períodos. Se considera zona de sobreventa por debajo de 30 (posible señal de compra) y zona de sobrecompra por encima de 70 (posible señal de venta). Se calcula a partir del promedio de ganancias y pérdidas en el período.",
    formula: "RSI = 100 − [100 / (1 + RS)]\nRS = Promedio de ganancias / Promedio de pérdidas (período de 14 días)",
  },
  sma50: {
    title: "Media Móvil de 50 días",
    shortLabel: "SMA 50d",
    simple:
      "Es el precio promedio de la acción durante los últimos 50 días, como una línea suave que ignora los saltos diarios y muestra hacia dónde va la tendencia reciente. Si el precio actual está por encima de esta línea, suele ser una buena señal de corto plazo. Si está por debajo, es una señal de precaución.",
    technical:
      "La SMA50 (Simple Moving Average de 50 días) suaviza el ruido de corto plazo promediando el precio de cierre de los últimos 50 períodos. Se usa para identificar la tendencia de corto/mediano plazo. El precio cruzando por encima de la SMA50 suele interpretarse como señal alcista; por debajo, como señal bajista.",
    formula: "SMA50 = (P₁ + P₂ + ... + P₅₀) / 50\ndonde P son los precios de cierre de los últimos 50 días",
  },
  sma200: {
    title: "Media Móvil de 200 días",
    shortLabel: "SMA 200d",
    simple:
      "Igual que la media de 50 días, pero mirando mucho más atrás en el tiempo: los últimos 200 días. Esto la hace más lenta para reaccionar, pero más confiable para saber si la acción está sólida a largo plazo. Es la línea que más le importa a alguien que prefiere no tomar riesgos innecesarios.",
    technical:
      "La SMA200 (Simple Moving Average de 200 días) es el estándar de la industria para evaluar la tendencia de largo plazo de un activo. Al promediar un período tan extenso, filtra prácticamente todo el ruido de corto plazo. El cruce del precio por encima de la SMA200 (o un cruce dorado SMA50/SMA200) se interpreta como confirmación de tendencia alcista de largo plazo.",
    formula: "SMA200 = (P₁ + P₂ + ... + P₂₀₀) / 200\ndonde P son los precios de cierre de los últimos 200 días",
  },
}

export function getIndicatorText(key: IndicatorKey, knowledge: KnowledgeLevel) {
  const content = indicatorExplainers[key]
  return knowledge === "sabe" ? content.technical : content.simple
}