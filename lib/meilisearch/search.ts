import { categoriesIndex, productsIndex } from "./client";

export async function searchProducts(
  query: string,
  options?: {
    limit?: number;
    offset?: number;
    filter?: string[];
    facets?: string[];
    sort?: string[];
  }
) {
  try {
    const searchParams: any = {
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      attributesToHighlight: ["title", "description"],
      highlightPreTag: "<mark>",
      highlightPostTag: "</mark>",
    };

    if (options?.filter && options.filter.length > 0) {
      searchParams.filter = options.filter;
    }

    if (options?.facets && options.facets.length > 0) {
      searchParams.facets = options.facets;
    }

    if (options?.sort && options.sort.length > 0) {
      searchParams.sort = options.sort;
    }

    const results = await productsIndex.search(query, searchParams);

    return {
      hits: results.hits.map(transformMeilisearchProduct),
      totalHits: results.estimatedTotalHits || 0,
      facets: results.facetDistribution || {},
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      hits: [],
      totalHits: 0,
      facets: {},
    };
  }
}

export async function getProducts(options?: {
  limit?: number;
  offset?: number;
  filter?: string[];
  sort?: string[];
}) {
  try {
    const searchParams: any = {
      limit: options?.limit || 50,
      offset: options?.offset || 0,
    };

    if (options?.filter && options.filter.length > 0) {
      searchParams.filter = options.filter;
    }

    if (options?.sort && options.sort.length > 0) {
      searchParams.sort = options.sort;
    }

    const results = await productsIndex.search("", searchParams);

    return {
      hits: results.hits.map(transformMeilisearchProduct),
      totalHits: results.estimatedTotalHits || 0,
      facets: results.facetDistribution || {},
      totalPages: Math.ceil(
        (results.estimatedTotalHits || 0) / (options?.limit || 50)
      ),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      hits: [],
      totalHits: 0,
      facets: {},
      totalPages: 0,
    };
  }
}

export async function getProduct(id: string) {
  try {
    // First try to get the document directly by ID
    const product = await productsIndex.getDocument(id);
    return product ? transformMeilisearchProduct(product) : null;
  } catch (error) {
    console.error("Error fetching product by document ID:", error);
    // Fallback to search with filter if getDocument fails
    try {
      const results = await productsIndex.search("", {
        filter: [`id = "${id}"`],
        limit: 1,
      });

      const product = results.hits[0];
      return product ? transformMeilisearchProduct(product) : null;
    } catch (searchError) {
      console.error("Error fetching product:", searchError);
      return null;
    }
  }
}

export async function getFeaturedProducts(limit: number = 10) {
  try {
    const results = await productsIndex.search("", {
      limit,
      sort: ["createdAt:desc"],
    });

    return {
      hits: results.hits.map(transformMeilisearchProduct),
      totalHits: results.estimatedTotalHits || 0,
    };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      hits: [],
      totalHits: 0,
    };
  }
}

// Transform Meilisearch product data to match our Product interface
function transformMeilisearchProduct(product: any) {
  // Extract vendor from product title (Dell, HP, Lenovo, etc.)
  const extractVendor = (title: string) => {
    if (!title) return "TechDukaan";
    const titleLower = title.toLowerCase();
    if (titleLower.includes("dell")) return "Dell";
    if (titleLower.includes("hp")) return "HP";
    if (titleLower.includes("lenovo")) return "Lenovo";
    if (titleLower.includes("asus")) return "ASUS";
    if (titleLower.includes("acer")) return "Acer";
    if (titleLower.includes("apple")) return "Apple";
    if (titleLower.includes("microsoft")) return "Microsoft";
    return "TechDukaan";
  };

  // Extract specs from title
  const extractSpecs = (title: string) => {
    const text = title.toLowerCase();
    const specs = [];

    if (text.includes("i3")) specs.push("Intel i3");
    else if (text.includes("i5")) specs.push("Intel i5");
    else if (text.includes("i7")) specs.push("Intel i7");
    else if (text.includes("ryzen")) specs.push("AMD Ryzen");

    if (text.includes("16gb")) specs.push("16GB RAM");
    else if (text.includes("8gb")) specs.push("8GB RAM");
    else if (text.includes("32gb")) specs.push("32GB RAM");

    if (text.includes("512gb")) specs.push("512GB SSD");
    else if (text.includes("256gb")) specs.push("256GB SSD");
    else if (text.includes("1tb")) specs.push("1TB SSD");

    return specs.join(" · ") || "Refurbished Laptop";
  };

  // Extract RAM from title
  const extractRAM = (title: string) => {
    if (title.toLowerCase().includes("16gb")) return "16GB";
    if (title.toLowerCase().includes("8gb")) return "8GB";
    if (title.toLowerCase().includes("32gb")) return "32GB";
    return "8GB";
  };

  // Extract storage from title
  const extractStorage = (title: string) => {
    if (title.toLowerCase().includes("1tb")) return "1TB";
    if (title.toLowerCase().includes("512gb")) return "512GB";
    if (title.toLowerCase().includes("256gb")) return "256GB";
    return "256GB";
  };

  const priceAmount = product.price || 0;

  return {
    id: product.id || product.objectID,
    unitId: product.id || product.objectID,
    title: product.title || "Refurbished Laptop",
    brand: extractVendor(product.title),
    specs: extractSpecs(product.title),
    price: `₹${priceAmount.toLocaleString()}`,
    numericPrice: priceAmount,
    mrp: `₹${Math.round(priceAmount * 1.3).toLocaleString()}`,
    mrpNumeric: Math.round(priceAmount * 1.3),
    discountPct: 23,
    image: product.image || "/placeholder.png",
    images: product.image
      ? [
          {
            src: product.image,
            alt: product.title || "Product image",
            blurDataURL: undefined,
          },
        ]
      : [],
    ram: extractRAM(product.title) as "8GB" | "16GB" | "32GB",
    storage: extractStorage(product.title) as "256GB" | "512GB" | "1TB",
    conditionGrade: "Excellent" as const,
    conditionNotes: "Professionally refurbished with quality guarantee",
    stock: 5,
    included: ["Charger", "6‑month warranty", "Initial setup service"],
    // Transform collections from string array to object array with handle
    collections:
      product.collections?.map((collectionName: string) => ({
        handle: collectionName.toLowerCase().replace(/\s+/g, "-"),
        title: collectionName,
      })) || [],
    // Add priceRange field for compatibility
    priceRange: {
      minVariantPrice: {
        amount: priceAmount,
        currencyCode: "INR",
      },
    },
    // Extract vendor from product title
    vendor: extractVendor(product.title),
    // Add default values for missing fields
    avgRating: product.avgRating || null,
    totalReviews: product.totalReviews || 0,
  };
}
