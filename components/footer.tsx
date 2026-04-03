import Link from "next/link"
import { TrendingUp } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">StockSense</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Inicio
            </Link>
            <Link
              href="/analizar"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Analizar
            </Link>
            <Link
              href="/como-funciona"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cómo Funciona
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StockSense. Solo con fines educativos.
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-xs text-muted-foreground">
            Disclaimer: Esta plataforma ofrece análisis basados en indicadores técnicos con fines educativos. 
            No constituye asesoría financiera. Toda inversión conlleva riesgos.
          </p>
        </div>
      </div>
    </footer>
  )
}
