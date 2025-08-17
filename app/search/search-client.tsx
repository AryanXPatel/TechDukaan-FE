"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { searchProducts } from "@/lib/meilisearch/search";

const brands = [
  "Dell",
  "HP",
  "Lenovo",
  "ASUS",
  "Acer",
  "Apple",
  "MSI",
  "Samsung",
  "Toshiba",
  "Sony",
];
const rams = ["4GB", "8GB", "16GB", "32GB", "64GB"];
const storageTypes = ["HDD", "SSD", "Hybrid"];
const processors = [
  "Intel Core i3",
  "Intel Core i5",
  "Intel Core i7",
  "Intel Core i9",
  "AMD Ryzen 3",
  "AMD Ryzen 5",
  "AMD Ryzen 7",
];
const screens = ["11", "12", "13", "14", "15", "16", "17"];
const conditions = ["Excellent", "Good", "Fair"];

type Product = {
  id: string;
  title: string;
  price: string;
  brand: string;
  ram?: string;
  storage?: string;
  processor?: string;
  screen?: string;
  condition?: string;
  image?: string;
  images?: Array<{ src: string; alt?: string }>;
  specs?: string;
};

type SearchFilters = {
  q: string;
  brands: string[];
  ram: string[];
  storageType: string[];
  processor: string[];
  screen: string[];
  condition: string[];
  min?: number;
  max?: number;
  sort: string;
};

function spToArray(v: string | string[] | undefined) {
  return Array.isArray(v) ? v : v ? v.split(",") : [];
}

