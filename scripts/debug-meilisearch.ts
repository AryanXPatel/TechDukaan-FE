import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "buHGaQFNLR8Nnss",
});

async function debugProductsIndex() {
  try {
    const index = client.index("products");

    // Get some sample products to see the structure
    console.log("🔍 Fetching sample products...");
    const results = await index.search("", { limit: 5 });

    console.log(`Found ${results.hits.length} products:`);
    results.hits.forEach((product: any, idx: number) => {
      console.log(`\n--- Product ${idx + 1} ---`);
      console.log(`ID: ${product.id}`);
      console.log(`Title: ${product.title}`);
      console.log(`Object ID: ${product.objectID || "N/A"}`);
      console.log(`Other fields:`, Object.keys(product));
    });

    // Test specific product ID
    const testId = "prod_01K1R8XAT4VGBEE9X4W9N9D184";
    console.log(`\n🎯 Testing specific product ID: ${testId}`);

    try {
      const directDoc = await index.getDocument(testId);
      console.log("✅ Found via getDocument:", directDoc.title);
    } catch (error) {
      console.log("❌ getDocument failed:", (error as Error).message);
    }

    try {
      const searchResults = await index.search("", {
        filter: [`id = "${testId}"`],
        limit: 1,
      });
      console.log(
        "✅ Found via search filter:",
        searchResults.hits.length > 0
          ? searchResults.hits[0].title
          : "Not found"
      );
    } catch (error) {
      console.log("❌ Search filter failed:", (error as Error).message);
    }

    // Try searching by title
    console.log("\n🔍 Searching for 'Dell' products...");
    const dellResults = await index.search("Dell", { limit: 3 });
    console.log(`Found ${dellResults.hits.length} Dell products`);
    dellResults.hits.forEach((product: any) => {
      console.log(`- ${product.id}: ${product.title}`);
    });
  } catch (error) {
    console.error("❌ Error debugging products index:", error);
  }
}

// Run the debug
debugProductsIndex();
