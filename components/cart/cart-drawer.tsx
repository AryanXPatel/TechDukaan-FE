"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "./cart-context";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export function CartDrawer() {
  const { items, total, setQty, remove } = useCart();
  const [open, setOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => headingRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  // Close cart drawer when navigating to different pages
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full hover:bg-muted"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex w-[380px] flex-col p-0"
        aria-labelledby="cart-title"
      >
        <SheetHeader className="p-6">
          <SheetTitle id="cart-title" ref={headingRef} tabIndex={-1}>
            Your cart
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4">
                  <div className="h-20 w-24 overflow-hidden rounded-md border bg-neutral-50">
                    <Image
                      src={i.image || "/placeholder.svg"}
                      alt={i.title}
                      width={160}
                      height={120}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{i.title}</p>
                    <p className="text-xs text-muted-foreground">{i.brand}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQty(i.id, i.qty - 1)}
                      >
                        -
                      </Button>
                      <span className="w-7 text-center text-sm">{i.qty}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQty(i.id, i.qty + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ₹{(i.price * i.qty).toLocaleString()}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mt-2"
                      onClick={() => remove(i.id)}
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Separator />
        <SheetFooter className="p-6">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/cart">View cart</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
