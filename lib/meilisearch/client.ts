import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "buHGaQFNLR8Nnss",
});

export const productsIndex = client.index("products");
export const categoriesIndex = client.index("categories");

export default client;
