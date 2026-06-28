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
  onStepChange?: (stepId: string) => void
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

const scrollKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Spacebar"])

const PANEL_SAFE_PADDING = 16
const PANEL_MAX_HEIGHT = 360
const PANEL_MIN_FLOATING_HEIGHT = 150

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getPreferredPanelWidth(
  viewportWidth: number,
  panelWidth: TutorialStep["panelWidth"] = "default"
) {
  if (panelWidth === "compact") {
    return viewportWidth >= 768 ? 340 : viewportWidth - PANEL_SAFE_PADDING * 2
  }

  if (panelWidth === "balanced") {
    if (viewportWidth >= 1280) return 460
    if (viewportWidth >= 768) return 440
    return viewportWidth - PANEL_SAFE_PADDING * 2
  }

  if (panelWidth === "wide") {
    if (viewportWidth >= 1280) return 960
    if (viewportWidth >= 1024) return 840
    if (viewportWidth >= 768) return 680
  }

  if (viewportWidth >= 1280) return 520
  if (viewportWidth >= 1024) return 480
  if (viewportWidth >= 768) return 440

  return viewportWidth - PANEL_SAFE_PADDING * 2
}

function getPaddedRect(
  rect: RectState,
  viewport: ViewportState,
  offsetY = 0
): RectState {
  const padding = viewport.width < 640 ? 14 : 22
  const adjustedTop = rect.top + offsetY
  const topBoundary = offsetY < 0 ? 0 : 8
  const left = Math.max(8, rect.left - padding)
  const top = Math.max(topBoundary, adjustedTop - padding)
  const right = Math.min(viewport.width - 8, rect.left + rect.width + padding)
  const bottom = Math.min(viewport.height - 8, adjustedTop + rect.height + padding)

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
  placement: TutorialStep["placement"],
  panelWidth: TutorialStep["panelWidth"]
): CSSProperties {
  const margin = 20
  const preferredWidth = getPreferredPanelWidth(viewport.width, panelWidth)
  const width = Math.min(preferredWidth, viewport.width - PANEL_SAFE_PADDING * 2)
  const availableHeight = Math.max(160, viewport.height - PANEL_SAFE_PADDING * 2)
  const fullMaxHeight = Math.min(PANEL_MAX_HEIGHT, availableHeight)

  if (!rect) {
    return {
      width,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      maxHeight: fullMaxHeight,
    }
  }

  const centeredLeft = Math.min(
    Math.max(PANEL_SAFE_PADDING, rect.left + rect.width / 2 - width / 2),
    Math.max(PANEL_SAFE_PADDING, viewport.width - width - PANEL_SAFE_PADDING)
  )
  const bottomTop = rect.top + rect.height + margin
  const spaceAbove = rect.top - margin - PANEL_SAFE_PADDING
  const spaceBelow = viewport.height - bottomTop - PANEL_SAFE_PADDING
  const rightLeft = rect.left + rect.width + margin
  const leftLeft = rect.left - width - margin
  const hasRoomRight = viewport.width >= 900 && rightLeft + width <= viewport.width - PANEL_SAFE_PADDING
  const hasRoomLeft = viewport.width >= 900 && leftLeft >= PANEL_SAFE_PADDING
  const sideTop = clamp(
    rect.top + rect.height / 2 - fullMaxHeight / 2,
    PANEL_SAFE_PADDING,
    viewport.height - fullMaxHeight - PANEL_SAFE_PADDING
  )

  const getSidePlacement = () => {
    if (placement === "right" && hasRoomRight) {
      return { left: rightLeft, top: sideTop, maxHeight: fullMaxHeight }
    }

    if (placement === "left" && hasRoomLeft) {
      return { left: leftLeft, top: sideTop, maxHeight: fullMaxHeight }
    }

    if (hasRoomRight) {
      return { left: rightLeft, top: sideTop, maxHeight: fullMaxHeight }
    }

    if (hasRoomLeft) {
      return { left: leftLeft, top: sideTop, maxHeight: fullMaxHeight }
    }

    return null
  }

  const getVerticalPlacement = () => {
    if (placement === "top" && spaceAbove >= PANEL_MIN_FLOATING_HEIGHT) {
      const maxHeight = Math.min(fullMaxHeight, spaceAbove)
      return { top: rect.top - margin - maxHeight, maxHeight }
    }

    if (placement === "bottom" && spaceBelow >= PANEL_MIN_FLOATING_HEIGHT) {
      return { top: bottomTop, maxHeight: Math.min(fullMaxHeight, spaceBelow) }
    }

    const sidePlacement = getSidePlacement()
    if (sidePlacement) return sidePlacement

    if (spaceBelow >= spaceAbove && spaceBelow >= PANEL_MIN_FLOATING_HEIGHT) {
      return { top: bottomTop, maxHeight: Math.min(fullMaxHeight, spaceBelow) }
    }

    if (spaceAbove >= PANEL_MIN_FLOATING_HEIGHT) {
      const maxHeight = Math.min(fullMaxHeight, spaceAbove)
      return { top: rect.top - margin - maxHeight, maxHeight }
    }

    if (spaceBelow > 96) {
      return { top: bottomTop, maxHeight: Math.min(fullMaxHeight, spaceBelow) }
    }

    if (spaceAbove > 96) {
      const maxHeight = Math.min(fullMaxHeight, spaceAbove)
      return { top: rect.top - margin - maxHeight, maxHeight }
    }

    return { top: PANEL_SAFE_PADDING, maxHeight: Math.min(fullMaxHeight, availableHeight) }
  }

  if (placement === "left" && viewport.width >= 900) {
    if (!hasRoomLeft) {
      const verticalPlacement = getVerticalPlacement()

      return {
        width,
        left: "left" in verticalPlacement ? verticalPlacement.left : centeredLeft,
        top: verticalPlacement.top,
        maxHeight: verticalPlacement.maxHeight,
      }
    }

    return {
      width,
      left: leftLeft,
      top: sideTop,
      maxHeight: fullMaxHeight,
    }
  }

  if (placement === "right" && viewport.width >= 900) {
    if (!hasRoomRight) {
      const verticalPlacement = getVerticalPlacement()

      return {
        width,
        left: "left" in verticalPlacement ? verticalPlacement.left : centeredLeft,
        top: verticalPlacement.top,
        maxHeight: verticalPlacement.maxHeight,
      }
    }

    return {
      width,
      left: rightLeft,
      top: sideTop,
      maxHeight: fullMaxHeight,
    }
  }

  const verticalPlacement = getVerticalPlacement()

  return {
    width,
    left: "left" in verticalPlacement ? verticalPlacement.left : centeredLeft,
    ...verticalPlacement,
  }
}

