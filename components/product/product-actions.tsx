"use client"

import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { useWishlist } from "@/components/wishlist/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function ProductActions({ product, className }: { product: Product; className?: string }) {
  const { add } = useCart()
  const { add: addWish, has, remove } = useWishlist()
  const { toast } = useToast()

  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        className="bg-black"
        onClick={() => {
          add(product)
          toast({ title: "Added to cart", description: product.title })
        }}
      >
        <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
      </Button>
      <Button
        variant="outline"
        className="bg-transparent"
        onClick={() => {
          if (has(product.id)) {
            remove(product.id)
            toast({ title: "Removed from wishlist", description: product.title })
          } else {
            addWish(product)
            toast({ title: "Saved to wishlist", description: product.title })
          }
        }}
      >
        <Heart className="mr-2 h-4 w-4" /> {has(product.id) ? "Saved" : "Wishlist"}
      </Button>
    </div>
  )
}
