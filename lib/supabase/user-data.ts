import { getSupabaseBrowser } from "./supabase-browser";

// Type definitions for user data
export type UserAddress = {
  id: string;
  user_id: string;
  label: string;
  recipient: string;
  phone: string;
  line: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
};

export type UserPreferences = {
  id: string;
  user_id: string;
  email_deals: boolean;
  whatsapp_updates: boolean;
  dark_mode: boolean;
  created_at?: string;
  updated_at?: string;
};

export type UserWishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at?: string;
};

export type UserCompareItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at?: string;
};

export type UserCartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  // Store product details for easy retrieval
  product_title: string;
  product_brand: string;
  product_image: string;
  product_price: number;
  created_at?: string;
  updated_at?: string;
};

// User Addresses
export class UserDataService {
  private supabase = getSupabaseBrowser();

  // Addresses
  async getAddresses(userId: string): Promise<UserAddress[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching addresses:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
  }

  async saveAddress(
    address: Omit<UserAddress, "id" | "created_at" | "updated_at">
  ): Promise<UserAddress | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_addresses")
        .insert(address)
        .select()
        .single();

      if (error) {
        console.error("Error saving address:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error saving address:", error);
      return null;
    }
  }

  async updateAddress(
    id: string,
    updates: Partial<UserAddress>
  ): Promise<UserAddress | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_addresses")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating address:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error updating address:", error);
      return null;
    }
  }

  async deleteAddress(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_addresses")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting address:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting address:", error);
      return false;
    }
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
    try {
      // First, unset all default addresses for this user
      await this.supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", userId);

      // Then set the specified address as default
      const { error } = await this.supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", addressId);

      if (error) {
        console.error("Error setting default address:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error setting default address:", error);
      return false;
    }
  }

  // Preferences
  async getPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("Error fetching preferences:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return null;
    }
  }

  async savePreferences(
    preferences: Omit<UserPreferences, "id" | "created_at" | "updated_at">
  ): Promise<UserPreferences | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_preferences")
        .upsert(preferences, { onConflict: "user_id" })
        .select()
        .single();

      if (error) {
        console.error("Error saving preferences:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error saving preferences:", error);
      return null;
    }
  }

  // Wishlist
  async getWishlist(userId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_wishlist")
        .select("product_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching wishlist:", error);
        return [];
      }
      return data?.map((item) => item.product_id) || [];
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return [];
    }
  }

  async addToWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_wishlist")
        .insert({ user_id: userId, product_id: productId });

      if (error) {
        console.error("Error adding to wishlist:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return false;
    }
  }

  async removeFromWishlist(
    userId: string,
    productId: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) {
        console.error("Error removing from wishlist:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  }

  // Compare
  async getCompareList(userId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_compare")
        .select("product_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching compare list:", error);
        return [];
      }
      return data?.map((item) => item.product_id) || [];
    } catch (error) {
      console.error("Error fetching compare list:", error);
      return [];
    }
  }

  async addToCompare(userId: string, productId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_compare")
        .insert({ user_id: userId, product_id: productId });

      if (error) {
        console.error("Error adding to compare:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error adding to compare:", error);
      return false;
    }
  }

  async removeFromCompare(userId: string, productId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_compare")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) {
        console.error("Error removing from compare:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error removing from compare:", error);
      return false;
    }
  }

  async clearCompareList(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_compare")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("Error clearing compare list:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error clearing compare list:", error);
      return false;
    }
  }

  // Cart
  async getCart(userId: string): Promise<UserCartItem[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_cart")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching cart:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching cart:", error);
      return [];
    }
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1,
    productTitle?: string,
    productBrand?: string,
    productImage?: string,
    productPrice?: number
  ): Promise<UserCartItem | null> {
    try {
      // Check if item already exists in cart
      const { data: existing } = await this.supabase
        .from("user_cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();

      if (existing) {
        // Update quantity
        const { data, error } = await this.supabase
          .from("user_cart")
          .update({
            quantity: existing.quantity + quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating cart item:", error);
          return null;
        }
        return data;
      } else {
        // Insert new item with product details
        const cartItem = {
          user_id: userId,
          product_id: productId,
          quantity,
          product_title: productTitle || `Product ${productId}`,
          product_brand: productBrand || "Unknown",
          product_image: productImage || "/placeholder.jpg",
          product_price: productPrice || 0,
        };

        const { data, error } = await this.supabase
          .from("user_cart")
          .insert(cartItem)
          .select()
          .single();

        if (error) {
          console.error("Error adding to cart:", error);
          return null;
        }
        return data;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      return null;
    }
  }

  async updateCartQuantity(
    cartItemId: string,
    quantity: number
  ): Promise<UserCartItem | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_cart")
        .update({
          quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cartItemId)
        .select()
        .single();

      if (error) {
        console.error("Error updating cart quantity:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      return null;
    }
  }

  async removeFromCart(cartItemId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_cart")
        .delete()
        .eq("id", cartItemId);

      if (error) {
        console.error("Error removing from cart:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  }

  async clearCart(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("user_cart")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("Error clearing cart:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  }
}

export const userDataService = new UserDataService();
