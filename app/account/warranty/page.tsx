"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sampleOrders } from "@/lib/sample-orders"

function monthsLeft(purchaseDate: string, months = 6) {
  const start = new Date(purchaseDate)
  const expiry = new Date(start)
  expiry.setMonth(expiry.getMonth() + months)
  const diff = expiry.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24 * 30)))
}

export default function WarrantyPage() {
  const entries = sampleOrders.map((o) => {
    return {
      id: o.id,
      items: o.items,
      date: o.date,
      months: monthsLeft(o.date),
    }
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Warranty status</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <div key={e.id} className="rounded-lg border p-4 text-sm">
            <div className="font-medium">Order #{e.id}</div>
            <div className="text-xs text-muted-foreground">{e.date}</div>
            <ul className="mt-2 list-disc pl-5 text-muted-foreground">
              {e.items.map((i, idx) => (
                <li key={idx}>{i.title}</li>
              ))}
            </ul>
            <div className="mt-2">
              Warranty:{" "}
              <span className={e.months > 0 ? "text-emerald-700" : "text-red-600"}>
                {e.months > 0 ? `${e.months} month(s) remaining` : "Expired"}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
