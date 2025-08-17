export type BulkTier = {
  minQty: number
  maxQty?: number
  percent: number
}

export const BULK_TIERS: BulkTier[] = [
  { minQty: 3, maxQty: 4, percent: 5 },
  { minQty: 5, maxQty: 9, percent: 7.5 },
  { minQty: 10, percent: 10 },
]

export function getBulkDiscountPercent(qty: number) {
  if (qty < 3) return 0
  for (const t of BULK_TIERS) {
    const within = typeof t.maxQty === "number" ? qty >= t.minQty && qty <= t.maxQty : qty >= t.minQty
    if (within) return t.percent
  }
  return 0
}

export function calcBulkDiscount(subtotal: number, qty: number) {
  const pct = getBulkDiscountPercent(qty)
  const amount = Math.round((subtotal * pct) / 100)
  return { pct, amount }
}

export function nextTierInfo(qty: number) {
  if (qty < 3) return { nextAt: 3, percent: 5 }
  if (qty < 5) return { nextAt: 5, percent: 7.5 }
  if (qty < 10) return { nextAt: 10, percent: 10 }
  return null
}
