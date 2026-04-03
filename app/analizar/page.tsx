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
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 378.91 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.25 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.50 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 485.20 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.30 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 195.40 },
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
  // Generate somewhat realistic mock data
  const rsiValue = Math.floor(Math.random() * 60) + 20 // 20-80
  const sma50 = price * (0.9 + Math.random() * 0.2) // ±10% of price
  const sma200 = price * (0.85 + Math.random() * 0.3) // ±15% of price
  
  const rsiSignal: Verdict = rsiValue < 30 ? "comprar" : rsiValue > 70 ? "vender" : "mantener"
  const sma50Signal: Verdict = price > sma50 ? "comprar" : price < sma50 * 0.95 ? "vender" : "mantener"
  const sma200Signal: Verdict = price > sma200 ? "comprar" : price < sma200 * 0.95 ? "vender" : "mantener"
  
  const trends = ["Alcista", "Bajista", "Lateral"]
  const trendValue = trends[Math.floor(Math.random() * 3)]
  const trendSignal: Verdict = trendValue === "Alcista" ? "comprar" : trendValue === "Bajista" ? "vender" : "mantener"
  
  // Calculate overall verdict based on indicators
  const signals = [rsiSignal, sma50Signal, sma200Signal, trendSignal]
  const buyCount = signals.filter(s => s === "comprar").length
  const sellCount = signals.filter(s => s === "vender").length
  
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
    comprar: `Los indicadores técnicos sugieren una oportunidad de compra. El RSI indica que la acción no está sobrecomprada, y el precio se mantiene por encima de las medias móviles clave, lo que sugiere momentum positivo.`,
    mantener: `Los indicadores muestran señales mixtas. El precio se encuentra en una zona de consolidación. Se recomienda mantener la posición actual y esperar señales más claras antes de tomar acción.`,
    vender: `Los indicadores técnicos sugieren precaución. El RSI indica posible sobrecompra, y el precio muestra debilidad respecto a las medias móviles. Considere asegurar ganancias o reducir exposición.`
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
        description: rsiValue < 30 
          ? "El RSI bajo indica que la acción puede estar sobrevendida - posible oportunidad de compra."
          : rsiValue > 70 
            ? "El RSI alto indica que la acción puede estar sobrecomprada - señal de precaución."
            : "El RSI está en zona neutral - no hay señales extremas."
      },
      sma50: {
        value: sma50,
        signal: sma50Signal,
        description: price > sma50 
          ? "El precio está por encima de la media de 50 días - tendencia de corto plazo positiva."
          : "El precio está por debajo de la media de 50 días - tendencia de corto plazo negativa."
      },
      sma200: {
        value: sma200,
        signal: sma200Signal,
        description: price > sma200 
          ? "El precio está por encima de la media de 200 días - tendencia de largo plazo positiva."
          : "El precio está por debajo de la media de 200 días - tendencia de largo plazo negativa."
      },
      trend: {
        value: trendValue,
        signal: trendSignal,
        description: trendValue === "Alcista" 
          ? "La tendencia general es alcista - el precio tiende a subir."
          : trendValue === "Bajista"
            ? "La tendencia general es bajista - el precio tiende a bajar."
            : "La tendencia es lateral - el precio se mueve sin dirección clara."
      }
    },
    reasoning: reasonings[verdict]
  }
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const config = {
    comprar: { 
      icon: TrendingUp, 
      label: "Comprar", 
      className: "bg-success/10 text-success border-success/20" 
    },
    mantener: { 
      icon: Minus, 
      label: "Mantener", 
      className: "bg-warning/10 text-warning border-warning/20" 
    },
    vender: { 
      icon: TrendingDown, 
      label: "Vender", 
      className: "bg-danger/10 text-danger border-danger/20" 
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
  tooltip 
}: { 
  title: string
  value: string | number
  signal: Verdict
  description: string
  tooltip: string
}) {
  const signalColors = {
    comprar: "text-success",
    mantener: "text-warning",
    vender: "text-danger"
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground/50" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold">
          {typeof value === "number" ? value.toFixed(2) : value}
        </p>
        <p className={cn("mt-1 text-sm", signalColors[signal])}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export default function AnalizarPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState<typeof mockStocks[0] | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const filteredStocks = mockStocks.filter(
    stock => 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleAnalyze = async (stock: typeof mockStocks[0]) => {
    setSelectedStock(stock)
    setIsAnalyzing(true)
    setAnalysis(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
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
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Search Section */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Analiza cualquier acción
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Selecciona una acción y recibe un veredicto claro basado en indicadores técnicos
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por símbolo o nombre (ej: AAPL, Apple)"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {searchQuery && (
                <div className="mt-4 space-y-2">
                  {filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                      <button
                        key={stock.symbol}
                        className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary"
                        onClick={() => handleAnalyze(stock)}
                      >
                        <div>
                          <span className="font-semibold">{stock.symbol}</span>
                          <span className="ml-2 text-muted-foreground">{stock.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${stock.price.toFixed(2)}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="py-4 text-center text-muted-foreground">
                      No se encontraron acciones con ese criterio
                    </p>
                  )}
                </div>
              )}
              
              {!searchQuery && (
                <div className="mt-6">
                  <p className="mb-3 text-sm text-muted-foreground">Acciones populares:</p>
                  <div className="flex flex-wrap gap-2">
                    {mockStocks.slice(0, 5).map((stock) => (
                      <Button
                        key={stock.symbol}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAnalyze(stock)}
                      >
                        {stock.symbol}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Analysis Loading State */}
          {isAnalyzing && (
            <Card className="animate-pulse">
              <CardContent className="py-12 text-center">
                <RefreshCw className="mx-auto h-8 w-8 animate-spin text-accent" />
                <p className="mt-4 text-lg font-medium">Analizando {selectedStock?.symbol}...</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Calculando indicadores técnicos
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Analysis Result */}
          {analysis && !isAnalyzing && (
            <div className="space-y-6">
              {/* Main Verdict Card */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardDescription>Resultado del análisis</CardDescription>
                      <CardTitle className="text-2xl">
                        {analysis.symbol} - {analysis.name}
                      </CardTitle>
                      <p className="mt-1 text-xl font-semibold text-muted-foreground">
                        ${analysis.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <VerdictBadge verdict={analysis.verdict} />
                      <p className="text-sm text-muted-foreground">
                        Confianza: {analysis.confidence}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-sm leading-relaxed">{analysis.reasoning}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleReanalyze}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Actualizar análisis
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Indicators Grid */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">Indicadores técnicos</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <IndicatorCard
                    title="RSI (14 días)"
                    value={analysis.indicators.rsi.value}
                    signal={analysis.indicators.rsi.signal}
                    description={analysis.indicators.rsi.description}
                    tooltip="El RSI (Relative Strength Index) mide la velocidad y cambio de los movimientos de precio. Valores bajo 30 sugieren sobreventa (posible compra), sobre 70 sugieren sobrecompra (posible venta)."
                  />
                  <IndicatorCard
                    title="Media Móvil 50 días"
                    value={`$${analysis.indicators.sma50.value.toFixed(2)}`}
                    signal={analysis.indicators.sma50.signal}
                    description={analysis.indicators.sma50.description}
                    tooltip="La media móvil de 50 días muestra el precio promedio de los últimos 50 días. Si el precio actual está por encima, sugiere tendencia positiva a corto plazo."
                  />
                  <IndicatorCard
                    title="Media Móvil 200 días"
                    value={`$${analysis.indicators.sma200.value.toFixed(2)}`}
                    signal={analysis.indicators.sma200.signal}
                    description={analysis.indicators.sma200.description}
                    tooltip="La media móvil de 200 días indica la tendencia de largo plazo. Estar por encima de esta media es generalmente considerado una señal alcista."
                  />
                  <IndicatorCard
                    title="Tendencia General"
                    value={analysis.indicators.trend.value}
                    signal={analysis.indicators.trend.signal}
                    description={analysis.indicators.trend.description}
                    tooltip="La tendencia general se determina analizando la dirección predominante del precio en las últimas semanas."
                  />
                </div>
              </div>
              
              {/* Educational Note */}
              <Card className="border-accent/20 bg-accent/5">
                <CardContent className="py-6">
                  <div className="flex gap-4">
                    <Info className="h-6 w-6 flex-shrink-0 text-accent" />
                    <div>
                      <h3 className="font-semibold text-accent">¿Qué significan estos indicadores?</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Estos indicadores técnicos analizan patrones históricos de precio y volumen. 
                        Aunque son herramientas útiles, recuerda que el mercado es impredecible y 
                        ningún indicador garantiza resultados. Usa esta información como parte de 
                        tu investigación, no como única fuente de decisión.
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
