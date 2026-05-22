"use client"

import { RefreshCw, AlertCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/hooks/use-analysis"
import { StockSearch } from "@/components/analysis/stock-search"
import { AnalysisResult } from "@/components/analysis/analysis-result"

export function StockAnalysis() {
  const {
    searchQuery,
    setSearchQuery,
    selectedStock,
    analysis,
    isAnalyzing,
    error,
    filteredStocks,
    analyze,
    reanalyze,
  } = useAnalysis()

  return (
    <main className="flex-1 px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <StockSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isAnalyzing={isAnalyzing}
          filteredStocks={filteredStocks}
          analysis={analysis}
          onAnalyze={analyze}
        />

        {error && !isAnalyzing && (
          <Card className="mx-auto max-w-3xl border-destructive/20 bg-destructive/5 shadow-sm">
            <CardContent className="py-10 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
              <p className="mt-4 text-lg font-medium text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={reanalyze}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar análisis
              </Button>
            </CardContent>
          </Card>
        )}

        {!isAnalyzing && !analysis && !error && (
          <Card className="mx-auto max-w-3xl border-border shadow-sm">
            <CardContent className="py-12 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                Selecciona una acción para comenzar el análisis
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Busca por símbolo o elige una de las acciones populares
              </p>
            </CardContent>
          </Card>
        )}

        {isAnalyzing && (
          <Card className="mx-auto max-w-3xl border-border shadow-sm">
            <CardContent className="py-12 text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-accent" />
              <p className="mt-4 text-lg font-medium text-primary">
                Analizando {selectedStock?.symbol}...
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Calculando indicadores técnicos
              </p>
            </CardContent>
          </Card>
        )}

        {analysis && !isAnalyzing && (
          <AnalysisResult
            analysis={analysis}
            onReanalyze={reanalyze}
          />
        )}
      </div>
    </main>
  )
}
