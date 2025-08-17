"use client";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Checkbox } from "@/components/ui/checkbox";
import ShopClient from "./shop-client";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/meilisearch/search";

export const dynamic = "force-dynamic";

type Filters = {
  brand: Record<string, boolean>;
  minPrice?: number;
  maxPrice?: number;
  ram?: string[];
  storage?: string[];
};

const allBrands = ["Dell", "HP", "Lenovo", "ASUS", "Acer"]; // Most common laptop brands
const allRams = ["8GB", "16GB", "32GB"];
const allStorage = ["256GB", "512GB", "1TB"];

export default function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sp, setSp] = useState<Record<string, string | string[] | undefined>>(
    {}
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const params = searchParams ? await searchParams : {};
        setSp(params);

        // Check if there's a search query
        const query = params?.q as string;

        if (query) {
          // If there's a search query, use search function
          const result = await import("@/lib/meilisearch/search").then((m) =>
            m.searchProducts(query, { limit: 50 })
          );
          setProducts(result.hits);
        } else {
          // If no search query, get all products
          const result = await getProducts({ limit: 50 });
          setProducts(result.hits);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        // Fallback to static products if API fails
        const { products: staticProducts } = await import("@/lib/products");
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <ShopClient products={products} initialParams={sp} />
    </>
  );
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
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-neutral-400 md:block" />
    </div>
  );
}

function FiltersPanel({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium">Brand</h3>
        <div className="mt-3 space-y-3">
          {allBrands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm">
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

      <div>
        <h3 className="text-sm font-medium">Memory (RAM)</h3>
        <div className="mt-3 space-y-3">
          {allRams.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
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

      <div>
        <h3 className="text-sm font-medium">Storage</h3>
        <div className="mt-3 space-y-3">
          {allStorage.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
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

      <div>
        <h3 className="text-sm font-medium">Price range (₹)</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="min">Min</Label>
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
            />
          </div>
          <div>
            <Label htmlFor="max">Max</Label>
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
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setFilters({ brand: {} })}
        >
          Reset filters
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-neutral-50/60 py-20 text-center">
      <SlidersHorizontal className="h-6 w-6 text-neutral-400" />
      <h3 className="mt-3 text-lg font-medium">No results</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-600">
        Try adjusting filters or search terms to find refurbished laptops that
        match your needs.
      </p>
      <Button onClick={onClear} className="mt-6 rounded-full bg-black px-6">
        Clear all
      </Button>
    </div>
  );
}
