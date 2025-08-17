import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export function StockIndicator({ stock }: { stock?: number }) {
  if (typeof stock !== "number") return null
  const status = stock <= 0 ? "out" : stock <= 2 ? "very-low" : stock <= 5 ? "low" : stock <= 10 ? "in" : "in"
  const label =
    status === "out"
      ? "Out of stock"
      : status === "very-low"
        ? "Only 2 left"
        : status === "low"
          ? "Low stock"
          : "In stock"
  const color =
    status === "out"
      ? "text-red-500"
      : status === "very-low"
        ? "text-amber-600"
        : status === "low"
          ? "text-amber-600"
          : "text-emerald-600"
  return (
    <div className="flex items-center gap-2 text-sm">
      <Circle className={cn("h-3 w-3", color)} fill="currentColor" />
      <span className={cn(color)}>{label}</span>
    </div>
  )
}
