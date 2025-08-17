import { CheckCircle2 } from "lucide-react"

export function IncludedList({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return (
    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
      {items.map((it) => (
        <li key={it} className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}
