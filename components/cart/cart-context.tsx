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
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hydration effect - runs only on client after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load cart data on mount and user change
  useEffect(() => {
    const loadCartData = async () => {
      if (!isHydrated || authLoading) return;
      
      setLoading(true);
      try {
        if (user?.id) {
          // Load from Supabase for authenticated users
          await loadSupabaseCart();
        } else {
          // Load from localStorage for guests
          loadLocalStorageCart();
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Fallback to localStorage if Supabase fails
        loadLocalStorageCart();
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, [user?.id, isHydrated, authLoading]);

  // Sync localStorage cart with Supabase when user signs in
  useEffect(() => {
    const syncCartOnSignIn = async () => {
      if (user?.id && isHydrated && !authLoading) {
        const localCart = localStorage.getItem("tk_cart");
        if (localCart) {
          try {
            const localItems: CartItem[] = JSON.parse(localCart);
            if (localItems.length > 0) {
              // Merge local cart with user's Supabase cart
              for (const localItem of localItems) {
                await userDataService.addToCart(
                  user.id, 
                  localItem.id, 
                  localItem.qty,
                  localItem.title,
                  localItem.brand,
                  localItem.image,
                  localItem.price
                );
              }
              
              // Reload cart from Supabase to get the merged data
              await loadSupabaseCart();
              localStorage.removeItem("tk_cart"); // Clear local storage after sync
            }
          } catch (error) {
            console.error("Error syncing cart on sign in:", error);
          }
        }
      }
    };

    syncCartOnSignIn();
  }, [user?.id, isHydrated, authLoading]);

  const loadLocalStorageCart = () => {
    try {
      const localCart = localStorage.getItem("tk_cart");
      const cartItems = localCart ? JSON.parse(localCart) : [];
      setItems(cartItems);
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setItems([]);
    }
  };

  const loadSupabaseCart = async () => {
    if (!user?.id) return;
    
    try {
      const cartItems = await userDataService.getCart(user.id);
      // Convert UserCartItem to CartItem format using stored product details
      const convertedItems: CartItem[] = cartItems.map((item) => ({
        id: item.product_id,
        title: item.product_title,
        image: item.product_image,
        price: item.product_price,
        brand: item.product_brand,
        qty: item.quantity,
        cartItemId: item.id,
      }));
      setItems(convertedItems);
    } catch (error) {
      console.error("Error loading cart from Supabase:", error);
      // Fallback to localStorage
      loadLocalStorageCart();
    }
  };

  const add: CartContextValue["add"] = async (p, qty = 1) => {
    try {
      if (user?.id) {
        // Add to Supabase for authenticated users with product details
        const cartItem = await userDataService.addToCart(
          user.id, 
          p.id, 
          qty,
          p.title,
          p.brand,
          p.image,
          p.numericPrice
        );
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
      } else {
        // Add to localStorage for guests
        setItems((prev) => {
          const idx = prev.findIndex((i) => i.id === p.id);
          const newItems = idx >= 0 
            ? prev.map((item, index) => 
                index === idx ? { ...item, qty: item.qty + qty } : item
              )
            : [
                ...prev,
                {
                  id: p.id,
                  title: p.title,
                  image: p.image,
                  brand: p.brand,
                  price: p.numericPrice,
                  qty,
                },
              ];
          
          localStorage.setItem("tk_cart", JSON.stringify(newItems));
          return newItems;
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Fallback to localStorage for any errors
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.id === p.id);
        const newItems = idx >= 0 
          ? prev.map((item, index) => 
              index === idx ? { ...item, qty: item.qty + qty } : item
            )
          : [
              ...prev,
              {
                id: p.id,
                title: p.title,
                image: p.image,
                brand: p.brand,
                price: p.numericPrice,
                qty,
              },
            ];
        
        localStorage.setItem("tk_cart", JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const remove: CartContextValue["remove"] = async (id) => {
    try {
      if (user?.id) {
        // Remove from Supabase for authenticated users
        const item = items.find((i) => i.id === id);
        if (item?.cartItemId) {
          const success = await userDataService.removeFromCart(item.cartItemId);
          if (success) {
            setItems((prev) => prev.filter((i) => i.id !== id));
          }
        }
      } else {
        // Remove from localStorage for guests
        setItems((prev) => {
          const newItems = prev.filter((i) => i.id !== id);
          localStorage.setItem("tk_cart", JSON.stringify(newItems));
          return newItems;
        });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      // Fallback to localStorage
      setItems((prev) => {
        const newItems = prev.filter((i) => i.id !== id);
        localStorage.setItem("tk_cart", JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const setQty: CartContextValue["setQty"] = async (id, qty) => {
    const newQty = Math.max(1, qty);
    
    try {
      if (user?.id) {
        // Update in Supabase for authenticated users
        const item = items.find((i) => i.id === id);
        if (item?.cartItemId) {
          const updatedItem = await userDataService.updateCartQuantity(
            item.cartItemId,
            newQty
          );
          if (updatedItem) {
            setItems((prev) =>
              prev.map((i) =>
                i.id === id ? { ...i, qty: updatedItem.quantity } : i
              )
            );
          }
        }
      } else {
        // Update in localStorage for guests
        setItems((prev) => {
          const newItems = prev.map((i) =>
            i.id === id ? { ...i, qty: newQty } : i
          );
          localStorage.setItem("tk_cart", JSON.stringify(newItems));
          return newItems;
        });
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      // Fallback to localStorage
      setItems((prev) => {
        const newItems = prev.map((i) =>
          i.id === id ? { ...i, qty: newQty } : i
        );
        localStorage.setItem("tk_cart", JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const clear = async () => {
    try {
      if (user?.id) {
        // Clear from Supabase for authenticated users
        const success = await userDataService.clearCart(user.id);
        if (success) {
          setItems([]);
        }
      } else {
        // Clear from localStorage for guests
        localStorage.removeItem("tk_cart");
        setItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Fallback to localStorage clear
      localStorage.removeItem("tk_cart");
      setItems([]);
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
