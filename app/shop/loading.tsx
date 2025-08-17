import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-6">
        <Skeleton className="h-6 w-48" />
        <div className="mt-2 flex gap-3">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-24 md:hidden" />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <div className="hidden space-y-3 md:block">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
