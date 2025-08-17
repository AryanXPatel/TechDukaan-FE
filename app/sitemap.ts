import type { MetadataRoute } from "next"
import { products } from "@/lib/products"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://example.com"
  const now = new Date().toISOString()
  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/support/contact",
    "/policies/warranty",
    "/policies/returns",
    "/policies/shipping",
    "/policies/privacy",
    "/policies/terms",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }))
  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))
  return [...staticRoutes, ...productRoutes]
}
