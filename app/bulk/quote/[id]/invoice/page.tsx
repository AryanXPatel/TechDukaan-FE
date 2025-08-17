"use client"

import { useParams } from "next/navigation"
import { useQuotes } from "@/components/bulk/quotes-context"
import { Button } from "@/components/ui/button"

export default function InvoicePage() {
  const params = useParams<{ id: string }>()
  const { get } = useQuotes()
  const q = get(params.id)
  if (!q) return <main className="mx-auto max-w-3xl px-6 py-10">Invoice not found.</main>

  const subtotal = q.items.reduce((s, i) => s + (i.customPrice ?? i.price) * i.qty, 0)
  const qty = q.items.reduce((s, i) => s + i.qty, 0)
  const discountPct = qty >= 10 ? 10 : qty >= 5 ? 7.5 : qty >= 3 ? 5 : 0
  const discount = Math.round((subtotal * discountPct) / 100)
  const taxable = subtotal - discount
  const gstRate = 18
  const gst = Math.round((taxable * gstRate) / 100)
  const total = taxable + gst

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 print:max-w-none">
      <div className="mb-4 flex justify-end gap-2 print:hidden">
        <Button onClick={() => window.print()} className="bg-black">
          Print / Save as PDF
        </Button>
      </div>

      <div className="rounded-lg border p-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Tax Invoice</h1>
            <div className="mt-1 text-sm text-muted-foreground">Invoice for Quote {q.id}</div>
          </div>
          <div className="text-sm">
            <div className="font-medium">TechDukaan</div>
            <div>GSTIN: 29ABCDE1234F1Z5</div>
            <div>support@techdukaan.example</div>
            <div>+91 98765 43210</div>
          </div>
        </header>

        <section className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-md border p-3 text-sm">
            <div className="font-medium">Bill to</div>
            <div className="mt-1 text-muted-foreground">
              <div>{q.business.company}</div>
              <div>{q.business.contact}</div>
              <div>{q.business.email}</div>
              <div>{q.business.phone}</div>
              {q.business.gstin && <div>GSTIN: {q.business.gstin}</div>}
              {q.business.address && <div>{q.business.address}</div>}
            </div>
          </div>
          <div className="rounded-md border p-3 text-sm">
            <div className="font-medium">Invoice details</div>
            <div className="mt-1 text-muted-foreground">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Payment terms: Due on receipt</div>
              <div>Delivery: Scheduled</div>
            </div>
          </div>
        </section>

        <table className="mt-6 w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="py-2">Item</th>
              <th>Qty</th>
              <th className="text-right">Unit Price</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {q.items.map((i) => {
              const up = i.customPrice ?? i.price
              return (
                <tr key={i.productId} className="border-b last:border-0">
                  <td className="py-2 pr-3">
                    <div className="font-medium">{i.title}</div>
                    <div className="text-xs text-muted-foreground">{i.brand}</div>
                  </td>
                  <td>{i.qty}</td>
                  <td className="text-right">₹{up.toLocaleString()}</td>
                  <td className="text-right">₹{(up * i.qty).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="mt-4 grid justify-end">
          <div className="w-full max-w-sm rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-emerald-700">
              <span>Bulk discount ({discountPct}%)</span>
              <span>−₹{discount.toLocaleString()}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Taxable value</span>
              <span>₹{(subtotal - discount).toLocaleString()}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>GST ({gstRate}%)</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <footer className="mt-6 text-xs text-muted-foreground">
          This is a computer-generated invoice. Prices include standard warranty. Subject to terms and conditions.
        </footer>
      </div>
    </main>
  )
}
