"use client"

import Link from "next/link"
import { useQuotes } from "@/components/bulk/quotes-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteStatusBadge } from "@/components/bulk/quote-status"
import { Button } from "@/components/ui/button"
import { buildWaLink, WHATSAPP_NUMBER } from "@/lib/whatsapp"
import { MessageCircle, Phone } from "lucide-react"

export default function BulkOrdersPage() {
  const { quotes } = useQuotes()
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Bulk orders and quotes</CardTitle>
        <Button asChild variant="outline" className="bg-transparent">
          <Link href="/bulk/inquiry">New bulk inquiry</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {quotes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bulk inquiries yet.</p>
        ) : (
          <div className="space-y-3">
            {quotes.map((q) => (
              <div key={q.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Quote {q.id}</div>
                    <div className="text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleString()}</div>
                  </div>
                  <QuoteStatusBadge status={q.status} />
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                  {q.items.map((i) => (
                    <li key={i.productId}>
                      {i.title} × {i.qty}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href={`/bulk/quote/${q.id}`}>View details</Link>
                  </Button>
                  <Button asChild variant="outline" className="bg-transparent">
                    <a
                      href={buildWaLink(
                        `Quote ${q.id} status: ${q.status.toUpperCase()}. Need assistance with bulk order.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp support
                    </a>
                  </Button>
                  <Button asChild variant="ghost">
                    <a href={`tel:${WHATSAPP_NUMBER}`}>
                      <Phone className="mr-2 h-4 w-4" /> Call business support
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
