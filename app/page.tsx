import Link from "next/link"
import { ArrowRight, TrendingUp, Shield, BookOpen, Zap, BarChart3, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
              </span>
              Análisis simplificado para todos
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Invierte con
              <span className="block text-accent">claridad y confianza</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Deja de adivinar. Recibe recomendaciones claras de Comprar, Mantener o Vender 
              basadas en indicadores técnicos, explicados de forma simple.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/analizar">
                  Comenzar Análisis Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/como-funciona">
                  Cómo Funciona
                </Link>
              </Button>
            </div>
          </div>

          {/* Decorative gradient */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent/20 to-primary/10 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>
        </section>

        {/* Problem Section */}
        <section className="bg-card px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                El problema que resolvemos
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Sabemos lo frustrante que es querer invertir sin entender el lenguaje técnico.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <BarChart3 className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold">Sobrecarga de información</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {'"Hay demasiada información, no sé qué indicador mirar"'} — Múltiples gráficos, 
                    métricas y fuentes que confunden más de lo que ayudan.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <Target className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold">Decisiones al azar</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {'"Al final termino adivinando"'} — Sin una guía clara, 
                    invertir se siente como apostar en vez de decidir con fundamento.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5 sm:col-span-2 lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <Shield className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold">Desconfianza</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {'"Las páginas son complicadas, dejé de invertir"'} — Plataformas que 
                    no explican su razonamiento generan miedo e inseguridad.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Nuestra solución
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Análisis simplificado que cualquiera puede entender
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
              <Card className="relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">Veredicto claro</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Recibe una recomendación directa: Comprar, Mantener o Vender. 
                    Sin jerga técnica, sin confusión.
                  </p>
                </CardContent>
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>

              <Card className="relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">Educación incluida</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cada indicador viene con una explicación simple. 
                    Aprende qué significa RSI o Media Móvil mientras analizas.
                  </p>
                </CardContent>
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>

              <Card className="relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">Rápido y gratuito</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selecciona cualquier acción y obtén el análisis en segundos. 
                    Sin registro, sin costos ocultos.
                  </p>
                </CardContent>
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Preview Section */}
        <section className="bg-primary px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Así de simple es
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Selecciona una acción → Recibe el veredicto → Entiende el por qué
            </p>

            {/* Mock UI Preview */}
            <div className="mt-12 rounded-2xl bg-card p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-left text-sm text-muted-foreground">Analizando</p>
                  <p className="text-left text-2xl font-bold">AAPL - Apple Inc.</p>
                </div>
                <div className="rounded-full bg-success/10 px-4 py-2 text-success">
                  <span className="text-sm font-semibold">Comprar</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-secondary p-4 text-left">
                  <p className="text-xs text-muted-foreground">RSI (14)</p>
                  <p className="text-xl font-semibold">42.5</p>
                  <p className="text-xs text-success">Zona neutral-baja</p>
                </div>
                <div className="rounded-lg bg-secondary p-4 text-left">
                  <p className="text-xs text-muted-foreground">Media Móvil 50</p>
                  <p className="text-xl font-semibold">$178.20</p>
                  <p className="text-xs text-success">Precio por encima</p>
                </div>
                <div className="rounded-lg bg-secondary p-4 text-left">
                  <p className="text-xs text-muted-foreground">Tendencia</p>
                  <p className="text-xl font-semibold">Alcista</p>
                  <p className="text-xs text-success">Últimos 30 días</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comienza a invertir con confianza
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No necesitas ser experto. Solo necesitas información clara.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/analizar">
                  Analizar mi primera acción
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
