"use client"

import { Button } from "@/components/ui/button"
import { ContrastIcon as HighContrast } from "lucide-react"
import { useEffect, useState } from "react"

export function ContrastToggle() {
  const [high, setHigh] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const current = root.getAttribute("data-contrast") === "high"
    setHigh(current)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (high) root.setAttribute("data-contrast", "high")
    else root.removeAttribute("data-contrast")
  }, [high])

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-pressed={high}
      aria-label={high ? "Disable high-contrast mode" : "Enable high-contrast mode"}
      className="rounded-full"
      onClick={() => setHigh((v) => !v)}
    >
      <HighContrast className="h-5 w-5" />
    </Button>
  )
}
