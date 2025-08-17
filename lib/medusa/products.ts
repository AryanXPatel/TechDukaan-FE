import medusaClient from "./client";

export async function getProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
  collection_id?: string[];
  tags?: string[];
  sort?: string;
}) {
  try {
    const queryParams: any = {
      limit: params?.limit || 12,
      offset: params?.offset || 0,
      expand: "categories,collection,variants,variants.prices,images,tags",
    };

    if (params?.collection_id?.length) {
      queryParams.collection_id = params.collection_id;
    }

    if (params?.category_id?.length) {
      queryParams.category_id = params.category_id;
    }

    if (params?.tags?.length) {
      queryParams.tags = params.tags;
    }

    const { products, count } = await medusaClient.products.list(queryParams);

    return {
      products: products.map(transformProduct),
      count,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], count: 0 };
  }
}

export async function getProduct(handle: string) {
  try {
    const { products } = await medusaClient.products.list({
      handle,
      limit: 1,
      expand:
        "categories,collection,variants,variants.prices,images,tags,options,options.values",
    });

    if (products.length === 0) return null;

    return transformProduct(products[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductById(id: string) {
  try {
    const { products } = await medusaClient.products.list({
      id,
      limit: 1,
      expand:
        "categories,collection,variants,variants.prices,images,tags,options,options.values",
    });

    if (products.length === 0) return null;

    return transformProduct(products[0]);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

export async function getProductRecommendations(productId: string) {
  try {
    // Get the current product to find its collection
    const {
      products: [currentProduct],
    } = await medusaClient.products.list({
      id: productId,
      limit: 1,
    });

    if (!currentProduct) return [];

    // Get products from same collection
    const { products } = await medusaClient.products.list({
      collection_id: currentProduct.collection_id
        ? [currentProduct.collection_id]
        : undefined,
      limit: 5,
      expand: "categories,collection,variants,variants.prices,images,tags",
    });

    // Filter out current product and return
    return products
      .filter((p) => p.id !== productId)
      .slice(0, 4)
      .map(transformProduct);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

function transformProduct(product: any) {
  const cheapestVariant = product.variants?.reduce((prev: any, curr: any) => {
    const prevPrice = prev.prices?.[0]?.amount || Infinity;
    const currPrice = curr.prices?.[0]?.amount || Infinity;
    return currPrice < prevPrice ? curr : prev;
  }, product.variants[0]);

  // Extract specs from title or description for display
  const extractSpecs = (title: string, description?: string) => {
    const text = `${title} ${description || ""}`.toLowerCase();
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

  // Extract brand from title
  const extractBrand = (title: string) => {
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

  const priceAmount = (cheapestVariant?.prices?.[0]?.amount || 0) / 100;

  return {
    id: product.id,
    unitId: product.id, // Use product ID as unit ID for now
    handle: product.handle || product.id,
    availableForSale: product.status === "published",
    title: product.title,
    brand: extractBrand(product.title),
    specs: extractSpecs(product.title, product.description),
    price: `₹${priceAmount.toLocaleString()}`,
    numericPrice: priceAmount,
    mrp: `₹${Math.round(priceAmount * 1.3).toLocaleString()}`, // Calculate MRP as 30% higher
    mrpNumeric: Math.round(priceAmount * 1.3),
    discountPct: 23, // Default discount percentage
    description: product.description || "",
    descriptionHtml: product.description || "",
    tags: product.tags?.map((t: any) => t.value) || [],
    options:
      product.options?.map((option: any) => ({
        id: option.id,
        name: option.title,
        values: option.values?.map((v: any) => v.value) || [],
      })) || [],
    priceRange: {
      maxVariantPrice: {
        amount: priceAmount,
        currencyCode: cheapestVariant?.prices?.[0]?.currency_code || "INR",
      },
      minVariantPrice: {
        amount: priceAmount,
        currencyCode: cheapestVariant?.prices?.[0]?.currency_code || "INR",
      },
    },
    featuredImage: {
      url: product.thumbnail || product.images?.[0]?.url || "/placeholder.png",
      altText: product.title,
      width: 1024,
      height: 1024,
    },
    image: product.thumbnail || product.images?.[0]?.url || "/placeholder.png",
    images:
      product.images?.map((image: any, index: number) => ({
        src: image.url,
        alt: `${product.title} - Image ${index + 1}`,
        blurDataURL: undefined,
      })) || [],
    ram: extractRAM(product.title),
    storage: extractStorage(product.title),
    conditionGrade: "Excellent" as const, // Default condition
    conditionNotes: "Professionally refurbished with quality guarantee",
    stock: 5, // Default stock
    included: ["Charger", "6‑month warranty", "Initial setup service"],
    seo: {
      title: product.title,
      description: product.description || "",
    },
    variants:
      product.variants?.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.inventory_quantity > 0,
        selectedOptions:
          variant.options?.map((option: any) => ({
            name: option.option?.title || "Option",
            value: option.value,
          })) || [],
        price: {
          amount: (variant.prices?.[0]?.amount || 0) / 100,
          currencyCode: variant.prices?.[0]?.currency_code || "INR",
        },
      })) || [],
    updatedAt: product.updated_at,
  };
}
