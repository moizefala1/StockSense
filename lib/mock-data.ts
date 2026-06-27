import type { Stock, AnalysisResult, Verdict, PricePoint } from "@/lib/types"

export const mockStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 182.52 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.8 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 378.91 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.5 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 485.2 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.3 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 195.4 },
]

/**
 * Genera una serie de 30 días de precios que termina exactamente en `endPrice`.
 * La dirección general (sube/baja/lateral) se decide aquí mismo, al azar, en vez
 * de depender de un veredicto externo — porque el veredicto se calcula DESPUÉS,
 * a partir de esta serie, no al revés. Así el gráfico es la única fuente de verdad
 * y todo lo demás (señales, veredicto, valores mostrados) se deriva de él.
 */
function generatePriceHistory(endPrice: number): PricePoint[] {
  const days = 30
  const points: PricePoint[] = []

  // Tendencia general aleatoria: entre -9% y +9% desde hace 30 días hasta hoy.
  const trendBias = (Math.random() - 0.5) * 0.18
  const startPrice = endPrice * (1 - trendBias)

  // Camino aleatorio (random walk) interpolado entre startPrice y endPrice,
  // con ruido día a día para que no sea una línea recta perfecta.
  const rawPrices: number[] = []
  for (let i = 0; i < days; i++) {
    const progress = i / (days - 1)
    const base = startPrice + (endPrice - startPrice) * progress
    const noise = base * (Math.random() - 0.5) * 0.025
    rawPrices.push(base + noise)
  }
  // Forzamos que el último punto sea exactamente el precio actual
  rawPrices[days - 1] = endPrice

  // Medias móviles simples calculadas sobre la propia serie generada
  // (ventanas cortas porque solo tenemos 30 puntos de historia).
  const sma = (arr: number[], idx: number, window: number) => {
    const start = Math.max(0, idx - window + 1)
    const slice = arr.slice(start, idx + 1)
    return slice.reduce((a, b) => a + b, 0) / slice.length
  }

  // RSI real, calculado con la fórmula estándar (ganancia/pérdida promedio) sobre
  // la propia serie de precios — no es un valor inventado aparte, sale de los
  // mismos rawPrices que dibuja el gráfico.
  const rsiSeries: number[] = []
  const period = 14
  for (let i = 0; i < days; i++) {
    if (i < period) {
      // No hay suficiente historia previa todavía: usamos un valor neutral.
      rsiSeries.push(50)
      continue
    }
    let gains = 0
    let losses = 0
    for (let j = i - period + 1; j <= i; j++) {
      const change = rawPrices[j] - rawPrices[j - 1]
      if (change > 0) gains += change
      else losses += Math.abs(change)
    }
    const avgGain = gains / period
    const avgLoss = losses / period
    if (avgLoss === 0) {
      rsiSeries.push(100)
    } else {
      const rs = avgGain / avgLoss
      rsiSeries.push(100 - 100 / (1 + rs))
    }
  }

  const today = new Date()
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - (days - 1 - i))

    const price = rawPrices[i]
    const sma50 = sma(rawPrices, i, 10) // ventana corta porque solo hay 30 puntos
    const sma200 = sma(rawPrices, i, 20)
    const rsi = rsiSeries[i]

    let rsiSignal: Verdict | undefined
    if (rsi < 30) rsiSignal = "comprar"
    else if (rsi > 70) rsiSignal = "vender"

    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      rsi: Math.round(rsi * 10) / 10,
      sma50: Math.round(sma50 * 100) / 100,
      sma200: Math.round(sma200 * 100) / 100,
      rsiSignal,
    })
  }

  return points
}

