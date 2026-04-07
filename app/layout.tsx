import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StockSense - Análisis de Acciones Simplificado',
  description: 'Recibe recomendaciones claras de Comprar, Mantener o Vender basadas en indicadores técnicos, explicados de forma simple. Invierte con confianza.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
} : {  
children: React.ReactNode  
}) 

{
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
