import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ShieldCheck, Wrench, Recycle } from "lucide-react"

export function TrustSection() {
  const steps = [
    { icon: <Wrench className="h-5 w-5" />, title: "40+ point testing", desc: "Hardware, ports, thermals, battery" },
    { icon: <Recycle className="h-5 w-5" />, title: "Deep clean", desc: "Ultrasonic and isopropyl cleaning" },
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Quality check", desc: "Grade A/B assignment and QA sign-off" },
  ]
  const certs = [
    { label: "ISO 9001", value: "QA‑12345" },
    { label: "GSTIN", value: "29ABCDE1234F1Z5" },
    { label: "UDYAM", value: "UDYAM-KA-12-3456789" },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Our process, your peace of mind</h2>
        <Badge className="bg-emerald-100 text-emerald-700">30‑day replacement guarantee</Badge>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.title}>
            <CardContent className="flex items-start gap-3 p-5">
              <div className="rounded-md border bg-white p-2">{s.icon}</div>
              <div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={"/images/workshop-1.png"}
              alt="Technician testing laptops"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={"/images/workshop-2.png"}
              alt="Cleaning and QC"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={"/images/workshop-3.png"}
              alt="Inventory and packaging"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold">Transparent pricing. No hidden costs.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              What you see is what you pay. Prices include testing, cleaning, and a standard 6‑month warranty.
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground">
              <li>
                Easy returns: see our{" "}
                <a className="underline" href="/policies/returns">
                  Return policy
                </a>
              </li>
              <li>
                Warranty details:{" "}
                <a className="underline" href="/policies/warranty">
                  Warranty policy
                </a>
              </li>
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {certs.map((c) => (
                <div key={c.label} className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  <div className="text-sm font-medium">{c.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Quality assurance certifications available on request
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
