import { Badge } from "@/components/ui/badge"
import type { ConditionGrade } from "@/lib/products"

export function ConditionBadge({ grade }: { grade?: ConditionGrade }) {
  if (!grade) return null
  const map: Record<NonNullable<ConditionGrade>, { cls: string }> = {
    Excellent: { cls: "bg-emerald-100 text-emerald-700" },
    Good: { cls: "bg-amber-100 text-amber-700" },
    Fair: { cls: "bg-sky-100 text-sky-700" },
  }
  return <Badge className={map[grade].cls}>{grade} condition</Badge>
}