export function TutorialOverlay({ isOpen, steps, onFinish, onStepChange }: TutorialOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<RectState | null>(null)
  const [viewport, setViewport] = useState<ViewportState>({ width: 1200, height: 800 })

  const currentStep = steps[stepIndex]
  const paddedRect = useMemo(
    () => (targetRect ? getPaddedRect(targetRect, viewport, currentStep?.spotlightOffsetY) : null),
    [currentStep, targetRect, viewport]
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
    if (!isOpen) return

    const preventScroll = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (target?.closest("[data-tutorial-panel]")) return

      event.preventDefault()
    }
    const preventScrollKey = (event: KeyboardEvent) => {
      if (!scrollKeys.has(event.key)) return

      const target = event.target as HTMLElement | null
      if (target?.closest("[data-tutorial-panel]")) return

      event.preventDefault()
    }

    window.addEventListener("wheel", preventScroll, { capture: true, passive: false })
    window.addEventListener("touchmove", preventScroll, { capture: true, passive: false })
    window.addEventListener("keydown", preventScrollKey, { capture: true })

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      window.removeEventListener("wheel", preventScroll, { capture: true })
      window.removeEventListener("touchmove", preventScroll, { capture: true })
      window.removeEventListener("keydown", preventScrollKey, { capture: true })
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.paddingRight = previousBodyPaddingRight
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !currentStep) return

    onStepChange?.(currentStep.id)

    const element = document.querySelector<HTMLElement>(
      `[data-tutorial-id="${currentStep.targetId}"]`
    )

    if (element) {
      const rect = element.getBoundingClientRect()
      const absoluteTop = window.scrollY + rect.top
      const alignment =
        currentStep.scrollPosition ?? (currentStep.placement === "top" ? "end" : "start")
      const viewportGap = currentStep.viewportGap ?? 96
      const scrollTop =
        alignment === "center"
          ? absoluteTop - (window.innerHeight - rect.height) / 2
          : alignment === "end"
            ? absoluteTop - window.innerHeight + rect.height + viewportGap
            : absoluteTop - viewportGap

      window.scrollTo({ top: Math.max(0, scrollTop), behavior: "smooth" })
    }
    const timer = window.setTimeout(updateRect, 260)

    return () => window.clearTimeout(timer)
  }, [currentStep, isOpen, onStepChange, updateRect])

  useEffect(() => {
    if (!isOpen) return

    window.addEventListener("resize", updateRect)
    window.addEventListener("scroll", updateRect, true)

    return () => {
      window.removeEventListener("resize", updateRect)
      window.removeEventListener("scroll", updateRect, true)
    }
  }, [isOpen, updateRect])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onFinish()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onFinish])

  if (!isOpen || !currentStep) return null

  const isLastStep = stepIndex === steps.length - 1
  const navigationOnly = currentStep.panelMode === "navigation"
  const showSpotlight = Boolean(paddedRect) && currentStep.spotlightMode !== "hidden"
  const panelAnchorRect = showSpotlight ? paddedRect : null
  const panelWidth = currentStep.panelWidth ?? (navigationOnly ? "compact" : "default")

  return (
    <div className="fixed inset-0 z-[80] pointer-events-auto animate-in fade-in duration-200" aria-live="polite">
      {showSpotlight && paddedRect ? (
        <div
          className="absolute rounded-[2rem] border-2 border-accent pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: paddedRect.top,
            left: paddedRect.left,
            width: paddedRect.width,
            height: paddedRect.height,
            boxShadow:
              "0 0 0 9999px color-mix(in oklab, var(--primary) 72%, transparent), 0 0 0 5px color-mix(in oklab, var(--accent) 18%, transparent), 0 18px 60px rgb(0 0 0 / 0.24)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-primary/72 backdrop-blur-sm pointer-events-auto" />
      )}

      <div
        className={`absolute pointer-events-auto flex flex-col overflow-hidden border border-border bg-card shadow-2xl transition-[top,left,transform,opacity] duration-300 ease-out animate-in fade-in zoom-in-95 ${
          navigationOnly ? "rounded-xl p-3" : "rounded-2xl p-4"
        }`}
        style={getPanelStyle(
          panelAnchorRect,
          viewport,
          currentStep.placement,
          panelWidth
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Tutorial de StockSense"
        tabIndex={-1}
        data-tutorial-panel
      >
        <button
          type="button"
          onClick={onFinish}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Cerrar tutorial"
        >
          <X className="h-4 w-4" />
        </button>

        {!navigationOnly && (
          <div
            key={currentStep.id}
            className="min-h-0 flex-1 overflow-y-auto pr-7 animate-in fade-in-0 slide-in-from-bottom-1 duration-200"
            data-tutorial-scroll
          >
            <h2 className="text-lg font-semibold leading-tight text-primary">{currentStep.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {currentStep.description}
            </p>
          </div>
        )}

        <div className={`${navigationOnly ? "mt-0" : "mt-3 border-t border-border/60 pt-3"} shrink-0`}>
          <div className="mb-1 text-[11px] leading-none text-muted-foreground">
            <span>
              Paso {stepIndex + 1} de {steps.length}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
              disabled={stepIndex === 0}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Anterior
            </Button>

            <Button
              type="button"
              size="sm"
              className="h-7 px-2.5 text-xs"
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
                  {currentStep.finishLabel ?? "Terminar"}
                  <Check className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  {currentStep.nextLabel ?? "Siguiente"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
