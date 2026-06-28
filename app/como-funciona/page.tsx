"use client"

import { useState, useEffect, useRef } from "react"
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
  Lightbulb,
  HelpCircle,
  PiggyBank,
  DollarSign,
  ArrowUpRight,
  Sparkles,,
  HelpCircle,
  PiggyBank,
  DollarSign,
  ArrowUpRight,
} from "lucide-react"
import Image from "next/image"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const navSections = [
  { id: "como-invertir", label: "Cómo invertir" },
  { id: "proceso", label: "El proceso" },
  { id: "indicadores", label: "Indicadores" },
  { id: "resultados", label: "Resultados" },
  { id: "filosofia", label: "Filosofía" },
  { id: "faq", label: "FAQ" },
]

const steps = [
  {
    number: "01",
    title: "Selecciona una acción",
    description:
     
      "Busca por símbolo (como AAPL) o nombre de empresa (como Apple). Tenemos acceso a las principales acciones del mercado estadounidense.",
    icon: Search,
  },
  {
    number: "02",
    title: "Analizamos los indicadores",
    description:
     
      "Nuestro sistema calcula automáticamente indicadores técnicos clave como el RSI, medias móviles de 50 y 200 días, y la tendencia general del precio.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Recibe el veredicto",
    description:
     
      "Combinamos las señales de todos los indicadores para darte una recomendación clara: Comprar, Mantener o Vender, junto con el nivel de confianza.",
    icon: CheckCircle,
  },
  {
    number: "04",
    title: "Entiende el por qué",
    description:
     
      "Cada indicador viene con una explicación simple. No solo te decimos qué hacer, te explicamos por qué el análisis sugiere esa acción.",
    icon: BookOpen,
  },
]

const indicators = [
  {
    name: "RSI (Relative Strength Index)",
    description:
     
      "El RSI mide qué tan rápido y cuánto ha cambiado el precio recientemente. Ayuda a identificar si una acción está sobrecomprada o sobrevendida. Ayuda a identificar si una acción está sobrecomprada o sobrevendida.",
    interpretation: [
      { range: "Menor a 30", meaning: "La acción puede estar sobrevendida", signal: "comprar" as const },
      { range: "Entre 30 y 70", meaning: "Zona neutral, sin señales extremas", signal: "mantener" as const },
      { range: "Mayor a 70", meaning: "La acción puede estar sobrecomprada", signal: "vender" as const },
    ],
    icon: Target,
    image: "/rsi_values.png",
    visualLabel: "Velocidad del precio",
    image: "/rsi_values.png",
    visualLabel: "Velocidad del precio",
  },
  {
    name: "Media Móvil 50 días (SMA50)",
    description:
     
      "El precio promedio de los últimos 50 días. Indica la tendencia de corto a mediano plazo y posibles puntos de soporte o resistencia y posibles puntos de soporte o resistencia.",
    interpretation: [
      { range: "Precio > SMA50", meaning: "Tendencia positiva a corto plazo", signal: "comprar" as const },
      { range: "Precio ≈ SMA50", meaning: "El precio está consolidando", signal: "mantener" as const },
      { range: "Precio < SMA50", meaning: "Tendencia negativa a corto plazo", signal: "vender" as const },
    ],
    icon: TrendingUp,
    image: "/ma50.png",
    visualLabel: "Tendencia corto plazo",
    image: "/ma50.png",
    visualLabel: "Tendencia corto plazo",
  },
  {
    name: "Media Móvil 200 días (SMA200)",
    description:
      "El precio promedio de los últimos 200 días. Es el indicador de tendencia de largo plazo más respetado del mercado.",
    description:
      "El precio promedio de los últimos 200 días. Es el indicador de tendencia de largo plazo más respetado del mercado.",
    interpretation: [
      { range: "Precio > SMA200", meaning: "Tendencia alcista de largo plazo", signal: "comprar" as const },
      { range: "Precio cruzando", meaning: "Posible cambio de tendencia", signal: "mantener" as const },
      { range: "Precio < SMA200", meaning: "Tendencia bajista de largo plazo", signal: "vender" as const },
    ],
    icon: BarChart3,
    image: "/ma200.png",
    visualLabel: "Tendencia largo plazo",
    image: "/ma200.png",
    visualLabel: "Tendencia largo plazo",
  },
]

