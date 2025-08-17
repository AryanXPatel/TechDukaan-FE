"use client";

import { Button } from "@/components/ui/button";
import { useCompare } from "./compare-context";
import { BarChart3, Check } from "lucide-react";
import type { Product } from "@/lib/products";

export function CompareToggle({ product }: { product: Product }) {
  const { ids, add, remove } = useCompare();
  const added = ids.includes(product.id);
  return (
    <Button
      size="sm"
      variant={added ? "secondary" : "outline"}
      className={`p-2 ${
        added ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-transparent"
      }`}
      onClick={(e) => {
        e.preventDefault();
        added ? remove(product.id) : add(product);
      }}
      title={added ? "Remove from comparison" : "Add to comparison"}
    >
      {added ? (
        <Check className="h-4 w-4" />
      ) : (
        <BarChart3 className="h-4 w-4" />
      )}
    </Button>
  );
}
