"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Analizar", href: "/analizar" },
  { name: "Cómo Funciona", href: "/como-funciona" },
]

export function Footer() {
  const pathname = usePathname()

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
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm text-muted-foreground transition-colors hover:text-accent",
                  pathname === item.href
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
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
