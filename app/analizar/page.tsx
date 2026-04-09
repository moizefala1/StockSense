"use client"

import { useState } from "react"
import { Search, TrendingUp, TrendingDown, Minus, Info, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Mock data for demonstration
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 182.52 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.8 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 378.91 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.5 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 485.2 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.3 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 195.4 },
]

type Verdict = "comprar" | "mantener" | "vender"

interface AnalysisResult {
  symbol: string
  name: string
  price: number
  verdict: Verdict
  confidence: number
  indicators: {
    rsi: { value: number; signal: Verdict; description: string }
    sma50: { value: number; signal: Verdict; description: string }
    sma200: { value: number; signal: Verdict; description: string }
    trend: { value: string; signal: Verdict; description: string }
  }
  reasoning: string
}

function generateMockAnalysis(symbol: string, name: string, price: number): AnalysisResult {
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

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const config = {
    comprar: {
      icon: TrendingUp,
      label: "Comprar",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    mantener: {
      icon: Minus,
      label: "Mantener",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    vender: {
      icon: TrendingDown,
      label: "Vender",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    },
  }

  const { icon: Icon, label, className } = config[verdict]

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold", className)}>
      <Icon className="h-5 w-5" />
      {label}
    </div>
  )
}

function IndicatorCard({
  title,
  value,
  signal,
  description,
  tooltip,
}: {
  title: string
  value: string | number
  signal: Verdict
  description: string
  tooltip: string
}) {
  const signalColors = {
    comprar: "text-emerald-700",
    mantener: "text-amber-700",
    vender: "text-rose-700",
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex">
                    <Info className="h-4 w-4 text-slate-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <p className="mt-2 text-2xl font-bold text-[#203268]">
          {typeof value === "number" ? value.toFixed(2) : value}
        </p>

        <p className={cn("mt-2 text-sm leading-relaxed", signalColors[signal])}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export default function AnalizarPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState<(typeof mockStocks)[0] | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const filteredStocks = mockStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAnalyze = async (stock: (typeof mockStocks)[0]) => {
    setSelectedStock(stock)
    setIsAnalyzing(true)
    setAnalysis(null)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const result = generateMockAnalysis(stock.symbol, stock.name, stock.price)
    setAnalysis(result)
    setIsAnalyzing(false)
  }

  const handleReanalyze = () => {
    if (selectedStock) {
      handleAnalyze(selectedStock)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f8]">
      <Header />

        <main className="flex-1 px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="relative mx-auto mb-12 max-w-3xl pt-8">
            <div className="relative rounded-[2rem] border-[5px] border-[oklch(0.14_0.03_265_/_0.22)] bg-[var(--primary)] px-4 pb-5 pt-12 shadow-[inset_0_0_52px_oklch(0.14_0.03_265_/_0.12),inset_0_-16px_30px_oklch(0.12_0.025_265_/_0.14),inset_0_12px_24px_oklch(0.16_0.03_265_/_0.07)] sm:px-6 sm:pb-6 sm:pt-12">
              <div className="relative z-20 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--background)] [text-shadow:0_1px_0_rgba(0,0,0,0.22),1px_0_0_rgba(0,0,0,0.08),0_-1px_0_rgba(255,255,255,0.10)] sm:text-4xl">
                  Analiza cualquier acción
                </h1>
                <p className="mx-auto mt-2 max-w-2xl text-sm text-[var(--secondary)] sm:text-base">
                  Selecciona una acción y recibe un veredicto claro basado en indicadores técnicos
                </p>
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:p-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Buscar por símbolo o nombre (ej: AAPL, Apple)"
                    className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-[#2bc8d1]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {searchQuery ? (
                  <div className="mt-4 space-y-2">
                    {filteredStocks.length > 0 ? (
                      filteredStocks.map((stock) => (
                        <button
                          key={stock.symbol}
                          className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition-colors hover:bg-slate-50"
                          onClick={() => handleAnalyze(stock)}
                        >
                          <div className="min-w-0">
                            <span className="font-semibold text-[#203268]">{stock.symbol}</span>
                            <span className="ml-2 text-slate-500">{stock.name}</span>
                          </div>

                          <div className="ml-4 flex items-center gap-2">
                            <span className="font-medium text-[#203268]">${stock.price.toFixed(2)}</span>
                            <ArrowRight className="h-4 w-4 text-slate-400" />
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="py-4 text-center text-sm text-slate-500">
                        No se encontraron acciones con ese criterio
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-5">
                    <p className="mb-3 text-sm text-slate-500">Acciones populares:</p>
                    <div className="flex flex-wrap gap-2">
                      {mockStocks.slice(0, 5).map((stock) => (
                        <button
                          key={stock.symbol}
                          onClick={() => handleAnalyze(stock)}
                          className="rounded-full border border-[#d7dfef] bg-[#f3f6fc] px-4 py-2 text-sm font-medium text-[#203268] transition hover:bg-[#eaf0fb]"
                        >
                          {stock.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {isAnalyzing && (
            <Card className="mx-auto max-w-3xl border-slate-200 shadow-sm">
              <CardContent className="py-12 text-center">
                <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#2bc8d1]" />
                <p className="mt-4 text-lg font-medium text-[#203268]">
                  Analizando {selectedStock?.symbol}...
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Calculando indicadores técnicos
                </p>
              </CardContent>
            </Card>
          )}

          {analysis && !isAnalyzing && (
            <div className="mx-auto max-w-3xl space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardDescription className="text-slate-500">Resultado del análisis</CardDescription>
                      <CardTitle className="text-2xl text-[#203268]">
                        {analysis.symbol} - {analysis.name}
                      </CardTitle>
                      <p className="mt-1 text-xl font-semibold text-slate-500">
                        ${analysis.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <VerdictBadge verdict={analysis.verdict} />
                      <p className="text-sm text-slate-500">Confianza: {analysis.confidence}%</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm leading-relaxed text-slate-700">{analysis.reasoning}</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReanalyze}
                      className="border-slate-200 text-[#203268]"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Actualizar análisis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-[#203268]">Indicadores técnicos</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <IndicatorCard
                    title="RSI (14 días)"
                    value={analysis.indicators.rsi.value}
                    signal={analysis.indicators.rsi.signal}
                    description={analysis.indicators.rsi.description}
                    tooltip="El RSI mide la velocidad y el cambio de los movimientos de precio. Bajo 30 puede sugerir sobreventa y sobre 70 puede sugerir sobrecompra."
                  />

                  <IndicatorCard
                    title="Media Móvil 50 días"
                    value={`$${analysis.indicators.sma50.value.toFixed(2)}`}
                    signal={analysis.indicators.sma50.signal}
                    description={analysis.indicators.sma50.description}
                    tooltip="La media móvil de 50 días representa la tendencia de corto plazo. Estar por encima suele interpretarse como una señal positiva."
                  />

                  <IndicatorCard
                    title="Media Móvil 200 días"
                    value={`$${analysis.indicators.sma200.value.toFixed(2)}`}
                    signal={analysis.indicators.sma200.signal}
                    description={analysis.indicators.sma200.description}
                    tooltip="La media móvil de 200 días representa la tendencia de largo plazo. Estar por encima suele interpretarse como una señal alcista."
                  />

                  <IndicatorCard
                    title="Tendencia General"
                    value={analysis.indicators.trend.value}
                    signal={analysis.indicators.trend.signal}
                    description={analysis.indicators.trend.description}
                    tooltip="La tendencia general se estima observando la dirección predominante del precio durante las últimas semanas."
                  />
                </div>
              </div>

              <Card className="border-[#2bc8d1]/20 bg-[#2bc8d1]/5 shadow-sm">
                <CardContent className="py-6">
                  <div className="flex gap-4">
                    <Info className="h-6 w-6 flex-shrink-0 text-[#2bc8d1]" />
                    <div>
                      <h3 className="font-semibold text-[#203268]">¿Qué significan estos indicadores?</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        Estos indicadores técnicos analizan patrones históricos de precio y volumen.
                        Aunque son herramientas útiles, el mercado sigue siendo incierto y ningún
                        indicador garantiza resultados. Usa esta información como apoyo para tu
                        investigación y no como única base para decidir.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}