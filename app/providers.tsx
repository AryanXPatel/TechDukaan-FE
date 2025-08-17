"use client"

import type React from "react"
import { QuotesProvider } from "@/components/bulk/quotes-context"

export function FeatureProviders({ children }: { children: React.ReactNode }) {
  return <QuotesProvider>{children}</QuotesProvider>
}
