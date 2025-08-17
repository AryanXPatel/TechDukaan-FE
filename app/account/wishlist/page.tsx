"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/components/wishlist/wishlist-context"
import { useCart } from "@/components/cart/cart-context"
import { getAlertPrefs, setAlertPrefs, shareWishlist } from "@/components/wishlist/alerts-store"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { buildWaLink, WHATSAPP_NUMBER } from "@/lib/whatsapp"
import { MessageCircle, Share2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist()
  const { add } = useCart()
  const hasItems = items.length > 0
  const [prefs, setPrefs] = useState<
    Record<string, { priceDrop?: boolean; backInStock?: boolean; via?: "email" | "whatsapp" }>
  >({})

  useEffect(() => {
    const map: Record<string, any> = {}
    items.forEach((p) => {
      map[p.id] = getAlertPrefs(p.id)
    })
    setPrefs(map)
  }, [items])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Wishlist</CardTitle>
        {hasItems && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => shareWishlist(items.map((i) => i.id))}>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="outline" onClick={() => clear()}>
              Clear all
            </Button>
          </div>
        )}
      </CardHeader>
      {hasItems && (
        <div className="px-6">
          <Button
            className="bg-black"
            onClick={() =>
              items.forEach((i) =>
                add({ ...i, price: `₹${i.numericPrice}`, ram: "16GB", storage: "512GB", specs: "" } as any),
              )
            }
          >
            Move all to cart
          </Button>
        </div>
      )}
      <CardContent>
        {!hasItems ? (
          <p className="text-sm text-muted-foreground">You haven’t saved any items yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-neutral-50">
                  <Image
                    src={p.image || "/placeholder.svg"}
                    alt={p.title}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">{p.brand}</p>
                  <p className="line-clamp-2 text-sm font-medium">{p.title}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">₹{p.numericPrice.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => remove(p.id)}>
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        className="bg-black"
                        onClick={() =>
                          add({ ...p, price: `₹${p.numericPrice}`, ram: "16GB", storage: "512GB", specs: "" } as any)
                        }
                      >
                        Add to cart
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 rounded-md border p-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!!prefs[p.id]?.priceDrop}
                          onCheckedChange={(v) => {
                            const next = { ...(prefs[p.id] || {}), priceDrop: v }
                            setPrefs((s) => ({ ...s, [p.id]: next }))
                            setAlertPrefs(p.id, next)
                          }}
                        />
                        <Label className="text-xs">Price drop</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!!prefs[p.id]?.backInStock}
                          onCheckedChange={(v) => {
                            const next = { ...(prefs[p.id] || {}), backInStock: v }
                            setPrefs((s) => ({ ...s, [p.id]: next }))
                            setAlertPrefs(p.id, next)
                          }}
                        />
                        <Label className="text-xs">Back in stock</Label>
                      </div>
                      <Button size="sm" variant="ghost" className="ml-auto" asChild>
                        <a
                          href={buildWaLink(
                            `Wishlist alerts opt-in for ${p.title} (${p.id}). Please notify me of price drops or stock updates.`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Opt-in via WhatsApp"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp notify
                        </a>
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Alerts are saved to your browser. You can also message us on WhatsApp at {WHATSAPP_NUMBER}.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
