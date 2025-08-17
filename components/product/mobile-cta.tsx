"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import type { Product } from "@/lib/products"
import { buildWaLink } from "@/lib/whatsapp"

export function MobileProductCTA({ product }: { product: Product }) {
  const { add } = useCart()
  const message = `Hi! I'm interested in "${product.title}" (ID: ${product.id}). Is it available?`
  const href = buildWaLink(message)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t bg-background/95 p-3 shadow-md backdrop-blur md:hidden">
      <Button
        variant="outline"
        className="bg-transparent"
        onClick={() => {
          window.open(href, "_blank", "noopener,noreferrer")
        }}
        aria-label="Check availability on WhatsApp"
      >
        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
      </Button>
      <Button className="bg-black" onClick={() => add(product)} aria-label={`Add ${product.title} to cart`}>
        <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
      </Button>
    </div>
  )
}
