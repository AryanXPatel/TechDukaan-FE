"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { useCart } from "@/components/cart/cart-context";
import { useAuth } from "@/components/auth/use-auth";
import {
  getAlertPrefs,
  setAlertPrefs,
  shareWishlist,
} from "@/components/wishlist/alerts-store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { buildWaLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { MessageCircle, Share2, ArrowLeft, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { items, remove, clear, loading } = useWishlist();
  const { add } = useCart();
  const { user } = useAuth();
  const hasItems = items.length > 0;
  const [prefs, setPrefs] = useState<
    Record<
      string,
      { priceDrop?: boolean; backInStock?: boolean; via?: "email" | "whatsapp" }
    >
  >({});

  useEffect(() => {
    const map: Record<string, any> = {};
    items.forEach((p) => {
      map[p.id] = getAlertPrefs(p.id);
    });
    setPrefs(map);
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading your wishlist...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">My Wishlist</h1>
          </div>

          {!user && (
            <Button variant="outline" asChild>
              <Link href="/sign-in">
                <User className="mr-2 h-4 w-4" />
                Sign in to sync
              </Link>
            </Button>
          )}
        </div>

        {!user && (
          <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm text-orange-800">
              <strong>Note:</strong> You're browsing as a guest. Your wishlist
              is saved locally in your browser.
              <Link href="/sign-in" className="underline font-medium ml-1">
                Sign in
              </Link>{" "}
              to sync your wishlist across devices.
            </p>
          </div>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              {user ? `${user.name || user.email}'s Wishlist` : "Your Wishlist"}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({items.length} item{items.length !== 1 ? "s" : ""})
              </span>
            </CardTitle>
            {hasItems && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => shareWishlist(items.map((i) => i.id))}
                >
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
                    add({
                      ...i,
                      price: `₹${i.numericPrice}`,
                      ram: "16GB",
                      storage: "512GB",
                      specs: "",
                    } as any)
                  )
                }
              >
                Move all to cart ({items.length} items)
              </Button>
            </div>
          )}
          <CardContent>
            {!hasItems ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  You haven't saved any items yet.
                </p>
                <Button asChild>
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <div key={p.id} className="group">
                    <Link href={`/product/${p.id}`}>
                      <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-neutral-50 hover:shadow-md transition-shadow">
                        <Image
                          src={p.image || "/placeholder.svg"}
                          alt={p.title}
                          width={800}
                          height={600}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </Link>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">{p.brand}</p>
                      <Link href={`/product/${p.id}`}>
                        <p className="line-clamp-2 text-sm font-medium hover:underline">
                          {p.title}
                        </p>
                      </Link>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          ₹{p.numericPrice.toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => remove(p.id)}
                          >
                            Remove
                          </Button>
                          <Button
                            size="sm"
                            className="bg-black"
                            onClick={() =>
                              add({
                                ...p,
                                price: `₹${p.numericPrice}`,
                                ram: "16GB",
                                storage: "512GB",
                                specs: "",
                              } as any)
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
                                const next = {
                                  ...(prefs[p.id] || {}),
                                  priceDrop: v,
                                };
                                setPrefs((s) => ({ ...s, [p.id]: next }));
                                setAlertPrefs(p.id, next);
                              }}
                            />
                            <Label className="text-xs">Price drop</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={!!prefs[p.id]?.backInStock}
                              onCheckedChange={(v) => {
                                const next = {
                                  ...(prefs[p.id] || {}),
                                  backInStock: v,
                                };
                                setPrefs((s) => ({ ...s, [p.id]: next }));
                                setAlertPrefs(p.id, next);
                              }}
                            />
                            <Label className="text-xs">Back in stock</Label>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-auto"
                            asChild
                          >
                            <a
                              href={buildWaLink(
                                `Wishlist alerts opt-in for ${p.title} (${p.id}). Please notify me of price drops or stock updates.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Opt-in via WhatsApp"
                            >
                              <MessageCircle className="mr-2 h-4 w-4" />{" "}
                              WhatsApp notify
                            </a>
                          </Button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Alerts are saved to your browser. You can also message
                          us on WhatsApp at {WHATSAPP_NUMBER}.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