export default function SearchClient({
  initialParams,
}: {
  initialParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [resolvedParams, setResolvedParams] = useState<
    Record<string, string | string[] | undefined>
  >({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  // Resolve the promise once
  useEffect(() => {
    if (initialParams) {
      initialParams.then(setResolvedParams);
    }
  }, [initialParams]);

  const [filters, setFilters] = useState<SearchFilters>({
    q: "",
    brands: [],
    ram: [],
    storageType: [],
    processor: [],
    screen: [],
    condition: [],
    min: undefined,
    max: undefined,
    sort: "relevance",
  });

  // Update filters when resolved params change
  useEffect(() => {
    if (Object.keys(resolvedParams).length > 0) {
      setFilters({
        q: (resolvedParams.q as string) || "",
        brands: spToArray(resolvedParams.brands),
        ram: spToArray(resolvedParams.ram),
        storageType: spToArray(resolvedParams.storage),
        processor: spToArray(resolvedParams.cpu),
        screen: spToArray(resolvedParams.screen),
        condition: spToArray(resolvedParams.cond),
        min: resolvedParams.min ? Number(resolvedParams.min) : undefined,
        max: resolvedParams.max ? Number(resolvedParams.max) : undefined,
        sort: (resolvedParams.sort as string) || "relevance",
      });
    }
  }, [resolvedParams]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const syncTimeout = useRef<number | null>(null);

  // Search products when filters change
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        const result = await searchProducts(filters.q || "", {
          filter: buildMeilisearchFilter(filters),
          sort: buildMeilisearchSort(filters.sort),
          limit: 50,
        });
        setProducts(result.hits || []);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [filters]);

  // Get suggestions
  const debRef = useRef<number | null>(null);
  useEffect(() => {
    if (debRef.current) window.clearTimeout(debRef.current);
    debRef.current = window.setTimeout(async () => {
      if (filters.q) {
        try {
          // For now, provide simple suggestions based on the query
          const simpleSuggestions = [
            `${filters.q} laptop`,
            `${filters.q} refurbished`,
            `${filters.q} gaming`,
            `${filters.q} business`,
          ].filter((s) => s !== filters.q);
          setSuggestions(simpleSuggestions.slice(0, 3));
        } catch (error) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
      setActiveIdx(-1);
    }, 300);
    return () => {
      if (debRef.current) window.clearTimeout(debRef.current);
    };
  }, [filters.q]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    const setOrDel = (key: string, val?: string | string[]) => {
      const s = Array.isArray(val) ? val.join(",") : val;
      if (s && s.length) params.set(key, s);
      else params.delete(key);
    };
    setOrDel("q", filters.q || undefined);
    setOrDel("brands", filters.brands);
    setOrDel("ram", filters.ram);
    setOrDel("storage", filters.storageType);
    setOrDel("cpu", filters.processor);
    setOrDel("screen", filters.screen);
    setOrDel("cond", filters.condition);
    setOrDel(
      "min",
      typeof filters.min === "number" ? String(filters.min) : undefined
    );
    setOrDel(
      "max",
      typeof filters.max === "number" ? String(filters.max) : undefined
    );
    setOrDel(
      "sort",
      filters.sort && filters.sort !== "relevance" ? filters.sort : undefined
    );

    if (syncTimeout.current) window.clearTimeout(syncTimeout.current);
    syncTimeout.current = window.setTimeout(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 200);
  }, [filters, pathname, router, searchParams]);

  const [open, setOpen] = useState(false);
  const listboxId = "search-suggestions";

  const { add: addToCart } = useCart();
  const {
    add: addToWishlist,
    has: hasWish,
    remove: removeWish,
  } = useWishlist();
  const { toast } = useToast();

  const chips = getChips(filters);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8" id="search-main">
      <h1 className="sr-only">Advanced Search</h1>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="w-full max-w-xl">
          <div className="relative">
            <Input
              value={filters.q || ""}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              placeholder="Search laptops by brand, CPU, RAM…"
              className="pl-9"
              aria-label="Search products"
              aria-autocomplete="list"
              aria-controls={suggestions.length ? listboxId : undefined}
              aria-expanded={suggestions.length > 0}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIdx((i) => Math.min(suggestions.length - 1, i + 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIdx((i) => Math.max(-1, i - 1));
                } else if (e.key === "Enter" && activeIdx >= 0) {
                  e.preventDefault();
                  const choice = suggestions[activeIdx];
                  if (choice) setFilters((f) => ({ ...f, q: choice }));
                } else if (e.key === "Escape") {
                  setSuggestions([]);
                  setActiveIdx(-1);
                }
              }}
            />
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            {suggestions.length > 0 && (
              <div
                id={listboxId}
                role="listbox"
                className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border bg-background shadow"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={s}
                    role="option"
                    aria-selected={i === activeIdx}
                    className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none ${
                      i === activeIdx ? "bg-muted" : ""
                    }`}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => setFilters((f) => ({ ...f, q: s }))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Real-time results with filter persistence in URL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            defaultValue={filters.sort}
            onValueChange={(v) => setFilters((f) => ({ ...f, sort: v }))}
          >
            <SelectTrigger className="w-44" aria-label="Sort results">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                aria-haspopup="dialog"
                aria-controls="filters"
              >
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[320px]"
              id="filters"
              aria-label="Filter options"
            >
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <Facets filters={filters} setFilters={setFilters} />
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
              className="flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              role="button"
              tabIndex={0}
              aria-label={`Remove ${chip.label}`}
              onClick={() => {
                const next = chip.remove(filters);
                setFilters(next);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && setFilters(chip.remove(filters))
              }
            >
              {chip.label}{" "}
              <X className="h-3 w-3 opacity-70" aria-hidden="true" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFilters({
                q: "",
                brands: [],
                ram: [],
                storageType: [],
                processor: [],
                screen: [],
                condition: [],
                min: undefined,
                max: undefined,
                sort: "relevance",
              })
            }
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-20 space-y-6">
            <Facets filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        <section className="min-w-0" aria-live="polite">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-muted-foreground">
                  Searching products...
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <NoResults
              onClear={() =>
                setFilters({
                  q: "",
                  brands: [],
                  ram: [],
                  storageType: [],
                  processor: [],
                  screen: [],
                  condition: [],
                  min: undefined,
                  max: undefined,
                  sort: "relevance",
                })
              }
              suggestions={suggestions}
            />
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Found {products.length} product
                {products.length !== 1 ? "s" : ""}
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`} className="group">
                    <Card className="overflow-hidden transition-shadow hover:shadow-lg focus-within:shadow-lg">
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
                            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                          />
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {p.brand}
                            </p>
                            <span className="text-[10px] text-neutral-500">
                              {p.processor} • {p.ram} • {p.storage}
                            </span>
                          </div>
                          <h3 className="line-clamp-2 font-medium">
                            {p.title}
                          </h3>
                          <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                            {p.specs}
                          </div>
                          <div className="mt-3 font-semibold">{p.price}</div>
                          <div className="mt-3 flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-black flex-1"
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(p);
                                toast({
                                  title: "Added to cart",
                                  description: p.title,
                                });
                              }}
                              aria-label={`Add ${p.title} to cart`}
                            >
                              <ShoppingCart className="mr-1 h-3 w-3" />
                              Add to cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
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
                              aria-pressed={hasWish(p.id)}
                              aria-label={
                                hasWish(p.id)
                                  ? `Remove ${p.title} from wishlist`
                                  : `Save ${p.title} to wishlist`
                              }
                            >
                              <Heart
                                className={`h-3 w-3 ${
                                  hasWish(p.id) ? "fill-current" : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

// Helper functions
function buildMeilisearchFilter(filters: SearchFilters): string[] {
  const filterArray: string[] = [];

  if (filters.brands && filters.brands.length > 0) {
    filterArray.push(
      `brand IN [${filters.brands.map((b) => `"${b}"`).join(", ")}]`
    );
  }

  if (filters.ram && filters.ram.length > 0) {
    filterArray.push(`ram IN [${filters.ram.map((r) => `"${r}"`).join(", ")}]`);
  }

  if (filters.storageType && filters.storageType.length > 0) {
    filterArray.push(
      `storageType IN [${filters.storageType.map((s) => `"${s}"`).join(", ")}]`
    );
  }

  if (filters.processor && filters.processor.length > 0) {
    filterArray.push(
      `processor IN [${filters.processor.map((p) => `"${p}"`).join(", ")}]`
    );
  }

  if (filters.screen && filters.screen.length > 0) {
    filterArray.push(
      `screen IN [${filters.screen.map((s) => `"${s}"`).join(", ")}]`
    );
  }

  if (filters.condition && filters.condition.length > 0) {
    filterArray.push(
      `condition IN [${filters.condition.map((c) => `"${c}"`).join(", ")}]`
    );
  }

  if (filters.min !== undefined) {
    filterArray.push(`price >= ${filters.min}`);
  }

  if (filters.max !== undefined) {
    filterArray.push(`price <= ${filters.max}`);
  }

  return filterArray;
}

function buildMeilisearchSort(sort: string): string[] {
  switch (sort) {
    case "price-asc":
      return ["price:asc"];
    case "price-desc":
      return ["price:desc"];
    case "newest":
      return ["createdAt:desc"];
    case "popularity":
      return ["popularity:desc"];
    default:
      return [];
  }
}

function Facets({
  filters,
  setFilters,
}: {
  filters: SearchFilters;
  setFilters: (f: SearchFilters) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium">Brand</h4>
        <div className="mt-3 space-y-3">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!filters.brands?.includes(b)}
                onCheckedChange={(v) => {
                  const set = new Set(filters.brands || []);
                  v ? set.add(b) : set.delete(b);
                  setFilters({ ...filters, brands: Array.from(set) });
                }}
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">Processor</h4>
        <div className="mt-3 space-y-3">
          {processors.map((cpu) => (
            <label key={cpu} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!filters.processor?.includes(cpu)}
                onCheckedChange={(v) => {
                  const set = new Set(filters.processor || []);
                  v ? set.add(cpu) : set.delete(cpu);
                  setFilters({ ...filters, processor: Array.from(set) });
                }}
              />
              {cpu}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">Memory (RAM)</h4>
        <div className="mt-3 space-y-3">
          {rams.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!filters.ram?.includes(r)}
                onCheckedChange={(v) => {
                  const set = new Set(filters.ram || []);
                  v ? set.add(r) : set.delete(r);
                  setFilters({ ...filters, ram: Array.from(set) });
                }}
              />
              {r}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">Storage type</h4>
        <div className="mt-3 space-y-3">
          {storageTypes.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!filters.storageType?.includes(s)}
                onCheckedChange={(v) => {
                  const set = new Set(filters.storageType || []);
                  v ? set.add(s) : set.delete(s);
                  setFilters({ ...filters, storageType: Array.from(set) });
                }}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">Screen size</h4>
        <div className="mt-3 space-y-3">
          {screens.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!filters.screen?.includes(s)}
                onCheckedChange={(v) => {
                  const set = new Set(filters.screen || []);
                  v ? set.add(s) : set.delete(s);
                  setFilters({ ...filters, screen: Array.from(set) });
                }}
              />
              {s}"
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">Condition grade</h4>
        <div className="mt-3 space-y-3">
          {conditions.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!filters.condition?.includes(c)}
                onCheckedChange={(v) => {
                  const set = new Set(filters.condition || []);
                  v ? set.add(c) : set.delete(c);
                  setFilters({ ...filters, condition: Array.from(set) });
                }}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">Price range (₹)</h4>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="min">Min</Label>
            <Input
              id="min"
              inputMode="numeric"
              placeholder="20000"
              value={filters.min ?? ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  min: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="max">Max</Label>
            <Input
              id="max"
              inputMode="numeric"
              placeholder="60000"
              value={filters.max ?? ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  max: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NoResults({
  onClear,
  suggestions,
}: {
  onClear: () => void;
  suggestions: string[];
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-neutral-50/60 py-20 text-center dark:bg-neutral-900/40">
      <SlidersHorizontal
        className="h-6 w-6 text-neutral-400"
        aria-hidden="true"
      />
      <h3 className="mt-3 text-lg font-medium">No results found</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Try adjusting your filters or search terms to find what you're looking
        for.
      </p>
      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <p className="w-full text-xs text-muted-foreground">
            Try searching for:
          </p>
          {suggestions.slice(0, 3).map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="bg-transparent cursor-pointer hover:bg-muted"
            >
              {s}
            </Badge>
          ))}
        </div>
      )}
      <Button onClick={onClear} className="mt-6 rounded-full bg-black px-6">
        Clear all filters
      </Button>
    </div>
  );
}

function getChips(filters: SearchFilters) {
  type Chip = {
    key: string;
    value: string;
    label: string;
    remove: (f: SearchFilters) => SearchFilters;
  };
  const chips: Chip[] = [];
  if (filters.q?.trim().length) {
    chips.push({
      key: "q",
      value: filters.q,
      label: `Search: ${filters.q}`,
      remove: (f) => ({ ...f, q: "" }),
    });
  }
  for (const b of filters.brands || [])
    chips.push({
      key: "brands",
      value: b,
      label: b,
      remove: (f) => ({
        ...f,
        brands: (f.brands || []).filter((x) => x !== b),
      }),
    });
  for (const cpu of filters.processor || [])
    chips.push({
      key: "cpu",
      value: cpu,
      label: `CPU: ${cpu}`,
      remove: (f) => ({
        ...f,
        processor: (f.processor || []).filter((x) => x !== cpu),
      }),
    });
  for (const r of filters.ram || [])
    chips.push({
      key: "ram",
      value: r,
      label: `RAM: ${r}`,
      remove: (f) => ({ ...f, ram: (f.ram || []).filter((x) => x !== r) }),
    });
  for (const s of filters.storageType || [])
    chips.push({
      key: "storage",
      value: s,
      label: `Storage: ${s}`,
      remove: (f) => ({
        ...f,
        storageType: (f.storageType || []).filter((x) => x !== s),
      }),
    });
  for (const sc of filters.screen || [])
    chips.push({
      key: "screen",
      value: sc,
      label: `Screen: ${sc}"`,
      remove: (f) => ({
        ...f,
        screen: (f.screen || []).filter((x) => x !== sc),
      }),
    });
  for (const c of filters.condition || [])
    chips.push({
      key: "cond",
      value: c,
      label: `Condition: ${c}`,
      remove: (f) => ({
        ...f,
        condition: (f.condition || []).filter((x) => x !== c),
      }),
    });
  if (typeof filters.min === "number")
    chips.push({
      key: "min",
      value: String(filters.min),
      label: `Min ₹${filters.min}`,
      remove: (f) => ({ ...f, min: undefined }),
    });
  if (typeof filters.max === "number")
    chips.push({
      key: "max",
      value: String(filters.max),
      label: `Max ₹${filters.max}`,
      remove: (f) => ({ ...f, max: undefined }),
    });
  return chips;
}
