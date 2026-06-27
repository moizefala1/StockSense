import type { Metadata } from "next"
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
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Cómo Funciona - StockSense",
  description:
    "Descubre cómo StockSense analiza acciones usando indicadores técnicos como RSI y medias móviles para darte recomendaciones claras de Compra, Mantener o Vende.",
}

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

const disclaimers = [
  {
    title: "No somos asesores financieros",
    description:
      "StockSense es una herramienta educativa que utiliza indicadores técnicos para ayudarte a entender mejor el mercado.",
    icon: Shield,
  },
  {
    title: "Los indicadores tienen limitaciones",
    description:
      "Los análisis técnicos estudian patrones históricos, pero el pasado no garantiza resultados futuros y el mercado puede cambiar rápidamente.",
    icon: BarChart3,
  },
  {
    title: "Toda inversión implica riesgo",
    description:
      "Antes de invertir tu dinero, considera consultar con un profesional financiero y diversificar tus inversiones.",
    icon: AlertTriangle,
  },
  {
    title: "No ejecutamos operaciones",
    description:
      "Solo proporcionamos información y análisis. Las decisiones de inversión son completamente tuyas.",
    icon: BookOpen,
  },
]

const philosophy = [
  {
    title: "Claridad sobre complejidad",
    description:
      "Creemos que la información financiera debe ser accesible para todos, no solo para expertos.",
    icon: Lightbulb,
  },
  {
    title: "Educación incluida",
    description:
      "No solo te decimos qué hacer. Te explicamos por qué, para que aprendas mientras analizas.",
    icon: BookOpen,
  },
  {
    title: "Transparencia total",
    description:
      "Mostramos exactamente qué indicadores usamos y cómo llegamos a cada recomendación.",
    icon: Shield,
  },
]

export default function ComoFuncionaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        {/* Content */}

        <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">

    <Accordion type="multiple" className="overflow-hidden rounded-2xl border bg-card">

      {/* Steps */}
      <AccordionItem
        value="steps"
        className="bg-card px-6"
      >
        <AccordionTrigger className="py-6 text-2xl font-bold hover:no-underline">
          El proceso en 4 pasos
        </AccordionTrigger>

        <AccordionContent className="pb-6">
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step) => (
              <Card
                key={step.number}
                className="relative overflow-hidden"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <step.icon className="h-6 w-6 text-accent" />
                    </div>

                    <span className="text-4xl font-bold text-muted-foreground/20">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>

                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Indicators */}
      <AccordionItem
        value="indicators"
        className="bg-card px-6"
      >
        <AccordionTrigger className="py-6 text-2xl font-bold hover:no-underline">
          Los indicadores que usamos
        </AccordionTrigger>

        <AccordionContent className="pb-6">
          <div className="space-y-8">
            {indicators.map((indicator) => (
              <Card
                key={indicator.name}
                className="relative overflow-hidden"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <indicator.icon className="h-5 w-5 text-accent" />
                    </div>

                    <div>
                      <CardTitle className="text-lg">
                        {indicator.name}
                      </CardTitle>

                      <CardDescription>
                        {indicator.description}
                      </CardDescription>
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
                        <p className="font-medium">
                          {item.range}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Verdicts */}
      <AccordionItem
        value="results"
        className="bg-card px-6"
      >
        <AccordionTrigger className="py-6 text-2xl font-bold hover:no-underline">
          Cómo interpretamos los resultados
        </AccordionTrigger>

        <AccordionContent className="pb-6">
          <div className="grid gap-6 md:grid-cols-3">
            {verdictExplanations.map((item) => (
              <Card
                key={item.verdict}
                className="relative overflow-hidden"
              >
                <CardContent className="pt-6">
                  <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 ${item.color}`}>
                    <item.icon className="size-5" />
                    <span className="font-[17px] font-semibold">
                      {item.verdict}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>

                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Disclaimers */}
      <AccordionItem
        value="recommendations"
        className="bg-card px-6"
      >
        <AccordionTrigger className="py-6 text-2xl font-bold hover:no-underline">
          Sobre nuestras recomendaciones
        </AccordionTrigger>

        <AccordionContent className="pb-6">
          <div className="grid gap-6 md:grid-cols-2">
            {disclaimers.map((item) => (
              <Card
                key={item.title}
                className="relative overflow-hidden"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-danger/10">
                    <item.icon className="h-6 w-6 text-danger" />
                  </div>

                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>

                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-danger/5" />
              </Card>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Philosophy */}
      <AccordionItem
        value="philosophy"
        className="bg-card px-6"
      >
        <AccordionTrigger className="py-6 text-2xl font-bold hover:no-underline">
          Nuestra filosofía
        </AccordionTrigger>

        <AccordionContent className="pb-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {philosophy.map((item) => (
              <Card
                key={item.title}
                className="relative overflow-hidden"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>

                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>

                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
              </Card>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

    </Accordion>
    
    </div>
    </section>
    {/* CTA */} 
    <section className="bg-primary px-6 py-20 lg:px-8"> 
      <div className="mx-auto max-w-2xl text-center"> 
        <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl"> ¿Listo para empezar? </h2> 
        <p className="mt-4 text-primary-foreground/80">
          Analiza tu primera acción en segundos. Sin registro, sin costos. 
        </p> 
        <div className="mt-8"> 
          <Button size="lg" asChild> 
            <Link className="group inline-flex items-center" href="/analizar"> 
              Comenzar análisis 
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" /> 
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