"use client"

import { useEffect, useState } from "react"
import { jsPDF } from "jspdf"

export default function PDFGenerator() {
  const [status, setStatus] = useState("Generando documento...")

  useEffect(() => {
    const generatePDF = () => {
      const doc = new jsPDF()
      let y = 20

      // Helper functions
      const addTitle = (text: string) => {
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(37, 47, 63)
        doc.text(text, 105, y, { align: "center" })
        y += 15
      }

      const addSubtitle = (text: string) => {
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(37, 47, 63)
        doc.text(text, 20, y)
        y += 10
      }

      const addText = (text: string) => {
        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(60, 60, 60)
        const lines = doc.splitTextToSize(text, 170)
        doc.text(lines, 20, y)
        y += lines.length * 6 + 4
      }

      const addBullet = (text: string) => {
        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(60, 60, 60)
        doc.text("•  " + text, 25, y)
        y += 7
      }

      const addColorSwatch = (name: string, hex: string, desc: string) => {
        doc.setFillColor(hex)
        doc.rect(25, y - 4, 10, 10, "F")
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(37, 47, 63)
        doc.text(name, 40, y)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(100, 100, 100)
        doc.text(`${hex} - ${desc}`, 40, y + 5)
        y += 14
      }

      const checkNewPage = (needed: number = 40) => {
        if (y > 270 - needed) {
          doc.addPage()
          y = 20
        }
      }

      // PORTADA
      doc.setFillColor("#0d1117")
      doc.rect(0, 0, 210, 297, "F")
      
      doc.setFontSize(42)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255)
      doc.text("StockSense", 105, 100, { align: "center" })
      
      doc.setFontSize(18)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(200, 200, 200)
      doc.text("Informe de Sistema de Diseño", 105, 120, { align: "center" })
      
      doc.setFontSize(12)
      doc.setTextColor(150, 150, 150)
      doc.text("Plataforma de Análisis de Acciones Simplificado", 105, 140, { align: "center" })
      
      doc.setFontSize(10)
      doc.text("Generado: " + new Date().toLocaleDateString("es-CL"), 105, 250, { align: "center" })

      // PÁGINA 2 - Índice
      doc.addPage()
      y = 20
      addTitle("Índice de Contenidos")
      y += 10
      
      const sections = [
        "1. Paleta de Colores",
        "2. Tipografía",
        "3. Sistema de Botones",
        "4. Sistema de Tarjetas",
        "5. Espaciado y Layout",
        "6. Iconografía",
        "7. Componentes de Estado",
        "8. Navegación",
        "9. Inputs y Formularios",
        "10. Efectos y Animaciones",
        "11. Responsive Design",
        "12. Accesibilidad"
      ]
      
      sections.forEach(section => {
        addBullet(section)
      })

      // PÁGINA 3 - Colores
      doc.addPage()
      y = 20
      addTitle("1. Paleta de Colores")
      y += 5
      
      addSubtitle("Colores Principales")
      addColorSwatch("Background", "#f5f3ef", "Fondo general - Beige cálido")
      addColorSwatch("Foreground", "#1a1f2e", "Texto principal - Azul-gris profundo")
      addColorSwatch("Primary", "#1a1f2e", "Botones primarios - Navy profundo")
      addColorSwatch("Accent", "#2a9d8f", "Acentos y links - Teal (confianza)")
      addColorSwatch("Card", "#ffffff", "Fondo de tarjetas - Blanco puro")
      addColorSwatch("Border", "#e5e2dc", "Bordes sutiles")
      
      checkNewPage(60)
      addSubtitle("Colores de Veredicto")
      addColorSwatch("Success", "#22c55e", "Verde - Veredicto Comprar")
      addColorSwatch("Warning", "#eab308", "Ámbar - Veredicto Mantener")
      addColorSwatch("Danger", "#ef4444", "Rojo - Veredicto Vender")

      // PÁGINA 4 - Tipografía
      doc.addPage()
      y = 20
      addTitle("2. Sistema Tipográfico")
      y += 5
      
      addSubtitle("Familia de Fuentes")
      addText("Sans-serif: Geist, system-ui, sans-serif")
      addText("Monospace: Geist Mono, monospace")
      
      addSubtitle("Escala Tipográfica")
      addBullet("H1 (Hero): 4xl-7xl / font-bold / tracking-tight")
      addBullet("H2 (Sección): 3xl-4xl / font-bold / tracking-tight")
      addBullet("H3 (Card Title): lg-xl / font-semibold")
      addBullet("Body Large: lg-xl / leading-relaxed")
      addBullet("Body: sm-base / leading-relaxed")
      addBullet("Caption: xs-sm / text-muted-foreground")
      
      y += 5
      addSubtitle("Pesos Tipográficos")
      addBullet("Bold (700): Títulos principales")
      addBullet("Semibold (600): Subtítulos, valores destacados")
      addBullet("Medium (500): Labels, navegación, botones")
      addBullet("Normal (400): Texto de párrafo")

      // PÁGINA 5 - Botones
      doc.addPage()
      y = 20
      addTitle("3. Sistema de Botones")
      y += 5
      
      addSubtitle("Variantes de Botón")
      addBullet("Default: bg-primary, text-primary-foreground - CTAs principales")
      addBullet("Outline: border, bg-background - Acciones secundarias")
      addBullet("Secondary: bg-secondary - Acciones terciarias")
      addBullet("Ghost: hover:bg-accent - Navegación, iconos")
      addBullet("Destructive: bg-destructive - Acciones peligrosas")
      addBullet("Link: text-primary, underline - Links inline")
      
      y += 5
      addSubtitle("Tamaños")
      addBullet("sm: h-8, px-3 - Botones compactos")
      addBullet("default: h-9, px-4 - Uso general")
      addBullet("lg: h-10, px-6 - CTAs hero")
      addBullet("icon: size-9 - Solo icono")
      
      y += 5
      addSubtitle("Características Comunes")
      addText("rounded-md (6px), text-sm, font-medium, transition-all, focus-visible:ring-[3px]")

      // PÁGINA 6 - Tarjetas
      doc.addPage()
      y = 20
      addTitle("4. Sistema de Tarjetas")
      y += 5
      
      addSubtitle("Card Base")
      addText("rounded-lg (12px), border, bg-card, shadow-sm")
      
      addSubtitle("Variantes de Card")
      addBullet("Default: Estilos base - Contenido general")
      addBullet("Problema: border-destructive/20, bg-destructive/5")
      addBullet("Solución: relative overflow-hidden + círculo decorativo")
      addBullet("Educativo: border-accent/20, bg-accent/5")
      addBullet("Indicador: Base + colores de señal dinámicos")
      
      y += 5
      addSubtitle("Estructura")
      addText("Card > CardHeader (CardDescription + CardTitle) > CardContent")

      // PÁGINA 7 - Espaciado
      doc.addPage()
      y = 20
      addTitle("5. Espaciado y Layout")
      y += 5
      
      addSubtitle("Escala de Espaciado")
      addBullet("gap-2 (8px): Espaciado mínimo")
      addBullet("gap-4 (16px): Espaciado estándar")
      addBullet("gap-6 (24px): Entre secciones menores")
      addBullet("gap-8 (32px): Entre cards")
      addBullet("py-12 (48px): Padding vertical secciones pequeñas")
      addBullet("py-24 (96px): Padding vertical secciones principales")
      
      y += 5
      addSubtitle("Contenedores")
      addBullet("max-w-7xl (1280px): Contenedor máximo")
      addBullet("max-w-5xl (1024px): Grids de contenido")
      addBullet("max-w-4xl (896px): Contenido centrado")
      addBullet("max-w-2xl (672px): Texto centrado")
      addBullet("px-6 lg:px-8: Padding lateral responsive")

      // PÁGINA 8 - Iconografía
      doc.addPage()
      y = 20
      addTitle("6. Iconografía")
      y += 5
      
      addSubtitle("Biblioteca")
      addText("Lucide React - Iconos consistentes y accesibles")
      
      addSubtitle("Tamaños Estándar")
      addBullet("h-4 w-4 (16px): Inline con texto")
      addBullet("h-5 w-5 (20px): Botones")
      addBullet("h-6 w-6 (24px): Cards destacado")
      addBullet("h-8 w-8 (32px): Loading/Hero")
      
      y += 5
      addSubtitle("Iconos Utilizados")
      addBullet("TrendingUp: Logo, comprar")
      addBullet("TrendingDown: Vender")
      addBullet("Minus: Mantener")
      addBullet("Search: Búsqueda")
      addBullet("Info: Tooltips educativos")
      addBullet("Shield, BookOpen, Zap: Secciones")

      // PÁGINA 9 - Estados
      doc.addPage()
      y = 20
      addTitle("7. Componentes de Estado")
      y += 5
      
      addSubtitle("Badges de Veredicto")
      addBullet("Comprar: bg-success/10, text-success, border-success/20")
      addBullet("Mantener: bg-warning/10, text-warning, border-warning/20")
      addBullet("Vender: bg-danger/10, text-danger, border-danger/20")
      
      addText("Formato: inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold")
      
      y += 5
      addSubtitle("Estados de Carga")
      addBullet("Spinner: animate-spin text-accent")
      addBullet("Skeleton: animate-pulse")
      
      addSubtitle("Estados Vacíos")
      addText("py-4 text-center text-muted-foreground")

      // PÁGINA 10 - Navegación
      doc.addPage()
      y = 20
      addTitle("8. Navegación")
      y += 5
      
      addSubtitle("Header")
      addText("sticky top-0 z-50, border-b border-border/40, bg-background/95, backdrop-blur")
      
      addSubtitle("Links de Navegación")
      addBullet("Activo: text-foreground")
      addBullet("Inactivo: text-muted-foreground")
      addBullet("Hover: hover:text-accent")
      
      addSubtitle("Footer")
      addText("border-t border-border, bg-secondary, py-12")

      // PÁGINA 11 - Inputs
      doc.addPage()
      y = 20
      addTitle("9. Inputs y Formularios")
      y += 5
      
      addSubtitle("Input Base")
      addText("h-9, rounded-md, border border-input, bg-transparent, px-3 py-1, text-sm")
      addText("placeholder:text-muted-foreground, focus-visible:ring-1 focus-visible:ring-ring")
      
      addSubtitle("Input con Icono")
      addText("Contenedor relative con icono absolute left-3 top-1/2 -translate-y-1/2")
      addText("Input con pl-10 para espacio del icono")

      // PÁGINA 12 - Animaciones
      doc.addPage()
      y = 20
      addTitle("10. Efectos y Animaciones")
      y += 5
      
      addSubtitle("Transiciones")
      addBullet("transition-colors: Solo color")
      addBullet("transition-all: Todas las propiedades")
      
      addSubtitle("Animaciones")
      addBullet("animate-ping: Pulso para indicador live")
      addBullet("animate-spin: Rotación para loading")
      addBullet("animate-pulse: Pulso para skeleton")
      
      addSubtitle("Efectos Decorativos")
      addText("Gradientes de fondo: blur-3xl opacity-30 con bg-gradient-to-tr")
      addText("Círculos decorativos: absolute con rounded-full bg-accent/5")

      // PÁGINA 13 - Responsive
      doc.addPage()
      y = 20
      addTitle("11. Responsive Design")
      y += 5
      
      addSubtitle("Breakpoints")
      addBullet("sm: 640px - Tablets pequeñas")
      addBullet("md: 768px - Tablets")
      addBullet("lg: 1024px - Desktop")
      
      addSubtitle("Patrones Responsive")
      addBullet("Grid: grid sm:grid-cols-2 lg:grid-cols-3")
      addBullet("Flex a Grid: flex flex-col sm:flex-row")
      addBullet("Tipografía: text-4xl sm:text-6xl lg:text-7xl")
      addBullet("Padding: px-6 lg:px-8")
      addBullet("Mostrar/ocultar: hidden md:flex / md:hidden")

      // PÁGINA 14 - Accesibilidad
      doc.addPage()
      y = 20
      addTitle("12. Accesibilidad")
      y += 5
      
      addSubtitle("Focus States")
      addText("outline-none, focus-visible:border-ring, focus-visible:ring-ring/50, focus-visible:ring-[3px]")
      
      addSubtitle("ARIA")
      addBullet("Tooltips con TooltipProvider, TooltipTrigger, TooltipContent")
      addBullet("aria-hidden en elementos decorativos")
      addBullet("Links semánticos con asChild de Radix")
      
      addSubtitle("Contraste")
      addBullet("Texto principal: ~10:1 ratio")
      addBullet("Texto secundario: ~4.5:1 ratio")
      addBullet("Colores de veredicto probados para contraste")

      // PÁGINA 15 - Border Radius
      doc.addPage()
      y = 20
      addTitle("13. Border Radius")
      y += 5
      
      addSubtitle("Tokens de Radio")
      addBullet("--radius: 0.75rem (12px)")
      addBullet("--radius-sm: 8px")
      addBullet("--radius-md: 10px")
      addBullet("--radius-lg: 12px")
      addBullet("--radius-xl: 16px")
      
      addSubtitle("Uso Común")
      addBullet("rounded-md: Botones, inputs")
      addBullet("rounded-lg: Cards")
      addBullet("rounded-full: Badges, avatares")
      addBullet("rounded-2xl: Cards destacadas")

      setStatus("Descargando...")
      
      // Guardar
      doc.save("StockSense-Design-Report.pdf")
      
      // Redirigir a home después de descargar
      setTimeout(() => {
        window.location.href = "/"
      }, 1500)
    }

    generatePDF()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-lg font-medium">{status}</p>
        <p className="text-sm text-muted-foreground">La descarga comenzará automáticamente</p>
      </div>
    </div>
  )
}
