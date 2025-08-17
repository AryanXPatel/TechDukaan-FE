"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart/cart-context"
import { BulkDiscountBar } from "@/components/bulk/bulk-discount-bar"
import { calcBulkDiscount } from "@/lib/bulk"

export default function CartPage() {
  const { items, total, setQty, remove, clear, isHydrated } = useCart()
  const has = items.length > 0
  const { pct, amount } = calcBulkDiscount(
    total,
    items.reduce((s, i) => s + i.qty, 0),
  )
  const grandTotal = Math.max(0, total - amount)

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your cart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading cart...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <BulkDiscountBar className="mb-4" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Your cart</CardTitle>
          {has && (
            <Button variant="outline" onClick={() => clear()}>
              Clear cart
            </Button>
          )}
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-[1fr_320px]">
          <div>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            ) : (
              <ul className="space-y-6">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center gap-4">
                    <div className="h-24 w-28 overflow-hidden rounded-md border bg-neutral-50">
                      <Image
                        src={i.image || "/placeholder.svg"}
                        alt={i.title}
                        width={200}
                        height={150}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground">{i.brand}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setQty(i.id, i.qty - 1)}>
                          -
                        </Button>
                        <span className="w-7 text-center text-sm">{i.qty}</span>
                        <Button size="sm" variant="outline" onClick={() => setQty(i.id, i.qty + 1)}>
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">₹{(i.price * i.qty).toLocaleString()}</div>
                      <Button variant="ghost" size="sm" className="mt-2" onClick={() => remove(i.id)}>
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border p-5">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">₹{total.toLocaleString()}</span>
            </div>
            {pct > 0 && (
              <div className="mt-2 flex items-center justify-between text-sm text-emerald-700">
                <span>Bulk discount ({pct}%)</span>
                <span>−₹{amount.toLocaleString()}</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between text-sm font-semibold">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="mt-4 space-y-2">
              <Button asChild className="w-full bg-black">
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/shop">Continue shopping</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