export function generateMockAnalysis(symbol: string, name: string, price: number): AnalysisResult {
  // 1. Generamos la serie histórica primero. A partir de aquí, todo lo demás
  //    (señales, veredicto, valores que se muestran en pantalla) se LEE de esta
  //    serie en vez de inventarse por separado — así el gráfico y el resto de la
  //    UI nunca pueden contradecirse entre sí.
  const priceHistory = generatePriceHistory(price)
  const latest = priceHistory[priceHistory.length - 1]

  const rsiValue = latest.rsi
  const sma50 = latest.sma50
  const sma200 = latest.sma200

  const rsiSignal: Verdict = rsiValue < 30 ? "comprar" : rsiValue > 70 ? "vender" : "mantener"
  const sma50Signal: Verdict = price > sma50 * 1.01 ? "comprar" : price < sma50 * 0.99 ? "vender" : "mantener"
  const sma200Signal: Verdict = price > sma200 * 1.01 ? "comprar" : price < sma200 * 0.99 ? "vender" : "mantener"

  // La tendencia general también se deriva de la propia serie: comparamos el
  // precio de hace 30 días contra el actual, en vez de elegirla al azar aparte.
  const priceChangePercent =
    Math.round(((latest.price - priceHistory[0].price) / priceHistory[0].price) * 1000) / 10
  const trendValue = priceChangePercent > 1.5 ? "Alcista" : priceChangePercent < -1.5 ? "Bajista" : "Lateral"
  const trendSignal: Verdict =
    trendValue === "Alcista" ? "comprar" : trendValue === "Bajista" ? "vender" : "mantener"

  const signals = [rsiSignal, sma50Signal, sma200Signal, trendSignal]
  const buyCount = signals.filter((s) => s === "comprar").length
  const sellCount = signals.filter((s) => s === "vender").length

  let verdict: Verdict = "mantener"
  let confidence = 50

  if (buyCount >= 3) {
    verdict = "comprar"
    confidence = 70 + buyCount * 5
  } else if (sellCount >= 3) {
    verdict = "vender"
    confidence = 70 + sellCount * 5
  } else if (buyCount > sellCount) {
    verdict = "comprar"
    confidence = 55 + buyCount * 5
  } else if (sellCount > buyCount) {
    verdict = "vender"
    confidence = 55 + sellCount * 5
  }

  const reasonings: Record<Verdict, string> = {
    comprar:
      "Los indicadores técnicos sugieren una oportunidad de compra. El RSI indica que la acción no está sobrecomprada, y el precio se mantiene por encima de las medias móviles clave, lo que sugiere momentum positivo.",
    mantener:
      "Los indicadores muestran señales mixtas. El precio se encuentra en una zona de consolidación. Se recomienda mantener la posición actual y esperar señales más claras antes de tomar acción.",
    vender:
      "Los indicadores técnicos sugieren precaución. El RSI indica posible sobrecompra, y el precio muestra debilidad respecto a las medias móviles. Considere asegurar ganancias o reducir exposición.",
  }

  return {
    symbol,
    name,
    price,
    verdict,
    confidence,
    indicators: {
      rsi: {
        value: rsiValue,
        signal: rsiSignal,
        description:
          rsiValue < 30
            ? "El RSI bajo indica que la acción puede estar sobrevendida y podría existir una oportunidad de compra."
            : rsiValue > 70
              ? "El RSI alto indica que la acción puede estar sobrecomprada y sugiere precaución."
              : "El RSI está en zona neutral y no muestra señales extremas.",
      },
      sma50: {
        value: sma50,
        signal: sma50Signal,
        description:
          price > sma50
            ? "El precio está por encima de la media de 50 días, lo que sugiere una tendencia positiva de corto plazo."
            : "El precio está por debajo de la media de 50 días, lo que sugiere una tendencia negativa de corto plazo.",
      },
      sma200: {
        value: sma200,
        signal: sma200Signal,
        description:
          price > sma200
            ? "El precio está por encima de la media de 200 días, lo que sugiere una tendencia positiva de largo plazo."
            : "El precio está por debajo de la media de 200 días, lo que sugiere una tendencia negativa de largo plazo.",
      },
      trend: {
        value: trendValue,
        signal: trendSignal,
        description:
          trendValue === "Alcista"
            ? "La tendencia general es alcista y el precio tiende a subir."
            : trendValue === "Bajista"
              ? "La tendencia general es bajista y el precio tiende a bajar."
              : "La tendencia es lateral y el precio se mueve sin una dirección clara.",
      },
    },
    reasoning: reasonings[verdict],
    priceHistory,
    priceChangePercent,
  }
}