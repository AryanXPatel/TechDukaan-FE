import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "buHGaQFNLR8Nnss",
});

async function configureProductsIndex() {
  try {
    const index = client.index("products");

    // Get current filterable attributes
    const currentFilterable = await index.getFilterableAttributes();
    console.log("Current filterable attributes:", currentFilterable);

    // Add 'id' to filterable attributes
    const newFilterableAttributes = [...new Set([...currentFilterable, "id"])];

    console.log("Setting filterable attributes to:", newFilterableAttributes);

    // Update filterable attributes
    const task = await index.updateFilterableAttributes(
      newFilterableAttributes
    );
    console.log("Update task:", task);

    console.log("✅ Successfully updated 'id' to filterable attributes");
    console.log(
      "Note: MeiliSearch will process this update in the background."
    );

    // Check the task status after a short delay
    setTimeout(async () => {
      try {
        const updatedFilterable = await index.getFilterableAttributes();
        console.log("Updated filterable attributes:", updatedFilterable);
      } catch (error) {
        console.log(
          "Task may still be processing. Check MeiliSearch dashboard for status."
        );
      }
    }, 2000);
  } catch (error) {
    console.error("❌ Error configuring MeiliSearch index:", error);
  }
}

// Run the configuration
configureProductsIndex();
