// Debug script to test Supabase database connectivity and table existence
import { getSupabaseBrowser } from "./lib/supabase/supabase-browser.js";

async function testSupabaseConnection() {
  const supabase = getSupabaseBrowser();
  
  console.log("Testing Supabase connection...");
  
  try {
    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    console.log("Auth status:", authError ? authError.message : "Connected");
    console.log("Current user:", authData?.user?.email || "Not signed in");
    
    // Test if tables exist by trying to select from them
    const tables = [
      'user_addresses',
      'user_preferences', 
      'user_wishlist',
      'user_compare',
      'user_cart'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.error(`❌ Table '${table}' error:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists and accessible`);
        }
      } catch (err) {
        console.error(`❌ Table '${table}' failed:`, err.message);
      }
    }
    
    // Test adding a cart item if user is signed in
    if (authData?.user?.id) {
      console.log("\nTesting cart operations...");
      try {
        const { data, error } = await supabase
          .from('user_cart')
          .insert({
            user_id: authData.user.id,
            product_id: 'test-product-123',
            quantity: 1
          })
          .select()
          .single();
          
        if (error) {
          console.error("❌ Cart insert failed:", error.message);
        } else {
          console.log("✅ Cart insert successful:", data);
          
          // Clean up test data
          await supabase.from('user_cart').delete().eq('id', data.id);
          console.log("✅ Test data cleaned up");
        }
      } catch (err) {
        console.error("❌ Cart test failed:", err.message);
      }
    }
    
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
  }
}

// Run the test
testSupabaseConnection().then(() => {
  console.log("\nTest completed!");
}).catch(err => {
  console.error("Test failed:", err);
});
