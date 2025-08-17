"use client";

import type React from "react";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { useAuth } from "@/components/auth/use-auth";
import { userDataService, type UserCartItem } from "@/lib/supabase/user-data";

export type CartItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  brand: string;
  qty: number;
  cartItemId?: string; // Supabase cart item ID
};

type CartContextValue = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  isHydrated: boolean;
  loading: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hydration effect - runs only on client after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load cart when user changes
  useEffect(() => {
    if (user?.id && isHydrated) {
      loadCart();
    } else if (!user?.id && isHydrated) {
      // Clear cart when user logs out
      setItems([]);
    }
  }, [user?.id, isHydrated]);

  async function loadCart() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const cartItems = await userDataService.getCart(user.id);
      // Convert UserCartItem to CartItem format
      // Note: We need product data to get title, image, brand, price
      // For now, we'll store basic info and fetch product details as needed
      const convertedItems: CartItem[] = cartItems.map((item) => ({
        id: item.product_id,
        title: `Product ${item.product_id}`, // TODO: Get actual product data
        image: "/placeholder.jpg", // TODO: Get actual product data
        price: 0, // TODO: Get actual product data
        brand: "Unknown", // TODO: Get actual product data
        qty: item.quantity,
        cartItemId: item.id,
      }));
      setItems(convertedItems);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  }

  const add: CartContextValue["add"] = async (p, qty = 1) => {
    if (!user?.id) return;

    try {
      const cartItem = await userDataService.addToCart(user.id, p.id, qty);
      if (cartItem) {
        setItems((prev) => {
          const idx = prev.findIndex((i) => i.id === p.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = {
              ...copy[idx],
              qty: cartItem.quantity,
              cartItemId: cartItem.id,
            };
            return copy;
          }
          return [
            ...prev,
            {
              id: p.id,
              title: p.title,
              image: p.image,
              brand: p.brand,
              price: p.numericPrice,
              qty: cartItem.quantity,
              cartItemId: cartItem.id,
            },
          ];
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const remove: CartContextValue["remove"] = async (id) => {
    if (!user?.id) return;

    const item = items.find((i) => i.id === id);
    if (!item?.cartItemId) return;

    try {
      const success = await userDataService.removeFromCart(item.cartItemId);
      if (success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const setQty: CartContextValue["setQty"] = async (id, qty) => {
    if (!user?.id) return;

    const item = items.find((i) => i.id === id);
    if (!item?.cartItemId) return;

    try {
      const updatedItem = await userDataService.updateCartQuantity(
        item.cartItemId,
        Math.max(1, qty)
      );
      if (updatedItem) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, qty: updatedItem.quantity } : i
          )
        );
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const clear = async () => {
    if (!user?.id) return;

    try {
      const success = await userDataService.clearCart(user.id);
      if (success) {
        setItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        remove,
        setQty,
        clear,
        total,
        count,
        isHydrated,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
