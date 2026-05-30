import type { Stock, AnalysisResult, Verdict } from "@/lib/types"

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

export function generateMockAnalysis(symbol: string, name: string, price: number): AnalysisResult {
  const rsiValue = Math.floor(Math.random() * 60) + 20
  const sma50 = price * (0.9 + Math.random() * 0.2)
  const sma200 = price * (0.85 + Math.random() * 0.3)

  const rsiSignal: Verdict = rsiValue < 30 ? "comprar" : rsiValue > 70 ? "vender" : "mantener"
  const sma50Signal: Verdict = price > sma50 ? "comprar" : price < sma50 * 0.95 ? "vender" : "mantener"
  const sma200Signal: Verdict = price > sma200 ? "comprar" : price < sma200 * 0.95 ? "vender" : "mantener"

  const trends = ["Alcista", "Bajista", "Lateral"]
  const trendValue = trends[Math.floor(Math.random() * 3)]
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
  }
}
