"use client"

import { MessageCircle } from "lucide-react"
import { buildWaLink, WHATSAPP_NUMBER } from "@/lib/whatsapp"

export function FloatingWhatsApp() {
  const message = "Hello TechDukaan! I need help with my order/status. Please assist."
  const href = buildWaLink(message)
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <div className="mt-2 rounded-md bg-background/90 px-3 py-1 text-xs text-foreground shadow-sm">
        Or call:{" "}
        <a href={`tel:${WHATSAPP_NUMBER}`} className="underline">
          {WHATSAPP_NUMBER}
        </a>
      </div>
    </div>
  )
}
