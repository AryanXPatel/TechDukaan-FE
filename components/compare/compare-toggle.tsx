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
      variant={added ? "default" : "outline"}
      className={`p-2 ${
        added
          ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
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