const verdictExplanations = [
  {
    verdict: "Comprar",
    description:
     
      "La mayoría de los indicadores sugieren que el precio tiene potencial de subir. El RSI no indica sobrecompra, y el precio está en tendencia positiva respecto a las medias móviles.",
    icon: TrendingUp,
    color: "text-success",
    bg: "bg-success/5",
    border: "border-success/20",
    dotColor: "bg-success",
  },
  {
    verdict: "Mantener",
    description:
     
      "Los indicadores muestran señales mixtas o neutrales. No hay una dirección clara. Si ya tienes la acción, puede ser prudente esperar. Si no la tienes, espera una señal más definida.",
    icon: Minus,
    color: "text-warning",
    bg: "bg-warning/5",
    border: "border-warning/20",
    dotColor: "bg-warning",
  },
  {
    verdict: "Vender",
    description:
     
      "Varios indicadores sugieren precaución. El precio puede estar sobrecomprado o mostrando debilidad técnica. Considera proteger ganancias o reducir exposición.",
    icon: TrendingDown,
    color: "text-danger",
    bg: "bg-danger/5",
    border: "border-danger/20",
    dotColor: "bg-danger",
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

const faqItems = [
  {
    question: "¿Es gratis usar StockSense?",
    answer:
      "Sí, StockSense es completamente gratuito. Puedes analizar todas las acciones que quieras sin registro, sin costos ocultos y sin límites de uso.",
  },
  {
    question: "¿Qué acciones puedo analizar?",
    answer:
      "Actualmente cubrimos las principales acciones del mercado estadounidense (NYSE y NASDAQ). Puedes buscar por símbolo como AAPL, GOOGL, MSFT o por nombre de empresa.",
  },
  {
    question: "¿Cada cuánto se actualizan los datos?",
    answer:
      "Trabajamos con datos de mercado en tiempo real para ofrecerte la información más actualizada posible al momento de tu consulta.",
  },
  {
    question: "¿Puedo confiar ciegamente en las recomendaciones?",
    answer:
      "No. StockSense es una herramienta educativa basada en análisis técnico. Los indicadores estudian patrones históricos, pero el pasado no garantiza resultados futuros. Te recomendamos usar esta información como complemento a tu propia investigación y, si es necesario, consultar con un asesor financiero profesional.",
  },
  {
    question: "¿Ejecutan operaciones de compra o venta?",
    answer:
      "No. StockSense solo proporciona información y análisis. No ejecutamos operaciones, no manejamos dinero y no tenemos acceso a tus cuentas de inversión. Las decisiones de inversión son completamente tuyas.",
  },
  {
    question: "¿Cómo combinan los indicadores para dar un veredicto?",
    answer:
      "Nuestro sistema analiza cada indicador por separado (RSI, SMA50, SMA200 y tendencia del precio) y les asigna una señal: comprar, mantener o vender. Luego contamos cuántos indicadores apuntan en cada dirección y el veredicto final se basa en la señal predominante, acompañado de un porcentaje de confianza.",
  },
  {
    question: "¿Qué es el nivel de confianza?",
    answer:
      "El nivel de confianza es el porcentaje de indicadores que coinciden en la misma señal. Por ejemplo, si 3 de 3 indicadores sugieren comprar, la confianza es del 100%. Si solo 1 de 3 lo sugiere, la confianza es del 33%.",
  },
]

const faqItems = [
  {
    question: "¿Es gratis usar StockSense?",
    answer:
      "Sí, StockSense es completamente gratuito. Puedes analizar todas las acciones que quieras sin registro, sin costos ocultos y sin límites de uso.",
  },
  {
    question: "¿Qué acciones puedo analizar?",
    answer:
      "Actualmente cubrimos las principales acciones del mercado estadounidense (NYSE y NASDAQ). Puedes buscar por símbolo como AAPL, GOOGL, MSFT o por nombre de empresa.",
  },
  {
    question: "¿Cada cuánto se actualizan los datos?",
    answer:
      "Trabajamos con datos de mercado en tiempo real para ofrecerte la información más actualizada posible al momento de tu consulta.",
  },
  {
    question: "¿Puedo confiar ciegamente en las recomendaciones?",
    answer:
      "No. StockSense es una herramienta educativa basada en análisis técnico. Los indicadores estudian patrones históricos, pero el pasado no garantiza resultados futuros. Te recomendamos usar esta información como complemento a tu propia investigación y, si es necesario, consultar con un asesor financiero profesional.",
  },
  {
    question: "¿Ejecutan operaciones de compra o venta?",
    answer:
      "No. StockSense solo proporciona información y análisis. No ejecutamos operaciones, no manejamos dinero y no tenemos acceso a tus cuentas de inversión. Las decisiones de inversión son completamente tuyas.",
  },
  {
    question: "¿Cómo combinan los indicadores para dar un veredicto?",
    answer:
      "Nuestro sistema analiza cada indicador por separado (RSI, SMA50, SMA200 y tendencia del precio) y les asigna una señal: comprar, mantener o vender. Luego contamos cuántos indicadores apuntan en cada dirección y el veredicto final se basa en la señal predominante, acompañado de un porcentaje de confianza.",
  },
  {
    question: "¿Qué es el nivel de confianza?",
    answer:
      "El nivel de confianza es el porcentaje de indicadores que coinciden en la misma señal. Por ejemplo, si 3 de 3 indicadores sugieren comprar, la confianza es del 100%. Si solo 1 de 3 lo sugiere, la confianza es del 33%.",
  },
]

function ComoInvertirSection() {
  const [activeSection, setActiveSection] = useState("como-invertir")

  const handleScroll = useCallback(() => {
    const sections = navSections.map((s) => document.getElementById(s.id))
    const scrollPos = window.scrollY + 140

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]
      if (section && section.offsetTop <= scrollPos) {
        setActiveSection(navSections[i].id)
        return
      }
    }
    setActiveSection(navSections[0].id)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.offsetTop - 80
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
            <PiggyBank className="h-7 w-7 text-accent" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Cómo invertir
          </h2>
          <p className="mt-4 text-muted-foreground">
            Una guía desde cero. Sin experiencia previa necesaria.
          </p>
        </div>

        {/* ¿Qué es invertir? */}
        <div className="mb-16">
          <h3 className="mb-6 text-xl font-bold">¿Qué es invertir?</h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Invertir significa <strong className="text-foreground">poner tu dinero a trabajar</strong>. En vez
              de tenerlo guardado sin hacer nada, lo usas para comprar una parte de una empresa (una acción) o
              un conjunto de empresas (un fondo). Si a esas empresas les va bien, el valor de tu inversión
              sube y ganas dinero. Si les va mal, puedes perder.
            </p>
            <p>
              Es como ser dueño de una pequeñísima porción de empresas como Apple, Google o Mercado Libre.
              Cuando compras una acción, te conviertes en socio.
            </p>
          </div>
        </div>

        {/* ¿Por qué invertir? */}
        <div className="mb-16">
          <h3 className="mb-6 text-xl font-bold">¿Por qué deberías invertir?</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <h4 className="font-semibold">Ganarle a la inflación</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Si dejas tu plata en el banco o bajo el colchón, cada año vale menos. La inflación
                hace que todo suba de precio. Invertir es la forma de proteger tu dinero y hacerlo crecer.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h4 className="font-semibold">Interés compuesto</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Es el efecto bola de nieve: tus ganancias generan más ganancias. Si empiezas temprano,
                aunque sea con montos chicos, el tiempo hace la mayor parte del trabajo.
              </p>
            </div>
          </div>
        </div>

        {/* Reglas */}
        <div className="mb-16">
          <h3 className="mb-6 text-xl font-bold">Las 3 reglas más importantes</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="group">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10">
                  <DollarSign className="h-5 w-5 text-danger" />
                </div>
                <h4 className="font-semibold">Invierte solo lo que puedas perder</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nunca uses plata que necesitas para vivir, pagar deudas o emergencias. La bolsa sube y
                  baja todo el tiempo.
                </p>
              </CardContent>
            </Card>

            <Card className="group">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10">
                  <Target className="h-5 w-5 text-warning" />
                </div>
                <h4 className="font-semibold">Diversifica siempre</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  No pongas toda tu plata en una sola empresa. Reparte entre varias acciones, fondos y
                  tipos de activos para reducir el riesgo.
                </p>
              </CardContent>
            </Card>

            <Card className="group">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
                  <ArrowUpRight className="h-5 w-5 text-success" />
                </div>
                <h4 className="font-semibold">Piensa en años, no en días</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  La inversión es un maratón. Ignora las subidas y bajadas diarias. El mercado
                  históricamente ha subido en el largo plazo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plataformas */}
        <div>
          <h3 className="mb-2 text-xl font-bold">Plataformas recomendadas en Chile</h3>
          <p className="mb-8 text-muted-foreground">
            Estas apps están reguladas por la CMF y son las más usadas para empezar a invertir desde cero. Las recomendamos para usarlas complementariamente con StockSense
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Fintual", image: "/fintual.png", desc: "Fondos diversificados. Ideal para empezar sin saber nada." },
              { name: "Racional", image: "/racional.svg", desc: "Acciones, ETFs y fondos. Interfaz simple y educativa." },
              { name: "Zesty", image: "/zesty.png", desc: "Inversión inmobiliaria fraccionada. Desde $5.000 CLP." },
              { name: "Trii", image: "/trii.png", desc: "Acciones chilenas sin comisiones. Conectado al MACH." },
            ].map((platform) => (
              <div key={platform.name} className="flex flex-col items-center rounded-xl border bg-card p-6 text-center">
                <Image
                  src={platform.image}
                  alt={platform.name}
                  width={120}
                  height={48}
                  className="mb-4 h-12 w-auto object-contain"
                />
                <h4 className="font-semibold">{platform.name}</h4>
                <p className="mt-2 text-xs text-muted-foreground">{platform.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProcesoSection() {
  return (
    <section className="bg-muted/30 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            El proceso en 4 pasos
          </h2>
          <p className="mt-4 text-muted-foreground">
            De la búsqueda al veredicto: así de simple es usar StockSense.
          </p>
        </div>

        <div className="relative">
          {/* linea */}
          <div className="absolute left-[27px] top-4 bottom-4 hidden w-px bg-border md:block" />

          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.number} className="relative flex gap-6 md:gap-10">
                {/* numero del paso */}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-accent/20 bg-card shadow-sm">
                  <span className="text-lg font-bold text-accent">{step.number}</span>
                </div>

                {/* contenido del paso */}
                <div className="pt-1.5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <step.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="max-w-lg text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function IndicadoresSection() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Los indicadores que usamos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tres métricas clave. Una decisión clara.
          </p>
        </div>

        <div className="space-y-20">
          {indicators.map((indicator, index) => {
            const isEven = index % 2 === 0
            return (
              <div
                key={indicator.name}
                className="grid items-center gap-10 md:grid-cols-5"
              >
                {/* orientacion de la carta */}
                <div className={cn("md:col-span-3", !isEven && "md:order-2")}>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                    <indicator.icon className="h-3.5 w-3.5" />
                    {indicator.visualLabel}
                  </div>

                  <h3 className="text-2xl font-bold">{indicator.name}</h3>
                  <p className="mt-3 max-w-lg text-muted-foreground">
                    {indicator.description}
                  </p>

                  {/* interpretacion */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {indicator.interpretation.map((item) => (
                      <div
                        key={item.range}
                        className={cn(
                          "rounded-lg border px-4 py-2.5 text-sm",
                          item.signal === "comprar"
                            ? "border-success/20 bg-success/5"
                            : item.signal === "vender"
                            ? "border-danger/20 bg-danger/5"
                            : "border-warning/20 bg-warning/5"
                        )}
                      >
                        <span className="font-semibold">{item.range}</span>
                        <span className="mx-1.5 text-muted-foreground/60">→</span>
                        <span className="text-muted-foreground">{item.meaning}</span>
                      </div>
                    </div>

                    {/* imagen  */}
                    <div className={cn("md:col-span-2", !isEven && "md:order-1")}>
                      <Image
                        src={indicator.image}
                        alt={`Visual de ${indicator.name}`}
                        width={500}
                        height={500}
                        className="w-full rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* imagen  */}
                <div className={cn("md:col-span-2", !isEven && "md:order-1")}>
                  <Image
                    src={indicator.image}
                    alt={`Visual de ${indicator.name}`}
                    width={500}
                    height={500}
                    className="w-full rounded-xl"
                  />
                </div>
              </div>

            )
          })}
        </div>
      </div>
    </section>
  )
}

function ResultadosSection() {
  return (
    <section className="bg-muted/30 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Cómo interpretamos los resultados
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tres posibles veredictos. Cada uno con su lógica.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {verdictExplanations.map((item) => (
            <Card key={item.verdict} className={cn("relative overflow-hidden border-2", item.border, item.bg)}>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-sm">
                  <item.icon className={cn("h-8 w-8", item.color)} />
                </div>

                <h3 className={cn("text-2xl font-bold", item.color)}>{item.verdict}</h3>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                {/* puntos de confianza */}
                <div className="mt-5 flex items-center justify-center gap-1.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 w-2 rounded-full",
                        i >= 1 ? "bg-muted-foreground/20" : item.dotColor
                      )}
                    />
                  ))}
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {item.verdict === "Comprar"
                      ? "confianza alta"
                      : item.verdict === "Vender"
                      ? "confianza alta"
                      : "confianza baja"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function FilosofiaSection() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Nuestra filosofía
          </h2>
          <p className="mt-4 text-muted-foreground">
            Los principios que guían cada análisis que hacemos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {philosophy.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="bg-muted/30 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
            <HelpCircle className="h-7 w-7 text-accent" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Respuestas rápidas a las dudas más comunes.
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="faq-0" className="rounded-2xl border bg-card">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="px-6 first:rounded-t-2xl last:rounded-b-2xl hover:bg-accent/5 data-[state=open]:bg-accent/10"
            >
              <AccordionTrigger className="py-5 text-base font-semibold rounded-none hover:bg-transparent">
                <span className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10 text-xs font-bold text-accent">
                    {index + 1}
                  </span>
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground">
                <div className="pl-9 leading-relaxed">{item.answer}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

const sectionComponents: Record<string, () => React.JSX.Element> = {
  "como-invertir": ComoInvertirSection,
  "proceso": ProcesoSection,
  "indicadores": IndicadoresSection,
  "resultados": ResultadosSection,
  "filosofia": FilosofiaSection,
  "faq": FaqSection,
}

export default function ComoFuncionaPage() {
  const [activeSection, setActiveSection] = useState("como-invertir")
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const contentRef = useRef<HTMLDivElement>(null)

  const goToSection = (id: string) => {
    if (id === activeSection) return
    const currentIndex = navSections.findIndex((s) => s.id === activeSection)
    const nextIndex = navSections.findIndex((s) => s.id === id)
    setDirection(nextIndex > currentIndex ? "forward" : "backward")
    setActiveSection(id)
  }

  const scrollToContent = () => {
    if (contentRef.current) {
      const top = contentRef.current.offsetTop - 80
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  useEffect(() => {
    if (contentRef.current) {
      const top = contentRef.current.offsetTop - 80
      window.scrollTo({ top, behavior: "smooth" })
    }
  }, [activeSection])

  const ActiveSection = sectionComponents[activeSection] ?? sectionComponents["como-invertir"]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* heros */}
        <section className="relative overflow-hidden px-6 pb-16 pt-24 lg:px-8 lg:pb-20 lg:pt-32">
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-accent/8 via-background to-background" />
          <div className="absolute right-0 top-0 -z-10 h-125 w-125 translate-x-1/3 -translate-y-1/4 rounded-full bg-accent/6 blur-3xl" />
          <div className="absolute bottom-0 left-0 -z-10 h-100 w-100 -translate-x-1/4 translate-y-1/3 rounded-full bg-primary/4 blur-3xl" />

          <div className="mx-auto max-w-4xl text-center">

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Cómo StockSense te ayuda a{" "}
              <span className="text-accent">invertir mejor</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Analizamos acciones usando indicadores técnicos como RSI y medias móviles
              para darte recomendaciones claras. Sin jerga, sin confusión.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/analizar" className="group inline-flex items-center gap-2">
                  Probar ahora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToContent}>
                Aprender más
              </Button>
            </div>
          </div>
        </section>

        {/* NAV */}
        <nav className="sticky top-15 z-40 border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-5xl overflow-x-auto px-6 lg:px-8">
            <div className="flex items-center gap-0.5 py-2">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => goToSection(section.id)}
                  className={cn(
                    "shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    activeSection === section.id
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  )}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* slider */}
        <div ref={contentRef} className="overflow-hidden">
          <div
            key={activeSection}
            className={cn(
              direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"
            )}
          >
            <ActiveSection />
          </div>
        </div>

        {/*DISCLAIMER*/}
        <section className="border-t border-border/40 px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10">
              <AlertTriangle className="h-6 w-6 text-danger" />
            </div>
            <h2 className="text-xl font-bold">Aviso importante</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              StockSense es una herramienta educativa. Los análisis técnicos estudian patrones
              históricos, pero el pasado no garantiza resultados futuros. Toda inversión implica
              riesgo. No ejecutamos operaciones ni somos asesores financieros. Considera consultar
              con un profesional antes de invertir tu dinero.
            </p>
          </div>
        </section>

        {/* banner final */}
        <section className="bg-primary px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              ¿Listo para empezar?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Analiza tu primera acción en segundos. Sin registro, sin costos.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link className="group inline-flex items-center" href="/analizar">
                  Comenzar análisis
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
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
