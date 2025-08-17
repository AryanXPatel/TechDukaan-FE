"use client"

import { useMemo } from "react"
import { useCart } from "@/components/cart/cart-context"
import { calcBulkDiscount, getBulkDiscountPercent, nextTierInfo } from "@/lib/bulk"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function BulkDiscountBar({ className }: { className?: string }) {
  const { items, total, count } = useCart()
  const { pct, amount } = useMemo(() => calcBulkDiscount(total, count), [total, count])
  const next = useMemo(() => nextTierInfo(count), [count])

  const progress = useMemo(() => {
    // map to 0-100 over current tier span
    if (count < 3) return Math.min(100, Math.round((count / 3) * 100))
    if (count < 5) return Math.min(100, Math.round(((count - 3) / (5 - 3)) * 100))
    if (count < 10) return Math.min(100, Math.round(((count - 5) / (10 - 5)) * 100))
    return 100
  }, [count])

  if (items.length === 0) return null

  return (
    <div
      className={cn(
        "rounded-lg border bg-neutral-50/60 p-3 text-sm dark:bg-neutral-900/40",
        pct > 0 && "ring-1 ring-emerald-200 dark:ring-emerald-900/30",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-emerald-600" />
          <span>
            Bulk pricing:{" "}
            {pct > 0 ? (
              <>
                <span className="font-medium">{pct}% off</span> applied (−₹{amount.toLocaleString()})
              </>
            ) : (
              <>Add 3+ items to save more</>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            {count} item{count !== 1 ? "s" : ""} in cart
          </Badge>
          <Badge variant="outline" className="bg-transparent">
            Current: {getBulkDiscountPercent(count)}%
          </Badge>
        </div>
      </div>
      <div className="mt-2">
        <Progress value={progress} className="h-2" />
        {next ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Add {next.nextAt - count} more item{next.nextAt - count !== 1 ? "s" : ""} to unlock{" "}
            <span className="font-medium">{next.percent}%</span> off
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">You’ve unlocked the best bulk price.</p>
        )}
      </div>
    </div>
  )
}
