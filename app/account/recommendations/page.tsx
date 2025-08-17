"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"
import { useCart } from "@/components/cart/cart-context"

export default function RecommendationsPage() {
  const recs = products.slice(2, 6)
  const { add } = useCart()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Personalized recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recs.map((p) => (
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
                  <span className="text-sm font-semibold">{p.price}</span>
                  <Button size="sm" className="bg-black" onClick={() => add(p)}>
                    Add to cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
