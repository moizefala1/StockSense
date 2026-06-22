"use client"

import { useState } from "react"
import { GraduationCap, TrendingUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { KnowledgeLevel, KnowledgeProfile } from "@/lib/tutorial"
import { TUTORIAL_PROFILE_VERSION, knowledgeLevelOptions } from "@/lib/tutorial"

interface KnowledgeOnboardingProps {
  onComplete: (profile: KnowledgeProfile) => void
}

const levelIcons = {
  bajo: GraduationCap,
  medio: Target,
  alto: TrendingUp,
}

export function KnowledgeOnboarding({ onComplete }: KnowledgeOnboardingProps) {
  const [step, setStep] = useState<"welcome" | "profile">("welcome")
  const [selectedLevel, setSelectedLevel] = useState<KnowledgeLevel>("bajo")
  const [goal, setGoal] = useState("")

  const handleComplete = () => {
    onComplete({
      level: selectedLevel,
      goal: goal.trim() || "Aprender a usar StockSense",
      createdAt: new Date().toISOString(),
      version: TUTORIAL_PROFILE_VERSION,
    })
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/70 px-4 py-6 backdrop-blur-sm">
      <Card className="max-h-[92vh] w-full max-w-3xl overflow-y-auto border-border bg-card shadow-2xl">
        {step === "welcome" ? (
          <>
            <CardHeader className="gap-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-3xl text-primary">Bienvenido a StockSense</CardTitle>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Antes de usar la plataforma, vamos a ajustar la experiencia a tu nivel de conocimiento. Asi el tutorial explica solo lo necesario y mantiene el foco en cada parte importante de la pagina.
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 text-center">
              <div className="mx-auto grid max-w-2xl gap-3 text-left sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-primary">1. Nivel</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Dinos cuanto sabes de inversiones.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-primary">2. Tutorial</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    La guia cambia segun tu respuesta.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-primary">3. Cookie</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Guardamos tu eleccion en este navegador.
                  </p>
                </div>
              </div>

              <Button onClick={() => setStep("profile")} size="lg">
                Continuar
              </Button>
            </CardContent>
          </>
        ) : (
          <>
        <CardHeader className="gap-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl text-primary">Antes de empezar</CardTitle>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Ajustaremos el tutorial segun tu conocimiento previo en inversiones. La eleccion queda guardada en este navegador.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            {knowledgeLevelOptions.map((option) => {
              const Icon = levelIcons[option.level]
              const isSelected = selectedLevel === option.level

              return (
                <button
                  key={option.level}
                  type="button"
                  onClick={() => setSelectedLevel(option.level)}
                  className={cn(
                    "flex h-full flex-col rounded-xl border p-4 text-left transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                    isSelected
                      ? "border-accent bg-accent/10 shadow-sm"
                      : "border-border bg-background hover:border-accent/40 hover:bg-muted"
                  )}
                  aria-pressed={isSelected}
                >
                  <div
                    className={cn(
                      "mb-4 flex h-10 w-10 items-center justify-center rounded-lg",
                      isSelected ? "bg-accent text-accent-foreground" : "bg-muted text-primary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-primary">{option.title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </span>
                </button>
              )
            })}
          </div>

          <label className="block">
            <span className="text-sm font-medium text-primary">Que quieres lograr hoy?</span>
            <input
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Ej: entender si una accion parece conveniente"
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-[border,color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Tu preferencia se guardara en este navegador para no preguntarte de nuevo.
            </p>
            <Button onClick={handleComplete} className="sm:min-w-44">
              Iniciar tutorial
            </Button>
          </div>
        </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
