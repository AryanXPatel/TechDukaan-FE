"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info, CheckCircle2 } from "lucide-react"
import { RazorpayEmiButton } from "@/components/payments/razorpay-emi-button"

type Tenure = 3 | 6 | 9 | 12

const ANNUAL_RATES: Record<Tenure, number> = {
  3: 12,
  6: 13,
  9: 14,
  12: 15,
}

function calcEMI(amount: number, months: Tenure, annualRate: number) {
  const r = annualRate / 12 / 100
  const n = months
  if (r === 0) return { monthly: amount / n, interest: 0, total: amount }
  const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const total = monthly * n
  const interest = total - amount
  return { monthly, interest, total }
}

export function EmiWidget({ price, title }: { price: number; title: string }) {
  const eligible = price >= 15000
  const [tenure, setTenure] = useState<Tenure>(6)
  const rate = ANNUAL_RATES[tenure]
  const { monthly, interest, total } = useMemo(() => calcEMI(price, tenure, rate), [price, tenure, rate])

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">EMI options</div>
          {!eligible ? (
            <span className="text-xs text-muted-foreground">Available on orders over ₹15,000</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Instant approval available
            </span>
          )}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <Label className="text-xs">Tenure</Label>
            <Select value={String(tenure)} onValueChange={(v) => setTenure(Number(v) as Tenure)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="9">9 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 rounded-lg border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div>
                  Monthly: <span className="font-semibold">₹{Math.round(monthly).toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Interest: ₹{Math.round(interest).toLocaleString()} • APR ~ {rate}%
                </div>
              </div>
              <div className="text-right">
                <div>Total: ₹{Math.round(total).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Principal: ₹{price.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {eligible ? (
          <div className="mt-3">
            <RazorpayEmiButton amount={price} description={title} />
            <p className="mt-2 text-xs text-muted-foreground">
              No‑cost EMI may be available with select banks when merchant covers interest. Terms vary by bank.
            </p>
          </div>
        ) : (
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            Add more to your order to enable EMI.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
