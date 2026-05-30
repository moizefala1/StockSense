"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUp, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Analizar", href: "/analizar" },
  { name: "Cómo Funciona", href: "/como-funciona" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="mx-auto flex h-15 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 pt-4 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">StockSense</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-4 h-full">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex h-full items-center text-sm font-medium transition-colors hover:text-accent hover:border-b-2 hover:border-accent p-1",
                pathname === item.href
                  ? "text-foreground border-b-2 border-accent"
                  : "text-muted-foreground/90"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          {pathname !== "/analizar" ? (
            <Button asChild>
              <Link href="/analizar">Comenzar Análisis</Link>
            </Button>
          ) : (
            <div className="h-10 w-[173px]" />
          )}
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-6 pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block py-2 text-base font-medium transition-colors",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {pathname !== "/analizar" && (
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link href="/analizar">Comenzar Análisis</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}