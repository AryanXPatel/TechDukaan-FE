import { cn } from "@/lib/utils"

export function SpecsTable({ rows, className }: { rows: [string, string][]; className?: string }) {
  return (
    <dl className={cn("divide-y rounded-lg border", className)}>
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-3 gap-4 px-4 py-3 sm:px-5">
          <dt className="col-span-1 text-sm text-muted-foreground">{k}</dt>
          <dd className="col-span-2 text-sm">{v}</dd>
        </div>
      ))}
    </dl>
  )
}
