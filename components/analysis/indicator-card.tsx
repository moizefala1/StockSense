import { Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Verdict } from "@/lib/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function IndicatorCard({
  title,
  value,
  signal,
  description,
  tooltip,
}: {
  title: string
  value: string | number
  signal: Verdict
  description: string
  tooltip: string
}) {
  const signalColors = {
    comprar: "text-success",
    mantener: "text-warning",
    vender: "text-danger",
  }

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="pt-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex">
                    <Info className="h-4 w-4 text-muted-foreground/60" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <p className="mt-2 text-2xl font-bold text-primary">
          {typeof value === "number" ? value.toFixed(2) : value}
        </p>

        <p className={cn("mt-2 text-sm leading-relaxed", signalColors[signal])}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
