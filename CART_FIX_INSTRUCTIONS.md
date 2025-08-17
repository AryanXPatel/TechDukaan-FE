# Cart & Wishlist Database Setup

## 🚨 IMPORTANT: Database Setup Required

The cart is not working because the Supabase database tables don't exist yet. Please follow these steps:

### Step 1: Create Database Tables
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Open your project: **tkksqwdirnbmqjsrqito**
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `supabase-schema.sql` (located in this folder)
6. Click **Run** to execute the SQL

### Step 2: Verify Tables Created
After running the schema, you should see these tables in your Database → Tables section:
- ✅ `user_addresses`
- ✅ `user_preferences` 
- ✅ `user_wishlist`
- ✅ `user_compare`
- ✅ `user_cart`

### Step 3: Test the Cart
1. Start the dev server: `npm run dev`
2. Try adding items to cart as both:
   - **Guest user** (should work with localStorage)
   - **Signed-in user** (should work with Supabase)

## 🔧 What Was Fixed

### Cart Context Issues:
- ✅ **Fixed AuthGuard import error** (was default export, now named export)
- ✅ **Added guest user support** - cart now works without authentication
- ✅ **Added product details storage** - cart items now store title, price, image, brand
- ✅ **Added sync functionality** - when guest signs in, their cart merges with Supabase
- ✅ **Added fallback handling** - if Supabase fails, falls back to localStorage

### Database Schema Updates:
- ✅ **Enhanced user_cart table** - now stores product details for better performance
- ✅ **Row Level Security** - users can only access their own data
- ✅ **Proper indexing** - optimized for performance

## 🎯 Expected Behavior After Setup

### For Guest Users:
- ✅ Can add/remove items from cart
- ✅ Cart data stored in browser localStorage  
- ✅ Cart persists during session
- ❌ Cannot proceed to checkout (requires sign-in)

### For Authenticated Users:
- ✅ Can add/remove items from cart
- ✅ Cart data stored in Supabase database
- ✅ Cart syncs across devices and sessions
- ✅ Can proceed to checkout
- ✅ When signing in as guest with items, carts merge automatically

## 🐛 Troubleshooting

If cart still doesn't work after setup:

1. **Check browser console** for error messages
2. **Verify Supabase connection** - check Network tab in DevTools
3. **Clear browser storage** - localStorage might have corrupted data
4. **Check Row Level Security** - ensure policies are properly set

### Console Commands to Test:
```javascript
// Test localStorage cart (guest)
localStorage.setItem('tk_cart', '[]')
localStorage.getItem('tk_cart')

// Check if user is signed in
// (Open browser console on your app)
console.log('User:', window.supabase?.auth?.getUser())
```

---

**Status: ✅ Ready to test after running the database schema!**
