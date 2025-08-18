"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Truck,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TrustSection } from "@/components/trust/trust-section";
import { Testimonials } from "@/components/trust/testimonials";
import { subscribeNewsletter } from "@/lib/actions";
import { getFeaturedProducts } from "@/lib/meilisearch/search";

interface Product {
  id: string;
  title: string;
  brand: string;
  price: string;
  image: string;
  images?: Array<{ src: string; alt: string }>;
}

export default function Page() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        setLoading(true);
        const result = await getFeaturedProducts(3);
        setFeatured(result.hits);
        setError(null);
      } catch (err) {
        console.error("Error loading featured products:", err);
        setError("Failed to load featured products");
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  return (
    <div className="min-h-dvh bg-white text-neutral-900 dark:bg-background dark:text-foreground">
      <main>
        <section
          className="relative overflow-hidden border-b"
          aria-labelledby="hero-heading"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.06),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.04),transparent_45%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.04),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.03),transparent_45%)]"
          />
          <div className="mx-auto max-w-7xl px-6 py-20 lg:grid lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-28">
            <div className="col-span-7">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-neutral-600 dark:text-neutral-300">
                <span className="inline-block h-2 w-2 rounded-full bg-black dark:bg-white" />
                Refurbished you can trust
              </p>
              <h1
                className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl"
                id="hero-heading"
              >
                Find Your Perfect{" "}
                <span className="bg-[linear-gradient(180deg,#111_0%,#000_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(180deg,#fff_0%,#ddd_100%)]">
                  Business Laptop
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-neutral-600 dark:text-neutral-300">
                Expert-tested laptops with 6‑month warranty and enterprise‑grade
                performance.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-5"
                >
                  <Link href="/shop">Shop Business Laptops</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full bg-transparent border-neutral-300 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
                >
                  <Link href="/shop">Browse All Categories</Link>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-6 text-sm text-neutral-700 dark:text-neutral-300 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  Quality checked
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                  6‑month warranty
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" aria-hidden="true" />
                  Fast shipping
                </div>
              </div>
            </div>

            <div className="col-span-5 mt-12 lg:mt-0">
              <div className="relative">
                {loading ? (
                  <Card className="rounded-2xl shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center h-36">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    </CardContent>
                  </Card>
                ) : error ? (
                  <Card className="rounded-2xl shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center h-36 text-neutral-500">
                        <p>Unable to load featured product</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : featured.length > 0 ? (
                  <Card
                    className="rounded-2xl shadow-lg"
                    aria-label="Featured product"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Image
                          src={
                            featured[0].images?.[0]?.src ||
                            featured[0].image ||
                            "/placeholder-cqsgd.png"
                          }
                          alt="Featured refurbished laptop"
                          width={480}
                          height={320}
                          className="h-36 w-48 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {featured[0].brand}
                          </p>
                          <h3 className="font-semibold">{featured[0].title}</h3>
                          <div
                            className="mt-2 flex items-center gap-1 text-neutral-700 dark:text-neutral-300"
                            aria-label="Rating 4 out of 5"
                          >
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4" />
                            <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                              4.0
                            </span>
                          </div>
                          <div className="mt-3 font-semibold">
                            From {featured[0].price}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="rounded-2xl shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center h-36 text-neutral-500">
                        <p>No featured products available</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <div
                  className="pointer-events-none absolute -inset-x-10 -bottom-16 -top-16 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_60%_40%,black,transparent)] dark:[mask-image:radial-gradient(60%_60%_at_60%_40%,white,transparent)]"
                  aria-hidden="true"
                >
                  <div className="h-full w-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,0,0,0.08),transparent_60%)] dark:bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-6 py-14 lg:px-8"
          aria-labelledby="featured-heading"
        >
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold" id="featured-heading">
                Featured picks
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Curated, business‑ready laptops
              </p>
            </div>
            <Button asChild variant="ghost" className="group">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2"
                aria-label="View all featured picks"
              >
                View all{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-5">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-neutral-200 dark:bg-neutral-700">
                      <div className="h-full w-full bg-neutral-300 dark:bg-neutral-600" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                      <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                      <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-8 text-neutral-500">
                <p>Unable to load featured products</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : featured.length > 0 ? (
              featured.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group"
                  aria-label={`View product ${p.title}`}
                >
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardContent className="p-5">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-neutral-50 dark:bg-neutral-900">
                        <Image
                          src={
                            (p.images?.[0]?.src ||
                              p.image ||
                              "/placeholder.svg") as string
                          }
                          alt={p.title}
                          width={800}
                          height={600}
                          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {p.brand}
                        </p>
                        <h3 className="line-clamp-2 font-medium">{p.title}</h3>
                        <div className="mt-2 font-semibold">{p.price}</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-neutral-500">
                <p>No featured products available</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/shop">Browse All Products</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <TrustSection />
        <Testimonials />

        <section
          className="border-y bg-neutral-50/60 dark:bg-neutral-900/40"
          aria-labelledby="newsletter-heading"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:px-8">
            <div>
              <h3 className="text-xl font-semibold" id="newsletter-heading">
                Stay in the loop
              </h3>
              <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                Subscribe for exclusive deals and new arrivals.
              </p>
            </div>
            <form
              action={subscribeNewsletter}
              className="flex w-full max-w-md gap-3"
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="bg-white dark:bg-background"
                aria-describedby="newsletter-help"
              />
              <Button
                type="submit"
                className="rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-6"
              >
                Subscribe
              </Button>
            </form>
            <p id="newsletter-help" className="sr-only">
              Enter your email address to subscribe to our newsletter.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
