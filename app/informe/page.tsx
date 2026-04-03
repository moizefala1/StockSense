"use client"

import dynamic from "next/dynamic"

const PDFGenerator = dynamic(() => import("@/components/pdf-generator"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-lg font-medium">Cargando...</p>
      </div>
    </div>
  ),
})

export default function InformePage() {
  return <PDFGenerator />
}
