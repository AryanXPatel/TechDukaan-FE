"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sampleOrders } from "@/lib/sample-orders"

export default function OrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Order history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sampleOrders.map((o) => (
          <div key={o.id} id={o.id} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-muted-foreground">{o.date}</div>
            </div>
            <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
              {o.items.map((i, idx) => (
                <li key={idx}>
                  {i.title} × {i.qty}
                </li>
              ))}
            </ul>
            <div className="mt-3 text-sm font-medium">Total: ₹{o.total.toLocaleString()}</div>
            <div className="mt-2 text-xs text-muted-foreground">Status: {o.status}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
