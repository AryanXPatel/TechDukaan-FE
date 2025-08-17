"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { products } from "@/lib/products"
import { useCompare } from "@/components/compare/compare-context"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-context"
import { deriveProcessor, deriveStorageType, deriveScreen } from "@/lib/search/search-utils"
import { Input } from "@/components/ui/input"

export default function ComparePage() {
  const sp = useSearchParams()
  const urlIds = (sp?.get("ids") || "").split(",").filter(Boolean)
  const { items, saveSet, saved, removeSaved } = useCompare()
  const data = useMemo(() => {
    const inUrl = urlIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)
    return (inUrl.length ? inUrl : items).slice(0, 4)
  }, [urlIds.join(","), items])
  const [name, setName] = useState("My comparison")

  const rows: [string, (p: any) => string][] = [
    ["Image", (p) => ""],
    ["Title", (p) => p.title],
    ["Price", (p) => p.price],
    ["Brand", (p) => p.brand],
    ["Processor", (p) => deriveProcessor(p)],
    ["RAM", (p) => p.ram],
    ["Storage", (p) => p.storage],
    ["Storage Type", (p) => deriveStorageType(p)],
    ['Screen Size (")', (p) => deriveScreen(p)],
    ["Condition", (p) => p.conditionGrade || "—"],
  ]

  const { add } = useCart()

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <h1 className="mb-4 text-2xl font-semibold">Compare laptops</h1>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items to compare. Add up to 4 from the shop.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <tbody>
                {rows.map(([label, getter]) => {
                  const vals = data.map((p) => getter(p))
                  const allSame = vals.every((v) => v === vals[0])
                  return (
                    <tr key={label} className="border-b last:border-0">
                      <th className="w-40 bg-neutral-50 p-3 text-left align-top dark:bg-neutral-900">{label}</th>
                      {data.map((p) => (
                        <td
                          key={p.id + label}
                          className={`p-3 align-top ${allSame ? "" : "bg-emerald-50/40 dark:bg-emerald-900/20"}`}
                        >
                          {label === "Image" ? (
                            <div className="h-28 w-full overflow-hidden rounded-md border">
                              <Image
                                src={(p.images?.[0]?.src || p.image || "/placeholder.svg") as string}
                                alt={p.title}
                                width={200}
                                height={150}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <span>{getter(p)}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
                <tr>
                  <th className="w-40 bg-neutral-50 p-3 text-left align-top dark:bg-neutral-900">Actions</th>
                  {data.map((p) => (
                    <td key={p.id + "act"} className="p-3">
                      <Button className="bg-black" onClick={() => add(p)}>
                        Add to cart
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="w-64" placeholder="Name set…" />
            <Button onClick={() => saveSet(name)} className="bg-black">
              Save comparison
            </Button>
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => {
                const ids = data.map((d) => d.id).join(",")
                const url = `${window.location.origin}/compare?ids=${encodeURIComponent(ids)}`
                navigator.clipboard.writeText(url)
                alert("Share link copied to clipboard")
              }}
            >
              Copy share link
            </Button>
          </div>

          {saved.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-medium">Saved comparisons</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {saved.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                    <a href={`/compare?ids=${encodeURIComponent(s.ids.join(","))}`} className="underline">
                      {s.name}
                    </a>
                    <button className="text-muted-foreground" onClick={() => removeSaved(s.name)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}
