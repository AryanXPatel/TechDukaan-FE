"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuotes } from "@/components/bulk/quotes-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { QuoteStatusBadge } from "@/components/bulk/quote-status"
import { calcBulkDiscount } from "@/lib/bulk"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function QuotePage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { get, updateStatus, updateItemPrice } = useQuotes()
  const q = get(id!)
  const router = useRouter()

  if (!q) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <p className="text-sm text-muted-foreground">Quote not found.</p>
        <Button asChild className="mt-4 bg-black">
          <Link href="/bulk/inquiry">Start a new inquiry</Link>
        </Button>
      </main>
    )
  }

  const subtotal = q.items.reduce((s, i) => s + (i.customPrice ?? i.price) * i.qty, 0)
  const qty = q.items.reduce((s, i) => s + i.qty, 0)
  const { pct, amount } = calcBulkDiscount(subtotal, qty)
  const total = Math.max(0, subtotal - amount)

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quote {q.id}</CardTitle>
          <QuoteStatusBadge status={q.status} />
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-lg border">
              <div className="grid grid-cols-4 gap-3 border-b px-4 py-2 text-xs text-muted-foreground">
                <div className="col-span-2">Item</div>
                <div className="text-right">Qty</div>
                <div className="text-right">Unit price</div>
              </div>
              {q.items.map((i) => (
                <div key={i.productId} className="grid grid-cols-4 items-center gap-3 px-4 py-3">
                  <div className="col-span-2 min-w-0">
                    <div className="truncate text-sm font-medium">{i.title}</div>
                    <div className="text-xs text-muted-foreground">{i.brand}</div>
                  </div>
                  <div className="text-right text-sm">{i.qty}</div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground line-through">₹{i.price.toLocaleString()}</div>
                    <Label className="sr-only" htmlFor={`custom-${i.productId}`}>
                      Custom price
                    </Label>
                    <Input
                      id={`custom-${i.productId}`}
                      className="h-8 w-28 text-right"
                      inputMode="numeric"
                      value={i.customPrice ?? i.price}
                      onChange={(e) => updateItemPrice(q.id, i.productId, Number(e.target.value || i.price))}
                    />
                  </div>
                </div>
              ))}
              <div className="border-t px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-emerald-700">
                  <span>Bulk discount ({pct}%)</span>
                  <span>−₹{amount.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-lg border p-4 text-sm">
                <div className="font-medium">Business details</div>
                <div className="mt-2 text-muted-foreground">
                  <div>{q.business.company}</div>
                  <div>{q.business.contact}</div>
                  <div>{q.business.email}</div>
                  <div>{q.business.phone}</div>
                  {q.business.gstin && <div>GSTIN: {q.business.gstin}</div>}
                  {q.business.address && <div>{q.business.address}</div>}
                </div>
              </div>

              <div className="rounded-lg border p-4 text-sm">
                <div className="font-medium">Custom pricing</div>
                <p className="mt-1 text-muted-foreground">Adjust unit prices above to offer business-specific rates.</p>
              </div>

              <div className="rounded-lg border p-4 text-sm">
                <div className="font-medium">Actions</div>
                <div className="mt-2 grid gap-2">
                  {q.status === "requested" && (
                    <Button onClick={() => updateStatus(q.id, "review")}>Move to review</Button>
                  )}
                  {q.status === "review" && (
                    <Button className="bg-black" onClick={() => updateStatus(q.id, "quoted")}>
                      Generate quote
                    </Button>
                  )}
                  {q.status === "quoted" && (
                    <div className="flex gap-2">
                      <Button className="bg-emerald-600" onClick={() => updateStatus(q.id, "approved")}>
                        Approve quote
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => updateStatus(q.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {q.status === "approved" && (
                    <div className="flex flex-wrap gap-2">
                      <Button asChild className="bg-black">
                        <Link href={`/bulk/quote/${q.id}/invoice`}>Generate GST invoice</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => router.push("/account/bulk-orders")}
                      >
                        Track bulk order
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </section>
        </CardContent>
      </Card>
    </main>
  )
}
