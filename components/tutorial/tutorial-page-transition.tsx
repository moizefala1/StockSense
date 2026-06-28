"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

interface StartTransitionOptions {
  href: string
  onNavigate: () => void
  beforeNavigate?: () => void
  direction?: "forward" | "backward"
}

interface StoredTransition {
  direction: "forward" | "backward"
  href: string
}

const MOVE_DURATION_MS = 900
const DEFAULT_PREVIEW_DURATION_MS = 1100
const HOME_PREVIEW_DURATION_MS = 1100
const STORAGE_KEY = "stocksense-tutorial-route-transition"
const SNAPSHOT_CLASS = "tutorial-route-snapshot"

function getRoot() {
  return document.documentElement
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function removeSnapshots() {
  document.querySelectorAll(`.${SNAPSHOT_CLASS}`).forEach((snapshot) => snapshot.remove())
}

function clearTransitionAttributes() {
  const root = getRoot()
  delete root.dataset.tutorialRoutePending
  delete root.dataset.tutorialRouteEnter
}

function clearTransitionArtifacts() {
  clearTransitionAttributes()
  removeSnapshots()
}

function createPageSnapshot(direction: StoredTransition["direction"]) {
  const snapshot = document.createElement("div")
  snapshot.className = SNAPSHOT_CLASS
  snapshot.dataset.direction = direction
  snapshot.setAttribute("aria-hidden", "true")
  Object.assign(snapshot.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483000",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    pointerEvents: "none",
    color: "var(--foreground)",
    backgroundColor: window.getComputedStyle(document.body).backgroundColor,
    transformOrigin: "center",
    willChange: "opacity, transform",
  })

  const surface = document.createElement("div")
  surface.className = `${document.body.className} tutorial-route-snapshot-surface`
  Object.assign(surface.style, {
    position: "absolute",
    top: `${-window.scrollY}px`,
    left: "0",
    width: "100%",
    minHeight: `${document.body.scrollHeight}px`,
  })

  Array.from(document.body.children).forEach((child) => {
    if (!child.classList.contains(SNAPSHOT_CLASS) && child.tagName !== "SCRIPT") {
      surface.appendChild(child.cloneNode(true))
    }
  })

  snapshot.appendChild(surface)
  document.body.appendChild(snapshot)
  return snapshot
}

function animatePageLayers(direction: StoredTransition["direction"]) {
  const oldPageOffset = direction === "forward" ? "-18vw" : "18vw"
  const newPageOffset = direction === "forward" ? "18vw" : "-18vw"
  const options: KeyframeAnimationOptions = {
    duration: MOVE_DURATION_MS,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "both",
  }

  const animations: Animation[] = []

  document.querySelectorAll<HTMLElement>(`.${SNAPSHOT_CLASS}`).forEach((snapshot) => {
    animations.push(
      snapshot.animate(
        [
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          { opacity: 0.08, transform: `translate3d(${oldPageOffset}, 0, 0) scale(0.985)` },
        ],
        options
      )
    )
  })

  Array.from(document.body.children).forEach((element) => {
    if (
      !(element instanceof HTMLElement) ||
      element.classList.contains(SNAPSHOT_CLASS) ||
      ["SCRIPT", "STYLE", "NEXT-ROUTE-ANNOUNCER"].includes(element.tagName)
    ) {
      return
    }

    const bounds = element.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) return

    animations.push(
      element.animate(
        [
          { opacity: 0.18, transform: `translate3d(${newPageOffset}, 0, 0) scale(0.985)` },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        ],
        options
      )
    )
  })

  return animations
}

function readStoredTransition(): StoredTransition | null {
  const storedValue = window.sessionStorage.getItem(STORAGE_KEY)
  if (!storedValue) return null

  try {
    const stored = JSON.parse(storedValue) as StoredTransition
    if (stored.direction !== "forward" && stored.direction !== "backward") return null
    return stored
  } catch {
    return null
  }
}

export function useTutorialPageTransition() {
  const [isTransitionSettling, setIsTransitionSettling] = useState(() => {
    if (typeof window === "undefined") return false
    return Boolean(window.sessionStorage.getItem(STORAGE_KEY))
  })
  const motionTimerRef = useRef<number | null>(null)
  const resumeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const transition = readStoredTransition()
    if (!transition || prefersReducedMotion()) {
      window.sessionStorage.removeItem(STORAGE_KEY)
      clearTransitionArtifacts()
      window.setTimeout(() => setIsTransitionSettling(false), 0)
      return
    }

    const root = getRoot()
    delete root.dataset.tutorialRoutePending
    root.dataset.tutorialRouteEnter = transition.direction

    const animations = animatePageLayers(transition.direction)

    motionTimerRef.current = window.setTimeout(() => {
      animations.forEach((animation) => animation.cancel())
      window.sessionStorage.removeItem(STORAGE_KEY)
      clearTransitionArtifacts()
    }, MOVE_DURATION_MS)

    const destinationPath = new URL(transition.href, window.location.origin).pathname
    const previewDuration =
      destinationPath === "/" ? HOME_PREVIEW_DURATION_MS : DEFAULT_PREVIEW_DURATION_MS

    resumeTimerRef.current = window.setTimeout(() => {
      setIsTransitionSettling(false)
    }, MOVE_DURATION_MS + previewDuration)

    return () => {
      if (motionTimerRef.current !== null) window.clearTimeout(motionTimerRef.current)
      if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current)
      animations.forEach((animation) => animation.cancel())
    }
  }, [])

  const startTransition = useCallback(
    ({ href, onNavigate, beforeNavigate, direction = "forward" }: StartTransitionOptions) => {
      if (typeof window === "undefined" || prefersReducedMotion()) {
        beforeNavigate?.()
        onNavigate()
        return
      }

      clearTransitionArtifacts()

      if (beforeNavigate) {
        flushSync(beforeNavigate)
      }

      createPageSnapshot(direction)
      const root = getRoot()
      root.dataset.tutorialRoutePending = direction
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ direction, href }))
      setIsTransitionSettling(true)

      onNavigate()

      window.setTimeout(() => {
        if (window.sessionStorage.getItem(STORAGE_KEY)) {
          window.sessionStorage.removeItem(STORAGE_KEY)
          clearTransitionArtifacts()
          setIsTransitionSettling(false)
        }
      }, 6000)
    },
    []
  )

  return { isTransitionSettling, startTransition }
}
