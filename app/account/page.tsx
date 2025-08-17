"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/auth/use-auth";
import { sampleOrders } from "@/lib/sample-orders";
import { products } from "@/lib/products";
import { useCart } from "@/components/cart/cart-context";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const recent = sampleOrders.slice(0, 2);
  const recommended = products.slice(0, 3);
  const { add } = useCart();

  const completion = (() => {
    let score = 0;
    if (user?.name) score += 1;
    if (user?.email) score += 1;
    // Note: Address and preferences integration with user account will be implemented
    // when connected to a database. For now, focusing on core authentication.
    return Math.round((score / 2) * 100);
  })();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Welcome{user ? `, ${user.name}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Manage your orders, wishlist, and settings in one place.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-emerald-600"
              style={{ width: completion + "%" }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {completion}% complete. Your profile is linked to your{" "}
            {user?.provider || "email"} account.
          </p>
          <div className="mt-3 flex gap-2">
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/account/settings">Account Settings</Link>
            </Button>
            <Button asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recent.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Order #{o.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.date} • {o.items.length} items • ₹
                    {o.total.toLocaleString()}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/account/orders#${o.id}`}>View</Link>
                </Button>
              </div>
            ))}
            <Button asChild variant="ghost" className="mt-2">
              <Link href="/account/orders">See all orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>Update your name, email, and communication preferences.</div>
            <Button asChild className="bg-black">
              <Link href="/account/settings">Open settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended for you</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => (
              <div key={p.id} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-neutral-50">
                  <Image
                    src={p.image || "/placeholder.svg"}
                    alt={p.title}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">{p.brand}</p>
                  <p className="line-clamp-2 text-sm font-medium">{p.title}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">{p.price}</span>
                    <Button
                      size="sm"
                      className="bg-black"
                      onClick={() => add(p)}
                    >
                      Add to cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
