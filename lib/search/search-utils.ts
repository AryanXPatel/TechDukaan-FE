import { products, type Product } from "@/lib/products"

export type SearchFilters = {
  q?: string
  brands?: string[]
  ram?: string[] // "4GB" | "8GB" | "16GB"
  storageType?: ("HDD" | "SSD")[]
  processor?: ("i3" | "i5" | "i7" | "Ryzen")[]
  screen?: ("13" | "14" | "15")[] // coarse buckets
  condition?: ("Excellent" | "Good" | "Fair")[]
  min?: number
  max?: number
  sort?: "relevance" | "price-asc" | "price-desc" | "newest" | "popularity"
}

export function deriveProcessor(p: Product): "i3" | "i5" | "i7" | "Ryzen" | "Other" {
  const s = (p.specs + " " + p.title).toLowerCase()
  if (s.includes(" ryzen")) return "Ryzen"
  if (s.includes(" i7")) return "i7"
  if (s.includes(" i5")) return "i5"
  if (s.includes(" i3")) return "i3"
  return "Other"
}

export function deriveStorageType(p: Product): "HDD" | "SSD" | "Unknown" {
  const s = (p.specs + " " + p.title).toLowerCase()
  if (s.includes("ssd")) return "SSD"
  if (s.includes("hdd")) return "HDD"
  return "Unknown"
}

export function deriveScreen(p: Product): "13" | "14" | "15" | "Other" {
  const s = (p.specs + " " + p.title).toLowerCase()
  if (s.includes("13.3") || s.includes("13")) return "13"
  if (s.includes("14")) return "14"
  if (s.includes("15")) return "15"
  return "Other"
}

export type IndexedProduct = Product & {
  processorTag: ReturnType<typeof deriveProcessor>
  storageTypeTag: ReturnType<typeof deriveStorageType>
  screenTag: ReturnType<typeof deriveScreen>
}

export const indexedProducts: IndexedProduct[] = products.map((p) => ({
  ...p,
  processorTag: deriveProcessor(p),
  storageTypeTag: deriveStorageType(p),
  screenTag: deriveScreen(p),
}))

export function localSearch(filters: SearchFilters): IndexedProduct[] {
  let list = indexedProducts
  const q = filters.q?.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        p.unitId.toLowerCase().includes(q),
    )
  }
  if (filters.brands?.length) list = list.filter((p) => filters.brands?.includes(p.brand))
  if (filters.ram?.length) list = list.filter((p) => filters.ram?.includes(p.ram))
  if (filters.storageType?.length) list = list.filter((p) => filters.storageType?.includes(p.storageTypeTag as any))
  if (filters.processor?.length) list = list.filter((p) => filters.processor?.includes(p.processorTag as any))
  if (filters.screen?.length) list = list.filter((p) => filters.screen?.includes(p.screenTag as any))
  if (filters.condition?.length && list[0]?.conditionGrade)
    list = list.filter((p) => filters.condition?.includes(p.conditionGrade as any))
  if (typeof filters.min === "number") list = list.filter((p) => p.numericPrice >= (filters.min as number))
  if (typeof filters.max === "number") list = list.filter((p) => p.numericPrice <= (filters.max as number))
  switch (filters.sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.numericPrice - b.numericPrice)
      break
    case "price-desc":
      list = [...list].sort((a, b) => b.numericPrice - a.numericPrice)
      break
    case "newest":
      // simulate by unitId suffix or id order
      list = [...list].sort((a, b) => (a.unitId < b.unitId ? 1 : -1))
      break
    case "popularity":
      list = [...list].sort((a, b) => a.brand.localeCompare(b.brand))
      break
  }
  return list
}

export function suggestQueries(input: string): string[] {
  const basis = Array.from(new Set(products.flatMap((p) => [p.brand, p.ram, p.storage, deriveProcessor(p)])))
    .filter(Boolean)
    .map(String)
  const lower = input.toLowerCase()
  const matches = basis.filter((b) => b.toLowerCase().includes(lower))
  return (matches.length ? matches : basis).slice(0, 6)
}
