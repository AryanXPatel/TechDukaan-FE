"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type QuoteStatus = "requested" | "review" | "quoted" | "approved" | "rejected"

export type QuoteItem = {
  productId: string
  title: string
  brand: string
  qty: number
  price: number // unit price at request time
  customPrice?: number // optional negotiated unit price
}

export type Quote = {
  id: string
  createdAt: string
  status: QuoteStatus
  items: QuoteItem[]
  business: {
    company: string
    contact: string
    email: string
    phone: string
    gstin?: string
    address?: string
  }
  notes?: string
}

type Ctx = {
  quotes: Quote[]
  create: (q: Omit<Quote, "id" | "createdAt" | "status">) => Quote
  updateStatus: (id: string, status: QuoteStatus) => void
  updateItemPrice: (id: string, productId: string, customPrice?: number) => void
  get: (id: string) => Quote | undefined
}

const QuotesContext = createContext<Ctx | undefined>(undefined)

export function QuotesProvider({ children }: { children: React.ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    const raw = localStorage.getItem("tk_quotes")
    if (raw) {
      try {
        setQuotes(JSON.parse(raw))
      } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem("tk_quotes", JSON.stringify(quotes))
  }, [quotes])

  const create: Ctx["create"] = (q) => {
    const id = `Q-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const createdAt = new Date().toISOString()
    const newQ: Quote = { id, createdAt, status: "requested", ...q }
    setQuotes((prev) => [newQ, ...prev])
    return newQ
  }

  const updateStatus: Ctx["updateStatus"] = (id, status) =>
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))

  const updateItemPrice: Ctx["updateItemPrice"] = (id, productId, customPrice) =>
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, items: q.items.map((i) => (i.productId === productId ? { ...i, customPrice } : i)) } : q,
      ),
    )

  const get = useCallback((id: string) => quotes.find((q) => q.id === id), [quotes])

  const value = useMemo(() => ({ quotes, create, updateStatus, updateItemPrice, get }), [quotes])
  return <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>
}

export function useQuotes() {
  const ctx = useContext(QuotesContext)
  if (!ctx) throw new Error("useQuotes must be used within QuotesProvider")
  return ctx
}
