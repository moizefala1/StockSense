import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { StockAnalysis } from "@/components/analysis/stock-analysis"

export const metadata: Metadata = {
  title: "Analizar Acciones - StockSense",
  description:
    "Selecciona una acción y recibe un veredicto claro de Comprar, Mantener o Vender basado en indicadores técnicos como RSI y medias móviles.",
}

export default function AnalizarPage() {
  return (
    <>
      <Header />
        <StockAnalysis />
      <Footer />
    </>
  )
}
