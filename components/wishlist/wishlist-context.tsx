"use client";

import type React from "react";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { useAuth } from "@/components/auth/use-auth";
import { userDataService } from "@/lib/supabase/user-data";

export type WishItem = Pick<
  Product,
  "id" | "title" | "brand" | "image" | "numericPrice"
>;

type WishCtx = {
  items: WishItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  loading: boolean;
};

const WishlistContext = createContext<WishCtx | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishItem[]>([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist when user changes
  useEffect(() => {
    if (user?.id) {
      loadWishlist();
    } else {
      // Clear wishlist when user logs out
      setItems([]);
      setProductIds([]);
    }
  }, [user?.id]);

  async function loadWishlist() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const ids = await userDataService.getWishlist(user.id);
      setProductIds(ids);

      // For existing items, only keep those that are still in the wishlist
      setItems((prev) => prev.filter((item) => ids.includes(item.id)));
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  }

  const add: WishCtx["add"] = async (p) => {
    if (!user?.id) return;

    try {
      const success = await userDataService.addToWishlist(user.id, p.id);
      if (success) {
        setProductIds((prev) => (prev.includes(p.id) ? prev : [...prev, p.id]));
        setItems((prev) =>
          prev.find((i) => i.id === p.id)
            ? prev
            : [
                ...prev,
                {
                  id: p.id,
                  title: p.title,
                  brand: p.brand,
                  image: p.image,
                  numericPrice: p.numericPrice,
                },
              ]
        );
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const remove: WishCtx["remove"] = async (id) => {
    if (!user?.id) return;

    try {
      const success = await userDataService.removeFromWishlist(user.id, id);
      if (success) {
        setProductIds((prev) => prev.filter((pid) => pid !== id));
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const has: WishCtx["has"] = (id) => productIds.includes(id);

  const clear = async () => {
    if (!user?.id) return;

    try {
      // Clear individual items since we don't have a bulk clear in user-data service
      for (const id of productIds) {
        await userDataService.removeFromWishlist(user.id, id);
      }
      setItems([]);
      setProductIds([]);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  const value = useMemo(
    () => ({ items, add, remove, has, clear, loading }),
    [items, productIds, loading]
  );
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
