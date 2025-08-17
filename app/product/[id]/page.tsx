import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct as getMeilisearchProduct } from "@/lib/meilisearch/search";
import { getProductById } from "@/lib/medusa/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SpecsTable } from "@/components/product/specs-table";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { PriceBlock } from "@/components/product/price-block";
import { ConditionBadge } from "@/components/product/condition-badge";
import { StockIndicator } from "@/components/product/stock-indicator";
import { IncludedList } from "@/components/product/included-list";
import { WhatsAppCTA } from "@/components/whatsapp/whatsapp-cta";
import { EmiWidget } from "@/components/emi/emi-widget";
import { BulkDiscountBar } from "@/components/bulk/bulk-discount-bar";
import { MobileProductCTA } from "@/components/product/mobile-cta";

// Fallback product data for when backends are offline
const fallbackProducts: Record<string, any> = {
  prod_01K1R8S9JEAHZDJR17J4BVX50C: {
    id: "prod_01K1R8S9JEAHZDJR17J4BVX50C",
    unitId: "HP-EB840-G5-001",
    title: "HP EliteBook 840 G5 - i5 16GB 512GB",
    brand: "HP",
    specs: "Intel i5 · 16GB RAM · 512GB SSD",
    price: "₹23,999",
    numericPrice: 23999,
    mrp: "₹31,199",
    mrpNumeric: 31199,
    discountPct: 23,
    image: "/static/1754234922525-hp-elitebook-840-g5-i5-8gb-256gb.jpg",
    images: [
      {
        src: "/static/1754234922525-hp-elitebook-840-g5-i5-8gb-256gb.jpg",
        alt: "HP EliteBook 840 G5 - Front View",
        blurDataURL: undefined,
      },
    ],
    ram: "16GB",
    storage: "512GB",
    conditionGrade: "Excellent",
    conditionNotes:
      "Minor signs of use, fully functional with 6-month warranty",
    stock: 3,
    included: [
      "Original HP Charger",
      "6‑month warranty",
      "Initial setup service",
      "Carrying case",
    ],
    description:
      "Professional business laptop perfect for work and productivity. Features Intel Core i5 processor, 16GB RAM, and fast 512GB SSD storage.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // Try to get product from Meilisearch first, then fallback to Medusa
  let p = await getMeilisearchProduct(id);
  if (!p) {
    p = await getProductById(id);
  }

  // If both backends are offline/empty, use fallback data
  if (!p && fallbackProducts[id]) {
    p = fallbackProducts[id];
  }

  if (!p) return { title: "Product · TechDukaan" };

  return {
    title: `${p.title} · TechDukaan`,
    description: `${p.brand} refurbished laptop · ${p.ram} RAM · ${p.storage} storage`,
    openGraph: {
      title: p.title,
      description: `${p.brand} refurbished laptop`,
      images: [
        {
          url: (p.images?.[0]?.src || p.image || "/placeholder.svg") as string,
          width: 1200,
          height: 900,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try to get product from Meilisearch first, then fallback to Medusa
  let p = await getMeilisearchProduct(id);
  if (!p) {
    p = await getProductById(id);
  }

  // If both backends are offline/empty, use fallback data
  if (!p && fallbackProducts[id]) {
    p = fallbackProducts[id];
    console.log(`Using fallback data for product ${id}`);
  }

  if (!p) return notFound();

  // Get related products from same brand (limit to 3)
  const related = []; // We'll implement this later when we have more products

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-sm text-muted-foreground"
        >
          <Link href="/" className="underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/shop" className="underline">
            Shop
          </Link>{" "}
          / <span className="text-foreground">{p.brand}</span>
        </nav>
        {/* Bulk discount hint (uses cart count) */}
        <div className="mb-6">
          <BulkDiscountBar />
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          {/* Gallery */}
          <div>
            {p.images && p.images.length > 0 ? (
              <ProductGallery images={p.images} />
            ) : (
              <div
                className="aspect-[4/3] overflow-hidden rounded-xl border bg-neutral-50"
                role="img"
                aria-label={p.title}
              >
                <Image
                  src={p.image || "/placeholder.svg"}
                  alt={p.title}
                  width={1200}
                  height={900}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {/* Details */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold">Specifications</h2>
                  <SpecsTable
                    rows={[
                      ["Unit ID", p.unitId],
                      ["Brand", p.brand],
                      [
                        "Processor",
                        p.specs.includes("i5")
                          ? "Intel Core i5"
                          : p.specs.includes("i7")
                          ? "Intel Core i7"
                          : p.specs.includes("i3")
                          ? "Intel Core i3"
                          : p.specs.includes("Ryzen")
                          ? "AMD Ryzen"
                          : p.specs,
                      ],
                      ["Memory (RAM)", p.ram],
                      ["Storage", p.storage],
                      ["Display", p.title.includes("14") ? '14"' : '13"-15"'],
                      [
                        "Graphics",
                        p.specs.includes("Iris")
                          ? "Intel Iris Xe"
                          : "Integrated",
                      ],
                      ["Battery", "80%+ health"],
                      ["Ports", "USB‑C, USB‑A, HDMI (varies by model)"],
                      [
                        "Condition notes",
                        p.conditionNotes || "Minor cosmetic wear",
                      ],
                    ]}
                  />
                  <IncludedList items={p.included} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold">FAQs</h2>
                  <Accordion type="single" collapsible className="mt-3">
                    <AccordionItem value="warranty">
                      <AccordionTrigger>
                        What warranty is included?
                      </AccordionTrigger>
                      <AccordionContent>
                        6‑month coverage for hardware defects.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="testing">
                      <AccordionTrigger>
                        How are devices tested?
                      </AccordionTrigger>
                      <AccordionContent>
                        40+ checks including battery, ports, and thermals.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="returns">
                      <AccordionTrigger>
                        Can I return the product?
                      </AccordionTrigger>
                      <AccordionContent>
                        7‑day no‑questions return from delivery date.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Summary + Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">{p.brand}</p>
                <ConditionBadge grade={p.conditionGrade} />
              </div>
              <h1 className="mt-1 text-2xl font-semibold">{p.title}</h1>
              <div className="mt-2 text-xs text-muted-foreground">
                Unit: {p.unitId}
              </div>
              <div className="mt-3">
                <PriceBlock
                  sale={p.price}
                  mrp={p.mrp}
                  discountPct={p.discountPct}
                />
              </div>
              {p.numericPrice >= 15000 && (
                <EmiWidget price={p.numericPrice} title={p.title} />
              )}
              <div className="mt-3">
                <StockIndicator stock={p.stock} />
              </div>
              <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground">
                <li>40+ point functional testing</li>
                <li>6‑month warranty</li>
                <li>Fast, insured shipping</li>
              </ul>
              <ProductActions product={p} className="mt-6" />
              <WhatsAppCTA
                title={p.title}
                id={p.id}
                unitId={p.unitId}
                className="mt-3"
              />
              <p className="mt-4 text-xs text-muted-foreground">
                Grade {p.conditionGrade || "A"} refurbished. Battery health 80%+
                guaranteed. 7‑day returns. No hidden fees.
              </p>
              <div className="mt-6">
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/shop">Back to shop</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related items */}
        {related.length > 0 && (
          <section className="mt-14" aria-labelledby="related-heading">
            <h2 className="mb-4 text-xl font-semibold" id="related-heading">
              Related items
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/product/${r.id}`} className="group">
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-neutral-50 dark:bg-neutral-900">
                        <Image
                          src={
                            (r.images?.[0]?.src ||
                              r.image ||
                              "/placeholder.svg") as string
                          }
                          alt={r.title}
                          width={800}
                          height={600}
                          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground">
                          {r.brand}
                        </p>
                        <p className="line-clamp-2 text-sm font-medium">
                          {r.title}
                        </p>
                        <div className="mt-2 text-sm font-semibold">
                          {r.price}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      {/* Mobile sticky CTA */}
      <MobileProductCTA product={p} />
    </div>
  );
}
