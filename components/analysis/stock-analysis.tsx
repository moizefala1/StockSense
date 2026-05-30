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
          <Card className="mx-auto max-w-3xl py-8 border-slate-200 shadow-sm">
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="space-y-3">
                  <div className="h-9.5 w-46 animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-slate-300" />
                  <div className="h-6.5 w-21 animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-slate-300" />
                </div>

                <div className="h-16 w-33 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-slate-300" />
              </div>
            </CardContent>

            <CardContent className="space-y-4">

              <div className="h-20 animate-[pulse_1s_ease-in-out_infinite] rounded-2xl bg-slate-300" />

              <div className="flex items-center justify-between">
                <div className="h-6 w-28 animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-slate-300" />
                <div className="h-8 w-36 animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-slate-300" />
              </div>

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
