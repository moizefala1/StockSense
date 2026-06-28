"use client"

import { Card, CardContent } from "@/components/ui/card"

export function TutorialSkeleton() {
  return (
    <Card className="mx-auto max-w-3xl border-border shadow-sm">
      <CardContent className="space-y-5 py-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-44 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}
