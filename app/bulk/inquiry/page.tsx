"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuotes } from "@/components/bulk/quotes-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useRouter } from "next/navigation";
import { calcBulkDiscount } from "@/lib/bulk";
import { Phone, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER, buildWaLink } from "@/lib/whatsapp";

export default function BulkInquiryPage() {
  return (
    <AuthGuard>
      <BulkInquiryContent />
    </AuthGuard>
  );
}

function BulkInquiryContent() {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [biz, setBiz] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    gstin: "",
    address: "",
  });
  const [notes, setNotes] = useState("");
  const { create } = useQuotes();
  const router = useRouter();

  const chosen = useMemo(
    () =>
      products
        .filter((p) => selected[p.id] && selected[p.id] > 0)
        .map((p) => ({ p, qty: selected[p.id] })),
    [selected]
  );
  const subtotal = useMemo(
    () => chosen.reduce((s, c) => s + c.p.numericPrice * c.qty, 0),
    [chosen]
  );
  const totalQty = useMemo(
    () => chosen.reduce((s, c) => s + c.qty, 0),
    [chosen]
  );
  const { pct, amount } = calcBulkDiscount(subtotal, totalQty);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Bulk inquiry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-sm font-medium">Select items</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div key={p.id} className="rounded-lg border p-3">
                  <label className="flex items-start gap-3">
                    <Checkbox
                      checked={!!selected[p.id]}
                      onCheckedChange={(v) =>
                        setSelected((s) => ({ ...s, [p.id]: v ? 1 : 0 }))
                      }
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {p.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.brand}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Label className="text-xs" htmlFor={`qty-${p.id}`}>
                          Qty
                        </Label>
                        <Input
                          id={`qty-${p.id}`}
                          value={selected[p.id] ?? 0}
                          onChange={(e) =>
                            setSelected((s) => ({
                              ...s,
                              [p.id]: Math.max(0, Number(e.target.value || 0)),
                            }))
                          }
                          className="h-8 w-20"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Business details</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field
                label="Company"
                value={biz.company}
                onChange={(v) => setBiz((s) => ({ ...s, company: v }))}
              />
              <Field
                label="Contact person"
                value={biz.contact}
                onChange={(v) => setBiz((s) => ({ ...s, contact: v }))}
              />
              <Field
                label="Email"
                value={biz.email}
                onChange={(v) => setBiz((s) => ({ ...s, email: v }))}
                type="email"
              />
              <Field
                label="Phone"
                value={biz.phone}
                onChange={(v) => setBiz((s) => ({ ...s, phone: v }))}
              />
              <Field
                label="GSTIN (optional)"
                value={biz.gstin}
                onChange={(v) => setBiz((s) => ({ ...s, gstin: v }))}
              />
              <Field
                label="Address (optional)"
                value={biz.address}
                onChange={(v) => setBiz((s) => ({ ...s, address: v }))}
              />
            </div>
            <div className="mt-3">
              <Label className="text-sm">Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements?"
              />
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium">Summary</h3>
            <div className="mt-2 text-sm text-muted-foreground">
              {totalQty} item(s) • Subtotal ₹{subtotal.toLocaleString()} • Bulk
              discount {pct}% (−₹
              {amount.toLocaleString()})
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-black"
              disabled={
                chosen.length === 0 ||
                !biz.company ||
                !biz.contact ||
                !biz.email
              }
              onClick={() => {
                const q = create({
                  items: chosen.map(({ p, qty }) => ({
                    productId: p.id,
                    title: p.title,
                    brand: p.brand,
                    qty,
                    price: p.numericPrice,
                  })),
                  business: biz,
                  notes,
                });
                router.push(`/bulk/quote/${q.id}`);
              }}
            >
              Request quote
            </Button>
            <Button variant="outline" className="bg-transparent" asChild>
              <a
                href={buildWaLink(
                  `Bulk Inquiry:\nCompany: ${biz.company}\nContact: ${
                    biz.contact
                  }\nItems:\n${chosen
                    .map((c) => `- ${c.p.title} × ${c.qty}`)
                    .join("\n")}`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp inquiry
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href={`tel:${WHATSAPP_NUMBER}`}>
                <Phone className="mr-2 h-4 w-4" /> Business support
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
      />
    </div>
  );
}
