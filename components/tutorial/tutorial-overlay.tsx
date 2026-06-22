"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { KnowledgeLevel, TutorialStep } from "@/lib/tutorial"

interface TutorialOverlayProps {
  isOpen: boolean
  level: KnowledgeLevel
  steps: TutorialStep[]
  onFinish: () => void
}

interface RectState {
  top: number
  left: number
  width: number
  height: number
}

interface ViewportState {
  width: number
  height: number
}

const categoryLabels: Record<TutorialStep["category"], string> = {
  stocks: "Stocks",
  recommendations: "Recomendaciones",
  page: "Pagina",
}

const levelLabels: Record<KnowledgeLevel, string> = {
  bajo: "Nivel bajo",
  medio: "Nivel medio",
  alto: "Nivel alto",
}

function getPaddedRect(rect: RectState, viewport: ViewportState): RectState {
  const padding = 10
  const left = Math.max(8, rect.left - padding)
  const top = Math.max(8, rect.top - padding)
  const right = Math.min(viewport.width - 8, rect.left + rect.width + padding)
  const bottom = Math.min(viewport.height - 8, rect.top + rect.height + padding)

  return {
    left,
    top,
    width: Math.max(1, right - left),
    height: Math.max(1, bottom - top),
  }
}

function getPanelStyle(
  rect: RectState | null,
  viewport: ViewportState,
  placement: TutorialStep["placement"]
): CSSProperties {
  const margin = 18
  const width = Math.min(360, viewport.width - 32)

  if (!rect) {
    return {
      width,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    }
  }

  const centeredLeft = Math.min(
    Math.max(16, rect.left + rect.width / 2 - width / 2),
    Math.max(16, viewport.width - width - 16)
  )

  if (placement === "top") {
    return {
      width,
      left: centeredLeft,
      top: Math.max(16, rect.top - margin),
      transform: rect.top < 260 ? "translateY(0)" : "translateY(-100%)",
    }
  }

  if (placement === "left" && viewport.width >= 900) {
    return {
      width,
      left: Math.max(16, rect.left - width - margin),
      top: Math.max(16, Math.min(Math.max(16, rect.top), viewport.height - 260)),
    }
  }

  if (placement === "right" && viewport.width >= 900) {
    return {
      width,
      left: Math.min(viewport.width - width - 16, rect.left + rect.width + margin),
      top: Math.max(16, Math.min(Math.max(16, rect.top), viewport.height - 260)),
    }
  }

  return {
    width,
    left: centeredLeft,
    top: Math.max(16, Math.min(rect.top + rect.height + margin, viewport.height - 260)),
  }
}

export function TutorialOverlay({ isOpen, level, steps, onFinish }: TutorialOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<RectState | null>(null)
  const [viewport, setViewport] = useState<ViewportState>({ width: 1200, height: 800 })

  const currentStep = steps[stepIndex]
  const paddedRect = useMemo(
    () => (targetRect ? getPaddedRect(targetRect, viewport) : null),
    [targetRect, viewport]
  )

  const updateRect = useCallback(() => {
    if (typeof window === "undefined" || !currentStep) return

    setViewport({ width: window.innerWidth, height: window.innerHeight })

    const element = document.querySelector<HTMLElement>(
      `[data-tutorial-id="${currentStep.targetId}"]`
    )

    if (!element) {
      setTargetRect(null)
      return
    }

    const rect = element.getBoundingClientRect()
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
  }, [currentStep])

  useEffect(() => {
    if (!isOpen || !currentStep) return

    const element = document.querySelector<HTMLElement>(
      `[data-tutorial-id="${currentStep.targetId}"]`
    )

    element?.scrollIntoView({ block: "center", behavior: "smooth" })
    const timer = window.setTimeout(updateRect, 260)

    return () => window.clearTimeout(timer)
  }, [currentStep, isOpen, updateRect])

  useEffect(() => {
    if (!isOpen) return

    window.addEventListener("resize", updateRect)
    window.addEventListener("scroll", updateRect, true)

    return () => {
      window.removeEventListener("resize", updateRect)
      window.removeEventListener("scroll", updateRect, true)
    }
  }, [isOpen, updateRect])

  if (!isOpen || !currentStep) return null

  const panelStyle = getPanelStyle(paddedRect, viewport, currentStep.placement)
  const isLastStep = stepIndex === steps.length - 1

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none" aria-live="polite">
      {paddedRect ? (
        <>
          <div
            className="absolute bg-primary/72 backdrop-blur-[1px] pointer-events-auto"
            style={{ top: 0, left: 0, width: "100%", height: paddedRect.top }}
          />
          <div
            className="absolute bg-primary/72 backdrop-blur-[1px] pointer-events-auto"
            style={{
              top: paddedRect.top + paddedRect.height,
              left: 0,
              width: "100%",
              bottom: 0,
            }}
          />
          <div
            className="absolute bg-primary/72 backdrop-blur-[1px] pointer-events-auto"
            style={{
              top: paddedRect.top,
              left: 0,
              width: paddedRect.left,
              height: paddedRect.height,
            }}
          />
          <div
            className="absolute bg-primary/72 backdrop-blur-[1px] pointer-events-auto"
            style={{
              top: paddedRect.top,
              left: paddedRect.left + paddedRect.width,
              right: 0,
              height: paddedRect.height,
            }}
          />
          <div
            className="absolute rounded-[1.25rem] border-2 border-accent shadow-[0_0_0_4px_oklch(0.76_0.136_212_/_0.16),0_18px_60px_rgba(0,0,0,0.24)]"
            style={paddedRect}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-primary/72 backdrop-blur-sm pointer-events-auto" />
      )}

      <div
        className="absolute pointer-events-auto rounded-2xl border border-border bg-card p-5 shadow-2xl"
        style={panelStyle}
        role="dialog"
        aria-label="Tutorial de StockSense"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {levelLabels[level]}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {categoryLabels[currentStep.category]}
            </span>
          </div>
          <button
            type="button"
            onClick={onFinish}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Cerrar tutorial"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="text-lg font-semibold leading-tight text-primary">{currentStep.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {currentStep.description}
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Paso {stepIndex + 1} de {steps.length}
            </span>
            <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            disabled={stepIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (isLastStep) {
                onFinish()
              } else {
                setStepIndex((current) => current + 1)
              }
            }}
          >
            {isLastStep ? (
              <>
                Terminar
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
