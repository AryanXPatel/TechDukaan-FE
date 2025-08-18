"use client";

import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";
import { useAuth } from "@/components/auth/use-auth";
import { userDataService } from "@/lib/supabase/user-data";

type CompareCtx = {
  ids: string[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  items: Product[];
  saveSet: (name: string) => void;
  saved: { name: string; ids: string[] }[];
  removeSaved: (name: string) => void;
  loading: boolean;
};

const CompareContext = createContext<CompareCtx | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [saved, setSaved] = useState<{ name: string; ids: string[] }[]>([]);
  const [loading, setLoading] = useState(false);

  // Load compare list when user changes or on initial load
  useEffect(() => {
    if (user?.id) {
      loadCompareList();
    } else {
      // Load from localStorage for guest users
      loadGuestCompareList();
    }
  }, [user?.id]);

  async function loadCompareList() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const compareIds = await userDataService.getCompareList(user.id);
      setIds(compareIds);

      // Load product details for the compare items
      const compareItems = compareIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      setItems(compareItems);
    } catch (error) {
      console.error("Error loading compare list:", error);
    } finally {
      setLoading(false);
    }
  }

  function loadGuestCompareList() {
    try {
      const guestCompareIds = JSON.parse(
        localStorage.getItem("tk_guest_compare") || "[]"
      );
      setIds(guestCompareIds);

      // Load product details for the compare items
      const compareItems = guestCompareIds
        .map((id: string) => products.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      setItems(compareItems);
    } catch (error) {
      console.error("Error loading guest compare list:", error);
    }
  }

  const add = async (product: Product) => {
    if (items.find((p) => p.id === product.id)) return;
    if (items.length >= 4) return;

    if (user?.id) {
      // Authenticated user - use backend
      try {
        const success = await userDataService.addToCompare(user.id, product.id);
        if (success) {
          const newItems = [...items, product];
          setItems(newItems);
          setIds(newItems.map((p) => p.id));
        }
      } catch (error) {
        console.error("Error adding to compare:", error);
      }
    } else {
      // Guest user - use localStorage
      const newItems = [...items, product];
      const newIds = newItems.map((p) => p.id);
      setItems(newItems);
      setIds(newIds);
      localStorage.setItem("tk_guest_compare", JSON.stringify(newIds));
    }
  };

  const remove = async (id: string) => {
    if (user?.id) {
      // Authenticated user - use backend
      try {
        const success = await userDataService.removeFromCompare(user.id, id);
        if (success) {
          const newItems = items.filter((x) => x.id !== id);
          setItems(newItems);
          setIds(newItems.map((p) => p.id));
        }
      } catch (error) {
        console.error("Error removing from compare:", error);
      }
    } else {
      // Guest user - use localStorage
      const newItems = items.filter((x) => x.id !== id);
      const newIds = newItems.map((p) => p.id);
      setItems(newItems);
      setIds(newIds);
      localStorage.setItem("tk_guest_compare", JSON.stringify(newIds));
    }
  };

  const clear = async () => {
    if (user?.id) {
      // Authenticated user - use backend
      try {
        const success = await userDataService.clearCompareList(user.id);
        if (success) {
          setItems([]);
          setIds([]);
        }
      } catch (error) {
        console.error("Error clearing compare list:", error);
      }
    } else {
      // Guest user - use localStorage
      setItems([]);
      setIds([]);
      localStorage.setItem("tk_guest_compare", JSON.stringify([]));
    }
  };

  // Note: Saved compare sets functionality maintained with localStorage for now
  // as it's a more complex feature that might need its own table
  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("tk_compare_saved") || "[]"));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("tk_compare_saved", JSON.stringify(saved));
  }, [saved]);

  const saveSet = (name: string) => {
    if (!name.trim()) return;
    setSaved((prev) => [{ name, ids }, ...prev.filter((s) => s.name !== name)]);
  };
  const removeSaved = (name: string) =>
    setSaved((prev) => prev.filter((s) => s.name !== name));

  const value = useMemo(
    () => ({
      ids,
      add,
      remove,
      clear,
      items,
      saveSet,
      saved,
      removeSaved,
      loading,
    }),
    [ids, items, saved, loading]
  );
  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
