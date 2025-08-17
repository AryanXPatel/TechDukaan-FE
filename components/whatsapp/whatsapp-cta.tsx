import { Button } from "@/components/ui/button"
import { buildWaLink, WHATSAPP_NUMBER } from "@/lib/whatsapp"
import { Phone, MessageCircle } from "lucide-react"

export function WhatsAppCTA({
  title,
  id,
  unitId,
  className,
}: {
  title: string
  id: string
  unitId?: string
  className?: string
}) {
  const message = `Hi! I'm interested in "${title}" (ID: ${id}${unitId ? `, Unit: ${unitId}` : ""}). Is it available? ${typeof window !== "undefined" ? window.location.href : ""}`
  const href = buildWaLink(message)
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <Button asChild className="bg-[#25D366] text-white hover:opacity-95">
          <a href={href} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Check Availability (WhatsApp)
          </a>
        </Button>
        <Button asChild variant="outline" className="bg-transparent">
          <a href={`tel:${WHATSAPP_NUMBER}`}>
            <Phone className="mr-2 h-4 w-4" />
            Call support
          </a>
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        No WhatsApp? Call us at {WHATSAPP_NUMBER}. For bulk orders, mention quantity in your message.
      </p>
    </div>
  )
}
