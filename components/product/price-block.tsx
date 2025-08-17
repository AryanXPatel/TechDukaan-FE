import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function PriceBlock({
  sale,
  mrp,
  discountPct,
  className,
}: {
  sale: string
  mrp?: string
  discountPct?: number
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <div className="text-lg font-semibold">{sale}</div>
        {discountPct ? <Badge className="bg-emerald-100 text-emerald-700">{discountPct}% off</Badge> : null}
      </div>
      {mrp ? (
        <div className="text-sm text-muted-foreground">
          MRP: <span className="line-through">{mrp}</span>
          <span className="sr-only">, discounted price {sale}</span>
        </div>
      ) : null}
    </div>
  )
}
