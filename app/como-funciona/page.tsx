import { 
  Search, 
  BarChart3, 
  CheckCircle, 
  BookOpen, 
  Shield, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Target,
  Lightbulb
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const steps = [
  {
    number: "01",
    title: "Selecciona una acción",
    description: "Busca por símbolo (como AAPL) o nombre de empresa (como Apple). Tenemos acceso a las principales acciones del mercado estadounidense.",
    icon: Search,
  },
  {
    number: "02",
    title: "Analizamos los indicadores",
    description: "Nuestro sistema calcula automáticamente indicadores técnicos clave como el RSI, medias móviles de 50 y 200 días, y la tendencia general del precio.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Recibe el veredicto",
    description: "Combinamos las señales de todos los indicadores para darte una recomendación clara: Comprar, Mantener o Vender, junto con el nivel de confianza.",
    icon: CheckCircle,
  },
  {
    number: "04",
    title: "Entiende el por qué",
    description: "Cada indicador viene con una explicación simple. No solo te decimos qué hacer, te explicamos por qué el análisis sugiere esa acción.",
    icon: BookOpen,
  },
]

const indicators = [
  {
    name: "RSI (Relative Strength Index)",
    description: "El RSI mide qué tan rápido y cuánto ha cambiado el precio recientemente.",
    interpretation: [
      { range: "Menor a 30", meaning: "La acción puede estar sobrevendida", signal: "comprar" as const },
      { range: "Entre 30 y 70", meaning: "Zona neutral, sin señales extremas", signal: "mantener" as const },
      { range: "Mayor a 70", meaning: "La acción puede estar sobrecomprada", signal: "vender" as const },
    ],
    icon: Target,
  },
  {
    name: "Media Móvil 50 días (SMA50)",
    description: "El precio promedio de los últimos 50 días. Indica la tendencia de corto a mediano plazo.",
    interpretation: [
      { range: "Precio > SMA50", meaning: "Tendencia positiva a corto plazo", signal: "comprar" as const },
      { range: "Precio ≈ SMA50", meaning: "El precio está consolidando", signal: "mantener" as const },
      { range: "Precio < SMA50", meaning: "Tendencia negativa a corto plazo", signal: "vender" as const },
    ],
    icon: TrendingUp,
  },
  {
    name: "Media Móvil 200 días (SMA200)",
    description: "El precio promedio de los últimos 200 días. Es el indicador de tendencia de largo plazo más usado.",
    interpretation: [
      { range: "Precio > SMA200", meaning: "Tendencia alcista de largo plazo", signal: "comprar" as const },
      { range: "Precio cruzando", meaning: "Posible cambio de tendencia", signal: "mantener" as const },
      { range: "Precio < SMA200", meaning: "Tendencia bajista de largo plazo", signal: "vender" as const },
    ],
    icon: BarChart3,
  },
]

const verdictExplanations = [
  {
    verdict: "Comprar",
    description: "La mayoría de los indicadores sugieren que el precio tiene potencial de subir. El RSI no indica sobrecompra, y el precio está en tendencia positiva respecto a las medias móviles.",
    icon: TrendingUp,
    color: "text-success bg-success/5 border-success/0",
  },
  {
    verdict: "Mantener",
    description: "Los indicadores muestran señales mixtas o neutrales. No hay una dirección clara. Si ya tienes la acción, puede ser prudente esperar. Si no la tienes, espera una señal más definida.",
    icon: Minus,
    color: "text-warning bg-warning/5 border-warning/0",
  },
  {
    verdict: "Vender",
    description: "Varios indicadores sugieren precaución. El precio puede estar sobrecomprado o mostrando debilidad técnica. Considera proteger ganancias o reducir exposición.",
    icon: TrendingDown,
    color: "text-danger bg-danger/5 border-danger/0",
  },
]

export default function ComoFuncionaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
              </span>
              Aprende cómo funciona
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Cómo funciona
              <span className="block text-accent">StockSense</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Transformamos datos financieros complejos en recomendaciones claras que cualquiera puede entender. 
              Sin jerga técnica, sin confusión.
            </p>
          </div>
        </section>
        
        {/* Process Steps */}
        <section className="bg-card px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-16 text-center text-3xl font-bold sm:text-4xl">
              El proceso en 4 pasos
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2">
              {steps.map((step, index) => (
                <Card key={step.number} className="relative overflow-hidden">
                  <CardContent className="pt-2">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <step.icon className="h-6 w-6 text-accent" />
                      </div>
                      <span className="text-4xl font-bold text-muted-foreground/20">
                        {step.number}
                      </span>
                    </div>


                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>

                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />

                  {index < steps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block md:odd:hidden">
                      <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Indicators Explanation */}
        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Los indicadores que usamos
              </h2>
              <p className="mt-4 text-muted-foreground">
                Explicados de forma simple para que entiendas qué significa cada uno
              </p>
            </div>
            
            <div className="space-y-8">
              {indicators.map((indicator) => (
                <Card key={indicator.name} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                        <indicator.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{indicator.name}</CardTitle>
                        <CardDescription>{indicator.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {indicator.interpretation.map((item) => (
                        <div
                          key={item.range}
                          className={`rounded-lg border p-4 ${
                            item.signal === "comprar"
                              ? "border-success/0 bg-success/5"
                              : item.signal === "vender"
                              ? "border-danger/0 bg-danger/5" 
                              : "border-warning/0 bg-warning/5"
                          }`}
                        >
                          <p className="font-medium">{item.range}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.meaning}
                          </p>
                          <span
                            className={`mt-2 inline-block text-xs font-medium ${
                              item.signal === "comprar"
                                ? "text-success"
                                : item.signal === "vender"
                                ? "text-danger"
                                : "text-warning"
                            }`}
                          >
                            Señal: {item.signal.charAt(0).toUpperCase() + item.signal.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Verdicts Explanation */}
        <section className="bg-card px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Cómo interpretamos los resultados
              </h2>
              <p className="mt-4 text-muted-foreground">
                Combinamos las señales de todos los indicadores para darte un veredicto claro
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {verdictExplanations.map((item) => (
                <Card key={item.verdict} className="relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-semibold">{item.verdict}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>

                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Important Disclaimers */}
        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-10">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <AlertTriangle className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Importante: Sobre nuestras recomendaciones</h2>
                  <div className="mt-6 max-w-2xl space-y-4 text-left text-muted-foreground">
                    <p>
                      <strong className="text-foreground">No somos asesores financieros.</strong> StockSense es una herramienta 
                      educativa que utiliza indicadores técnicos para ayudarte a entender el mercado.
                    </p>
                    <p>
                      <strong className="text-foreground">Los indicadores técnicos tienen limitaciones.</strong> Analizan 
                      patrones históricos, pero el pasado no garantiza resultados futuros. El mercado puede comportarse 
                      de manera impredecible.
                    </p>
                    <p>
                      <strong className="text-foreground">Toda inversión conlleva riesgos.</strong> Antes de invertir tu dinero, 
                      considera consultar con un profesional financiero certificado y diversificar tus inversiones.
                    </p>
                    <p>
                      <strong className="text-foreground">No intermediamos ni ejecutamos operaciones.</strong> Solo proporcionamos 
                      información y análisis. Las decisiones de inversión son completamente tuyas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Our Philosophy */}
        <section className="bg-card px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Nuestra filosofía
              </h2>
            </div>
                    
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
                    
              <Card className="relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Lightbulb className="h-6 w-6 text-accent" />
                  </div>
                    
                  <h3 className="text-lg font-semibold">
                    Claridad sobre complejidad
                  </h3>
                    
                  <p className="mt-2 text-sm text-muted-foreground">
                    Creemos que la información financiera debe ser accesible para todos, no solo para expertos.
                  </p>
                </CardContent>
                    
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>
                    
              <Card className="relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                    
                  <h3 className="text-lg font-semibold">
                    Educación incluida
                  </h3>
                    
                  <p className="mt-2 text-sm text-muted-foreground">
                    No solo te decimos qué hacer. Te explicamos por qué, para que aprendas mientras analizas.
                  </p>
                </CardContent>
                    
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>
                    
              <Card className="relative overflow-hidden">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                    
                  <h3 className="text-lg font-semibold">
                    Transparencia total
                  </h3>
                    
                  <p className="mt-2 text-sm text-muted-foreground">
                    Mostramos exactamente qué indicadores usamos y cómo llegamos a cada recomendación.
                  </p>
                </CardContent>
                    
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>
                    
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="bg-primary px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              ¿Listo para empezar?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Analiza tu primera acción en segundos. Sin registro, sin costos.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/analizar">
                  Comenzar análisis
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