"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Filter,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  X,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import { CompareToggle } from "@/components/compare/compare-toggle";

type Filters = {
  brand: Record<string, boolean>;
  category: Record<string, boolean>;
  minPrice?: number;
  maxPrice?: number;
  ram?: string[];
  storage?: string[];
};

const allRams = ["8GB", "16GB", "32GB"];
const allStorage = ["256GB", "512GB", "1TB"];
const allCategories = [
  "business",
  "gaming",
  "student",
  "ultrabooks",
  "accessories",
];

export default function ShopClient({
  products,
  initialParams,
}: {
  products: Product[];
  initialParams?: Record<string, string | string[] | undefined>;
}) {
  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const spToArray = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v : v ? v.split(",") : [];
  const initialBrands = spToArray(initialParams?.brands);
  const initialCategories = spToArray(initialParams?.category);
  const [filters, setFilters] = useState<Filters>({
    brand: Object.fromEntries(initialBrands.map((b) => [b, true])),
    category: Object.fromEntries(initialCategories.map((c) => [c, true])),
    minPrice: initialParams?.min ? Number(initialParams.min) : undefined,
    maxPrice: initialParams?.max ? Number(initialParams.max) : undefined,
    ram: spToArray(initialParams?.ram),
    storage: spToArray(initialParams?.storage),
  });
  const [query, setQuery] = useState<string>(
    (initialParams?.q as string) || ""
  );
  const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc">(
    (initialParams?.sort as string as any) || "relevance"
  );
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const syncTimeout = useRef<number | null>(null);

  // Watch for URL parameter changes and update filters accordingly
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams?.toString() ?? "");
    const urlCategories = spToArray(currentParams.get("category"));
    const urlBrands = spToArray(currentParams.get("brands"));
    const urlRam = spToArray(currentParams.get("ram"));
    const urlStorage = spToArray(currentParams.get("storage"));
    const urlQuery = currentParams.get("q") || "";
    const urlSort = currentParams.get("sort") || "relevance";
    const urlMin = currentParams.get("min");
    const urlMax = currentParams.get("max");

    // Update state only if URL params differ from current state
    const newFilters = {
      brand: Object.fromEntries(urlBrands.map((b) => [b, true])),
      category: Object.fromEntries(urlCategories.map((c) => [c, true])),
      minPrice: urlMin ? Number(urlMin) : undefined,
      maxPrice: urlMax ? Number(urlMax) : undefined,
      ram: urlRam,
      storage: urlStorage,
    };

    setFilters(newFilters);
    setQuery(urlQuery);
    setSort(urlSort as any);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const brands = Object.entries(filters.brand)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const categories = Object.entries(filters.category)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const setOrDel = (key: string, val?: string | string[]) => {
      const str = Array.isArray(val) ? val.join(",") : val;
      if (str && str.length) params.set(key, str);
      else params.delete(key);
    };
    setOrDel("q", query.trim() || undefined);
    setOrDel("brands", brands);
    setOrDel("category", categories);
    setOrDel(
      "ram",
      filters.ram && filters.ram.length ? filters.ram : undefined
    );
    setOrDel(
      "storage",
      filters.storage && filters.storage.length ? filters.storage : undefined
    );
    setOrDel("min", filters.minPrice ? String(filters.minPrice) : undefined);
    setOrDel("max", filters.maxPrice ? String(filters.maxPrice) : undefined);
    setOrDel("sort", sort !== "relevance" ? sort : undefined);

    if (syncTimeout.current) window.clearTimeout(syncTimeout.current);
    syncTimeout.current = window.setTimeout(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, query, sort]);

  const { add: addToCart } = useCart();
  const {
    add: addToWishlist,
    has: hasWish,
    remove: removeWish,
  } = useWishlist();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
    );
    const activeBrands = Object.entries(filters.brand)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (activeBrands.length)
      list = list.filter((p) => activeBrands.includes(p.brand));

    const activeCategories = Object.entries(filters.category)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (activeCategories.length) {
      list = list.filter((p) =>
        activeCategories.some(
          (cat) =>
            p.title.toLowerCase().includes(cat) ||
            (cat === "business" &&
              (p.title.toLowerCase().includes("business") ||
                p.title.toLowerCase().includes("latitude") ||
                p.title.toLowerCase().includes("elitebook"))) ||
            (cat === "gaming" &&
              (p.title.toLowerCase().includes("gaming") ||
                p.title.toLowerCase().includes("rog") ||
                p.title.toLowerCase().includes("predator"))) ||
            (cat === "student" &&
              (p.title.toLowerCase().includes("student") ||
                p.title.toLowerCase().includes("inspiron") ||
                p.title.toLowerCase().includes("ideapad"))) ||
            (cat === "ultrabooks" &&
              (p.title.toLowerCase().includes("ultrabook") ||
                p.title.toLowerCase().includes("xps") ||
                p.title.toLowerCase().includes("zenbook")))
        )
      );
    }

    if (filters.minPrice)
      list = list.filter((p) => p.numericPrice >= (filters.minPrice as number));
    if (filters.maxPrice)
      list = list.filter((p) => p.numericPrice <= (filters.maxPrice as number));
    if (filters.ram?.length)
      list = list.filter((p) => filters.ram?.includes(p.ram));
    if (filters.storage?.length)
      list = list.filter((p) => filters.storage?.includes(p.storage));
    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.numericPrice - b.numericPrice);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.numericPrice - a.numericPrice);
    return list;
  }, [filters, query, sort, products]);

  const chips = getActiveChips(filters, query);

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold">Shop laptops</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} results
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <SearchBox value={query} onChange={setQuery} />
            </div>
            <Select defaultValue={sort} onValueChange={(v: any) => setSort(v)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4">
                  <FiltersPanel
                    filters={filters}
                    setFilters={setFilters}
                    allBrands={allBrands}
                    onClear={() => setFilters({ brand: {}, category: {} })}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <Badge
                key={chip.key + chip.value}
                variant="secondary"
                className="flex items-center gap-1"
                role="button"
                aria-label={`Remove ${chip.label}`}
                onClick={() => {
                  const next = chip.remove(filters, query);
                  setQuery(next.query ?? "");
                  setFilters(next.filters);
                }}
              >
                {chip.label} <X className="h-3 w-3 opacity-70" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({ brand: {}, category: {} });
                setQuery("");
                setSort("relevance");
              }}
            >
              Clear all
            </Button>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <aside className="hidden md:block">
            <div className="sticky top-20 space-y-6">
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                allBrands={allBrands}
                onClear={() => setFilters({ brand: {}, category: {} })}
              />
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-4 md:hidden">
              <SearchBox value={query} onChange={setQuery} />
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                onClear={() => {
                  setFilters({ brand: {}, category: {} });
                  setQuery("");
                  setSort("relevance");
                }}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => {
                  const stock = p.stock ?? 0;
                  const status =
                    stock <= 0
                      ? "out"
                      : stock <= 2
                      ? "very-low"
                      : stock <= 5
                      ? "low"
                      : "in";
                  const color =
                    status === "out"
                      ? "text-red-500"
                      : status === "very-low" || status === "low"
                      ? "text-amber-600"
                      : "text-emerald-600";
                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.id}`}
                      className="group"
                    >
                      <Card
                        id={p.id}
                        className="overflow-hidden transition-shadow hover:shadow-lg"
                      >
                        <CardContent className="p-4">
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
                              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                            />
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {p.brand}
                              </p>
                              <span
                                className={`inline-flex items-center gap-1 text-xs ${color}`}
                              >
                                <Circle
                                  className={`h-2.5 w-2.5 ${color}`}
                                  fill="currentColor"
                                />
                                {status === "out"
                                  ? "Out"
                                  : status === "very-low"
                                  ? "2 left"
                                  : status === "low"
                                  ? "Low"
                                  : "In"}
                              </span>
                            </div>
                            <h3 className="line-clamp-2 font-medium">
                              {p.title}
                            </h3>
                            <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                              {p.specs}
                            </div>
                            <div className="mt-3 font-semibold">{p.price}</div>
                            <div className="mt-3 flex items-center justify-between">
                              {/* Primary action - Add to cart */}
                              <Button
                                size="sm"
                                className="flex-1 mr-2"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart(p);
                                  toast({
                                    title: "Added to cart",
                                    description: p.title,
                                  });
                                }}
                              >
                                <ShoppingCart className="mr-1 h-4 w-4" /> Add
                              </Button>

                              {/* Secondary actions - Wishlist and Compare */}
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="p-2"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (hasWish(p.id)) {
                                      removeWish(p.id);
                                      toast({
                                        title: "Removed from wishlist",
                                        description: p.title,
                                      });
                                    } else {
                                      addToWishlist(p);
                                      toast({
                                        title: "Saved to wishlist",
                                        description: p.title,
                                      });
                                    }
                                  }}
                                >
                                  <Heart
                                    className={`h-4 w-4 ${
                                      hasWish(p.id)
                                        ? "fill-current text-red-500"
                                        : ""
                                    }`}
                                  />
                                </Button>
                                <CompareToggle product={p} />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function getActiveChips(filters: Filters, q: string) {
  type Chip = {
    key: string;
    value: string;
    label: string;
    remove: (f: Filters, q: string) => { filters: Filters; query?: string };
  };
  const chips: Chip[] = [];
  if (q.trim().length) {
    chips.push({
      key: "q",
      value: q,
      label: `Search: ${q}`,
      remove: (f) => ({ filters: f, query: "" }),
    });
  }
  Object.entries(filters.brand)
    .filter(([, v]) => v)
    .forEach(([b]) =>
      chips.push({
        key: "brand",
        value: b,
        label: b,
        remove: (f) => {
          const next = { ...f, brand: { ...f.brand } };
          delete next.brand[b];
          return { filters: next };
        },
      })
    );
  Object.entries(filters.category)
    .filter(([, v]) => v)
    .forEach(([c]) =>
      chips.push({
        key: "category",
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1),
        remove: (f) => {
          const next = { ...f, category: { ...f.category } };
          delete next.category[c];
          return { filters: next };
        },
      })
    );
  for (const r of filters.ram ?? []) {
    chips.push({
      key: "ram",
      value: r,
      label: `RAM: ${r}`,
      remove: (f) => ({
        filters: { ...f, ram: (f.ram ?? []).filter((x) => x !== r) },
      }),
    });
  }
  for (const s of filters.storage ?? []) {
    chips.push({
      key: "storage",
      value: s,
      label: `Storage: ${s}`,
      remove: (f) => ({
        filters: { ...f, storage: (f.storage ?? []).filter((x) => x !== s) },
      }),
    });
  }
  if (filters.minPrice) {
    chips.push({
      key: "min",
      value: String(filters.minPrice),
      label: `Min ₹${filters.minPrice.toLocaleString()}`,
      remove: (f) => ({ filters: { ...f, minPrice: undefined } }),
    });
  }
  if (filters.maxPrice) {
    chips.push({
      key: "max",
      value: String(filters.maxPrice),
      label: `Max ₹${filters.maxPrice.toLocaleString()}`,
      remove: (f) => ({ filters: { ...f, maxPrice: undefined } }),
    });
  }
  return chips;
}

function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search laptops…"
        className="w-72"
        aria-label="Search products"
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-neutral-400 md:block" />
    </div>
  );
}

function FiltersPanel({
  filters,
  setFilters,
  allBrands,
  onClear,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  allBrands: string[];
  onClear: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-3">
        <h3 className="text-sm font-medium">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>

      <div className="space-y-4 px-3">
        <h4 className="text-sm font-medium">Category</h4>
        <div className="space-y-3">
          {allCategories.map((c) => (
            <label
              key={c}
              className="flex items-center gap-3 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
            >
              <Checkbox
                checked={!!filters.category[c]}
                onCheckedChange={(v) =>
                  setFilters({
                    ...filters,
                    category: { ...filters.category, [c]: !!v },
                  })
                }
              />
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4 px-3">
        <h4 className="text-sm font-medium">Brand</h4>
        <div className="space-y-3">
          {allBrands.map((b) => (
            <label
              key={b}
              className="flex items-center gap-3 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
            >
              <Checkbox
                checked={!!filters.brand[b]}
                onCheckedChange={(v) =>
                  setFilters({
                    ...filters,
                    brand: { ...filters.brand, [b]: !!v },
                  })
                }
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4 px-3">
        <h4 className="text-sm font-medium">Memory (RAM)</h4>
        <div className="space-y-3">
          {allRams.map((r) => (
            <label
              key={r}
              className="flex items-center gap-3 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
            >
              <Checkbox
                checked={filters.ram?.includes(r)}
                onCheckedChange={(v) => {
                  const next = new Set(filters.ram ?? []);
                  v ? next.add(r) : next.delete(r);
                  setFilters({ ...filters, ram: Array.from(next) });
                }}
              />
              {r}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-3">
        <h4 className="text-sm font-medium">Storage</h4>
        <div className="space-y-3">
          {allStorage.map((s) => (
            <label
              key={s}
              className="flex items-center gap-3 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
            >
              <Checkbox
                checked={filters.storage?.includes(s)}
                onCheckedChange={(v) => {
                  const next = new Set(filters.storage ?? []);
                  v ? next.add(s) : next.delete(s);
                  setFilters({ ...filters, storage: Array.from(next) });
                }}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4 px-3">
        <h4 className="text-sm font-medium">Price range (₹)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="min" className="text-xs">
              Min
            </Label>
            <Input
              id="min"
              inputMode="numeric"
              placeholder="20000"
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="max" className="text-xs">
              Max
            </Label>
            <Input
              id="max"
              inputMode="numeric"
              placeholder="60000"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-neutral-50/60 py-20 text-center dark:bg-neutral-900/40">
      <SlidersHorizontal className="h-6 w-6 text-neutral-400" />
      <h3 className="mt-3 text-lg font-medium">No results</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Try adjusting filters or search terms to find refurbished laptops that
        match your needs.
      </p>
      <Button onClick={onClear} className="mt-6 rounded-full bg-black px-6">
        Clear all
      </Button>
    </div>
  );
}
