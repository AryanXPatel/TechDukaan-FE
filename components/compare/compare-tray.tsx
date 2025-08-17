"use client"

import Link from "next/link"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCompare } from "./compare-context"

export function CompareTray() {
  const { items, remove, clear } = useCompare()
  if (items.length === 0) return null
  const ids = items.map((i) => i.id).join(",")
  return (
    <div className="fixed bottom-3 left-1/2 z-40 w-[95vw] max-w-5xl -translate-x-1/2 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {items.map((i) => (
            <div key={i.id} className="relative h-12 w-16 overflow-hidden rounded-md border">
              <Image
                src={(i.images?.[0]?.src || i.image || "/placeholder.svg") as string}
                alt={i.title}
                width={64}
                height={48}
                className="h-full w-full object-cover"
              />
              <button
                className="absolute right-1 top-1 rounded bg-background/80 p-0.5"
                aria-label="Remove from compare"
                onClick={() => remove(i.id)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="bg-black">
            <Link href={`/compare?ids=${encodeURIComponent(ids)}`}>Compare {items.length}</Link>
          </Button>
          <Button variant="outline" className="bg-transparent" onClick={() => clear()}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
