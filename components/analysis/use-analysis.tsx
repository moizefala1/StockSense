"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { AnalysisResult, Stock } from "@/lib/types"
import { mockStocks, generateMockAnalysis } from "@/lib/mock-data"

export function useAnalysis() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const autoAnalyzed = useRef(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (autoAnalyzed.current) return

    const symbolParam = searchParams.get("symbol")
    if (symbolParam) {
      const stock = mockStocks.find(
        (s) => s.symbol.toUpperCase() === symbolParam.toUpperCase()
      )
      if (stock) {
        autoAnalyzed.current = true
        analyze(stock)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredStocks = useMemo(
    () =>
      searchQuery
        ? mockStocks.filter(
            (stock) =>
              stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
              stock.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [],
    [searchQuery]
  )

  const analyze = async (stock: Stock) => {
    setSelectedStock(stock)
    setIsAnalyzing(true)
    setAnalysis(null)
    setError(null)

    router.replace(`/analizar?symbol=${stock.symbol}`, { scroll: false })

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (Math.random() < 0.15) {
        throw new Error("Servicio temporalmente no disponible")
      }

      const result = generateMockAnalysis(stock.symbol, stock.name, stock.price)
      setAnalysis(result)
      setSearchQuery("")
    } catch {
      setError("No pudimos completar el análisis. Intenta de nuevo.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reanalyze = () => {
    if (selectedStock) {
      analyze(selectedStock)
    }
  }

  const reset = () => {
    // Si no limpiamos el query param, refrescar la página justo después de "Analizar otra
    // acción" dispararía de nuevo el useEffect de auto-análisis (ver arriba) y el usuario
    // volvería a ver el resultado que acaba de cerrar. scroll:false evita el salto visual.
    autoAnalyzed.current = false
    router.replace("/analizar", { scroll: false })

    setSearchQuery("")
    setSelectedStock(null)
    setAnalysis(null)
    setError(null)
    setIsAnalyzing(false)
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedStock,
    analysis,
    isAnalyzing,
    error,
    filteredStocks,
    analyze,
    reanalyze,
    reset,
  }
}