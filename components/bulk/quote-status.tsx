import { Badge } from "@/components/ui/badge"
import type { QuoteStatus } from "./quotes-context"

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const map: Record<QuoteStatus, string> = {
    requested: "bg-neutral-100 text-neutral-700",
    review: "bg-sky-100 text-sky-700",
    quoted: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  }
  const label = status[0].toUpperCase() + status.slice(1)
  return <Badge className={map[status]}>{label}</Badge>
}
