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
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Helper functions for localStorage operations
  const getLocalWishlist = (): WishItem[] => {
    try {
      const stored = localStorage.getItem("tk_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading localStorage wishlist:", error);
      return [];
    }
  };

  const saveLocalWishlist = (wishItems: WishItem[]) => {
    try {
      localStorage.setItem("tk_wishlist", JSON.stringify(wishItems));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Initialize wishlist from localStorage on first load
  useEffect(() => {
    if (!hasInitialized) {
      const localItems = getLocalWishlist();
      setItems(localItems);
      setProductIds(localItems.map((item) => item.id));
      setHasInitialized(true);
      setLoading(false);
    }
  }, [hasInitialized]);

  // Handle user authentication changes
  useEffect(() => {
    if (!hasInitialized) return;

    if (user?.id) {
      // User signed in - sync with Supabase
      syncWithSupabase();
    } else {
      // User signed out - keep only localStorage data
      const localItems = getLocalWishlist();
      setItems(localItems);
      setProductIds(localItems.map((item) => item.id));
      setLoading(false);
    }
  }, [user?.id, hasInitialized]);

  async function syncWithSupabase() {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Get current Supabase wishlist
      const supabaseIds = await userDataService.getWishlist(user.id);

      // Get current localStorage wishlist
      const localItems = getLocalWishlist();
      const localIds = localItems.map((item) => item.id);

      // Merge: items that exist in either localStorage or Supabase
      const allIds = [...new Set([...supabaseIds, ...localIds])];

      // Sync any local items not in Supabase to Supabase
      for (const localItem of localItems) {
        if (!supabaseIds.includes(localItem.id)) {
          await userDataService.addToWishlist(user.id, localItem.id);
        }
      }

      // Build final items list (prioritize localStorage data for item details)
      const finalItems: WishItem[] = [];
      for (const id of allIds) {
        const localItem = localItems.find((item) => item.id === id);
        if (localItem) {
          finalItems.push(localItem);
        } else {
          // If only in Supabase but not localStorage, we need basic item data
          // For now, add a placeholder - in real app, you'd fetch product details
          finalItems.push({
            id,
            title: `Product ${id}`,
            brand: "Unknown",
            image: "/placeholder.svg",
            numericPrice: 0,
          });
        }
      }

      setItems(finalItems);
      setProductIds(allIds);

      // Update localStorage to match final state
      saveLocalWishlist(finalItems);
    } catch (error) {
      console.error("Error syncing wishlist with Supabase:", error);
      // Fallback to localStorage on error
      const localItems = getLocalWishlist();
      setItems(localItems);
      setProductIds(localItems.map((item) => item.id));
    } finally {
      setLoading(false);
    }
  }

  const add: WishCtx["add"] = async (p) => {
    const newItem: WishItem = {
      id: p.id,
      title: p.title,
      brand: p.brand,
      image: p.image,
      numericPrice: p.numericPrice,
    };

    // Always update localStorage
    const updatedItems = items.find((i) => i.id === p.id)
      ? items
      : [...items, newItem];
    const updatedIds = updatedItems.map((item) => item.id);

    setItems(updatedItems);
    setProductIds(updatedIds);
    saveLocalWishlist(updatedItems);

    // If user is authenticated, also sync to Supabase
    if (user?.id) {
      try {
        await userDataService.addToWishlist(user.id, p.id);
      } catch (error) {
        console.error("Error adding to Supabase wishlist:", error);
        // Item is still added to localStorage, so we don't revert the UI change
      }
    }
  };

  const remove: WishCtx["remove"] = async (id) => {
    // Always update localStorage
    const updatedItems = items.filter((i) => i.id !== id);
    const updatedIds = updatedItems.map((item) => item.id);

    setItems(updatedItems);
    setProductIds(updatedIds);
    saveLocalWishlist(updatedItems);

    // If user is authenticated, also sync to Supabase
    if (user?.id) {
      try {
        await userDataService.removeFromWishlist(user.id, id);
      } catch (error) {
        console.error("Error removing from Supabase wishlist:", error);
        // Item is still removed from localStorage, so we don't revert the UI change
      }
    }
  };

  const has: WishCtx["has"] = (id) => productIds.includes(id);

  const clear = async () => {
    // Always clear localStorage
    setItems([]);
    setProductIds([]);
    saveLocalWishlist([]);

    // If user is authenticated, also clear Supabase
    if (user?.id) {
      try {
        for (const id of productIds) {
          await userDataService.removeFromWishlist(user.id, id);
        }
      } catch (error) {
        console.error("Error clearing Supabase wishlist:", error);
        // Items are still cleared from localStorage, so we don't revert the UI change
      }
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
