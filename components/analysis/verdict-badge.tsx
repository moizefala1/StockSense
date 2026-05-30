import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Verdict } from "@/lib/types"

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const config = {
    comprar: {
      icon: TrendingUp,
      label: "Comprar",
      className: "border-success/20 bg-success/5 text-success",
    },
    mantener: {
      icon: Minus,
      label: "Mantener",
      className: "border-warning/20 bg-warning/5 text-warning",
    },
    vender: {
      icon: TrendingDown,
      label: "Vender",
      className: "border-danger/20 bg-danger/5 text-danger",
    },
  }

  const { icon: Icon, label, className } = config[verdict]

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border px-5 py-3 text-lg font-semibold", className)}>
      <Icon className="h-7 w-7" />
      {label}
    </div>
  )
}
