import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"

const copy: Record<string, { title: string; body: React.ReactNode }> = {
  warranty: {
    title: "Warranty Policy",
    body: (
      <>
        <p className="text-muted-foreground">
          All laptops include a 6‑month warranty covering hardware defects under normal use.
        </p>
        <ul className="mt-4 list-disc pl-6 text-sm text-muted-foreground">
          <li>Battery health guaranteed at 80% or higher</li>
          <li>Free repair or replacement for covered issues</li>
          <li>Excludes accidental damage and liquid spills</li>
        </ul>
      </>
    ),
  },
  returns: {
    title: "Returns Policy",
    body: (
      <>
        <p className="text-muted-foreground">7‑day no‑questions returns from delivery date.</p>
        <ul className="mt-4 list-disc pl-6 text-sm text-muted-foreground">
          <li>Item must be in original condition with accessories</li>
          <li>Refund processed within 5–7 business days</li>
        </ul>
      </>
    ),
  },
  shipping: {
    title: "Shipping Policy",
    body: (
      <>
        <p className="text-muted-foreground">Fast, insured shipping across India.</p>
        <ul className="mt-4 list-disc pl-6 text-sm text-muted-foreground">
          <li>Orders ship in 1–2 business days</li>
          <li>Tracking shared via email</li>
        </ul>
      </>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        <p className="text-muted-foreground">
          We respect your privacy and collect only necessary data to process orders and improve the experience.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">We do not sell personal data.</p>
      </>
    ),
  },
  terms: {
    title: "Terms of Service",
    body: (
      <>
        <p className="text-muted-foreground">Please read these terms carefully before using TechDukaan.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          By using our services, you agree to our policies and acceptable use.
        </p>
      </>
    ),
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = copy[slug]
  return {
    title: entry ? `${entry.title} · TechDukaan` : "Policy · TechDukaan",
  }
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = copy[slug]
  if (!entry) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-14 lg:px-8">
        <h1 className="text-3xl font-bold">Policy</h1>
        <p className="mt-2 text-muted-foreground">
          This policy is not available. See{" "}
          <Link className="underline" href="/policies/warranty">
            Warranty
          </Link>{" "}
          or{" "}
          <Link className="underline" href="/policies/returns">
            Returns
          </Link>
          .
        </p>
      </main>
    )
  }

  return (
    <main>
      <h1 className="text-3xl font-bold">{entry.title}</h1>
      <div className="mt-3">{entry.body}</div>
    </main>
  )
}
