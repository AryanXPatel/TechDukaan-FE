export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-6 py-14 lg:px-8" id="about-main">
        <h1 className="text-3xl font-bold">About TechDukaan</h1>
        <p className="mt-3 text-muted-foreground">
          TechDukaan refurbishes enterprise-grade laptops to extend their life and reduce e‑waste. Every device is
          tested against 40+ checks and backed by a 6‑month warranty.
        </p>
        <h2 className="mt-10 text-xl font-semibold">Our promise</h2>
        <ul className="mt-3 list-disc pl-6 text-sm text-muted-foreground">
          <li>Transparent grading and fair pricing</li>
          <li>Fast, insured shipping across India</li>
          <li>Responsive customer support</li>
        </ul>
      </main>
    </div>
  )
}
