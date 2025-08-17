"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    Razorpay?: any
  }
}

export function RazorpayEmiButton({ amount, description }: { amount: number; description: string }) {
  const [ready, setReady] = useState(false)
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.Razorpay) {
      setReady(true)
      return
    }
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.onload = () => setReady(true)
    s.onerror = () => setReady(false)
    document.body.appendChild(s)
  }, [])

  return (
    <Button
      className="bg-black"
      disabled={!ready || !key}
      title={!key ? "Add NEXT_PUBLIC_RAZORPAY_KEY to enable" : undefined}
      onClick={() => {
        if (!key || !window.Razorpay) {
          alert("Razorpay not configured. Set NEXT_PUBLIC_RAZORPAY_KEY.")
          return
        }
        const rzp = new window.Razorpay({
          key,
          amount: amount * 100,
          currency: "INR",
          name: "TechDukaan",
          description: `${description} (EMI)`,
          notes: { type: "emi" },
          method: { emi: true },
          handler: (resp: any) => {
            alert(`Payment success (demo): ${resp.razorpay_payment_id}`)
          },
          modal: { ondismiss: () => {} },
          theme: { color: "#111111" },
        })
        rzp.open()
      }}
    >
      Pay via Razorpay EMI
    </Button>
  )
}
