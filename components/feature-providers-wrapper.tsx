"use client"

import type React from "react"
import { FeatureProviders } from "@/app/providers"
import { CompareProvider } from "@/components/compare/compare-context"

export function FeatureProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <FeatureProviders>
      <CompareProvider>{children}</CompareProvider>
    </FeatureProviders>
  )
}
