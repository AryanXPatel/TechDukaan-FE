export type ConditionGrade = "Excellent" | "Good" | "Fair";

export type ProductImage = {
  src: string;
  alt: string;
  blurDataURL?: string;
};

export type Product = {
  id: string;
  unitId: string;
  title: string;
  brand: string;
  specs: string;
  price: string;
  numericPrice: number;
  mrp?: string;
  mrpNumeric?: number;
  discountPct?: number;
  image: string;
  images?: ProductImage[];
  ram: "8GB" | "16GB" | "32GB";
  storage: "256GB" | "512GB" | "1TB";
  conditionGrade?: ConditionGrade;
  conditionNotes?: string;
  stock?: number;
  included?: string[];
  // Additional fields for compatibility with meilisearch results
  collections?: Array<{ handle: string; title: string }>;
  priceRange?: {
    minVariantPrice: {
      amount: number;
      currencyCode: string;
    };
  };
  vendor?: string;
  avgRating?: number | null;
  totalReviews?: number;
};

import { TINY_BLUR } from "./blur";

export const products: Product[] = [
  {
    id: "p1",
    unitId: "TD-DL5520-EX-0001",
    title: "Dell Latitude 5520 · Intel i5 11th Gen · 16GB RAM · 512GB SSD",
    brand: "Dell",
    specs: "i5-1145G7 · Intel Iris Xe",
    price: "₹42,999",
    numericPrice: 42999,
    mrp: "₹54,999",
    mrpNumeric: 54999,
    discountPct: 22,
    image: "/dell-latitude-5520.png",
    images: [
      {
        src: "/products/p1/1.png",
        alt: "Dell Latitude 5520 front",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p1/2.png",
        alt: "Dell Latitude 5520 keyboard and deck",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p1/3.png",
        alt: "Dell Latitude 5520 left ports",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p1/4.png",
        alt: "Dell Latitude 5520 right ports",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p1/5.png",
        alt: "Dell Latitude 5520 lid close-up with minor mark",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p1/6.png",
        alt: "Dell Latitude 5520 bottom ventilation",
        blurDataURL: TINY_BLUR,
      },
    ],
    ram: "16GB",
    storage: "512GB",
    conditionGrade: "Excellent",
    conditionNotes: "Minor hairline on lid. Battery health 88%.",
    stock: 6,
    included: ["65W charger", "6‑month warranty", "Initial setup service"],
  },
  {
    id: "p2",
    unitId: "TD-HP840G5-GD-0027",
    title: "HP EliteBook 840 G5 · Intel i5 8th Gen · 8GB · 256GB SSD",
    brand: "HP",
    specs: "i5-8350U · 14” FHD",
    price: "₹23,999",
    numericPrice: 23999,
    mrp: "₹32,999",
    mrpNumeric: 32999,
    discountPct: 27,
    image: "/placeholder-i4iz2.png",
    images: [
      {
        src: "/products/p2/1.png",
        alt: "EliteBook 840 G5 front",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p2/2.png",
        alt: "EliteBook 840 G5 keyboard deck",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p2/3.png",
        alt: "EliteBook 840 G5 right ports",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p2/4.png",
        alt: "EliteBook 840 G5 lid close-up mark",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p2/5.png",
        alt: "EliteBook 840 G5 display close-up",
        blurDataURL: TINY_BLUR,
      },
    ],
    ram: "8GB",
    storage: "256GB",
    conditionGrade: "Good",
    conditionNotes: "Light wear on palm rest. Battery health 82%.",
    stock: 3,
    included: ["65W charger", "6‑month warranty", "Initial setup service"],
  },
  {
    id: "p3",
    unitId: "TD-LN-T490-FR-0102",
    title: "Lenovo ThinkPad T490 · Intel i5 8th Gen · 8GB · 256GB SSD",
    brand: "Lenovo",
    specs: "ThinkPad keyboard · FHD",
    price: "₹20,999",
    numericPrice: 20999,
    mrp: "₹28,999",
    mrpNumeric: 28999,
    discountPct: 28,
    image: "/lenovo-thinkpad-t490.png",
    images: [
      {
        src: "/products/p3/1.png",
        alt: "ThinkPad T490 front",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p3/2.png",
        alt: "ThinkPad T490 keyboard",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p3/3.png",
        alt: "ThinkPad T490 ports left",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p3/4.png",
        alt: "ThinkPad T490 hinge and lid close-up",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p3/5.png",
        alt: "ThinkPad T490 bottom panel",
        blurDataURL: TINY_BLUR,
      },
    ],
    ram: "8GB",
    storage: "256GB",
    conditionGrade: "Fair",
    conditionNotes: "Visible scuff on lid. Battery health 80%.",
    stock: 1,
    included: ["65W charger", "6‑month warranty", "Initial setup service"],
  },
  {
    id: "p4",
    unitId: "TD-DL5420-EX-0044",
    title: "Dell Latitude 5420 · Intel i5 11th Gen · 16GB · 256GB SSD",
    brand: "Dell",
    specs: "i5-1145G7 · 14” FHD",
    price: "₹29,999",
    numericPrice: 29999,
    mrp: "₹39,999",
    mrpNumeric: 39999,
    discountPct: 25,
    image: "/dell-latitude-5420.png",
    images: [
      {
        src: "/products/p4/1.png",
        alt: "Latitude 5420 front",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p4/2.png",
        alt: "Latitude 5420 deck",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p4/3.png",
        alt: "Latitude 5420 ports",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p4/4.png",
        alt: "Latitude 5420 lid",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p4/5.png",
        alt: "Latitude 5420 bottom",
        blurDataURL: TINY_BLUR,
      },
    ],
    ram: "16GB",
    storage: "256GB",
    conditionGrade: "Excellent",
    conditionNotes: "Minor micro-scratches on bottom. Battery health 90%.",
    stock: 9,
    included: ["65W charger", "6‑month warranty", "Initial setup service"],
  },
  {
    id: "p5",
    unitId: "TD-HP830G5-EX-0088",
    title: "HP EliteBook 830 G5 · Intel i7 8th Gen · 16GB · 512GB SSD",
    brand: "HP",
    specs: "i7-8650U · 13.3” FHD",
    price: "₹38,999",
    numericPrice: 38999,
    mrp: "₹49,999",
    mrpNumeric: 49999,
    discountPct: 22,
    image: "/hp-elitebook-830-g5.png",
    images: [
      {
        src: "/products/p5/1.png",
        alt: "EliteBook 830 G5 front",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p5/2.png",
        alt: "EliteBook 830 G5 keyboard",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p5/3.png",
        alt: "EliteBook 830 G5 side",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p5/4.png",
        alt: "EliteBook 830 G5 lid close-up",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p5/5.png",
        alt: "EliteBook 830 G5 bottom",
        blurDataURL: TINY_BLUR,
      },
    ],
    ram: "16GB",
    storage: "512GB",
    conditionGrade: "Excellent",
    conditionNotes: "No notable marks. Battery health 87%.",
    stock: 4,
    included: ["65W charger", "6‑month warranty", "Initial setup service"],
  },
  {
    id: "p6",
    unitId: "TD-LN-X1-EX-0031",
    title: "Lenovo ThinkPad X1 · Intel i7 · 16GB · 1TB SSD",
    brand: "Lenovo",
    specs: "Ultralight · Premium",
    price: "₹64,999",
    numericPrice: 64999,
    mrp: "₹79,999",
    mrpNumeric: 79999,
    discountPct: 19,
    image: "/lenovo-thinkpad-x1.png",
    images: [
      {
        src: "/products/p6/1.png",
        alt: "ThinkPad X1 front",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p6/2.png",
        alt: "ThinkPad X1 keyboard",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p6/3.png",
        alt: "ThinkPad X1 ports",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p6/4.png",
        alt: "ThinkPad X1 lid",
        blurDataURL: TINY_BLUR,
      },
      {
        src: "/products/p6/5.png",
        alt: "ThinkPad X1 bottom panel",
        blurDataURL: TINY_BLUR,
      },
    ],
    ram: "16GB",
    storage: "1TB",
    conditionGrade: "Good",
    conditionNotes: "Light wear on edges. Battery health 85%.",
    stock: 2,
    included: ["65W charger", "6‑month warranty", "Initial setup service"],
  },
];
