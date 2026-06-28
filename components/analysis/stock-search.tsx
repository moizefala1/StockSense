import { Search, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { mockStocks } from "@/lib/mock-data"
import type { AnalysisResult, Stock } from "@/lib/types"

interface StockSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  isAnalyzing: boolean
  filteredStocks: Stock[]
  analysis: AnalysisResult | null
  onAnalyze: (stock: Stock) => void
}

export function StockSearch({
  searchQuery,
  onSearchChange,
  isAnalyzing,
  filteredStocks,
  analysis,
  onAnalyze,
}: StockSearchProps) {
  return (
    <section className="relative mx-auto mb-12 max-w-3xl pt-8" data-tutorial-id="stock-search">
      <div
        className="relative rounded-[2rem] border-[5px] border-border bg-primary px-4 pb-5 pt-12 shadow-[inset_0_0_52px_oklch(0.14_0.03_265_/_0.12),inset_0_-16px_30px_oklch(0.12_0.025_265_/_0.14),inset_0_12px_24px_oklch(0.16_0.03_265_/_0.07)] sm:px-6 sm:pb-6 sm:pt-12"
        data-tutorial-id="stock-search-panel"
      >
        <div className="relative z-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-background [text-shadow:0_1px_0_rgba(0,0,0,0.22),1px_0_0_rgba(0,0,0,0.08),0_-1px_0_rgba(255,255,255,0.10)] sm:text-4xl">
            Analiza cualquier acción
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-secondary sm:text-base">
            Selecciona una acción y recibe un veredicto claro basado en indicadores técnicos
          </p>
        </div>

        <div
          className="mt-8 rounded-[1.75rem] border border-border bg-card p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:p-5"
          data-tutorial-id="stock-search-controls"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Buscar por símbolo o nombre (ej: AAPL, Apple)"
              className="h-12 rounded-xl border-border bg-transparent pl-10 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-accent"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>

          {searchQuery ? (
            <div className="mt-4 space-y-2">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    className="group flex w-full items-center justify-between rounded-xl border border-border p-4 text-left transition-all hover:border-border/30 hover:bg-muted hover:shadow-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 active:bg-muted disabled:pointer-events-none disabled:opacity-60"
                    onClick={() => onAnalyze(stock)}
                    disabled={isAnalyzing}
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-primary">{stock.symbol}</span>
                      <span className="ml-2 text-muted-foreground">{stock.name}</span>
                    </div>

                    <div className="ml-4 flex items-center gap-2">
                      <span className="font-medium text-primary">${stock.price.toFixed(2)}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                    </div>
                  </button>
                ))
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No se encontraron acciones con ese criterio
                </p>
              )}
            </div>
          ) : (
            <div className="mt-5">
              <p className="mb-3 text-sm text-muted-foreground">Acciones populares:</p>
              <div className="flex flex-wrap gap-2">
                {mockStocks.slice(0, 5).map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => onAnalyze(stock)}
                    disabled={isAnalyzing}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 active:scale-95 disabled:pointer-events-none disabled:opacity-60",
                      analysis?.symbol === stock.symbol
                        ? "bg-accent/10 border-accent/15 text-accent hover:bg-accent/20"
                        : "bg-muted/40 border-muted text-primary hover:bg-muted hover:border-border"
                    )}
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
  )
}
