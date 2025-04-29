export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  additionalImages?: string[];
  colors?: string[];
  sizes?: string[];
  rating: number;
  reviews?: number;
  featured?: boolean;
  dateAdded?: Date;
  category?: string;
}

// Mock products data
const products: Product[] = [
  {
    id: 1,
    name: "Quantum Jacket",
    price: 299,
    description: "Avant-garde design with smart-tech integration. The Quantum Jacket redefines outerwear with its integrated smart technology and sleek silhouette.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3",
    additionalImages: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?ixlib=rb-4.0.3"
    ],
    colors: ["#FF3366", "#00FFCC", "#6600FF"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 36,
    featured: true,
    dateAdded: new Date("2023-05-15"),
    category: "Outerwear"
  },
  {
    id: 2,
    name: "Prism Sneakers",
    price: 189,
    description: "Holographic finish with adaptive cushioning. These sneakers adapt to your movements for ultimate comfort.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3",
    colors: ["#00FFCC", "#6600FF", "#FFFFFF"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    rating: 4.7,
    reviews: 28,
    featured: true,
    dateAdded: new Date("2023-04-20"),
    category: "Footwear"
  },
  {
    id: 3,
    name: "Nexus Timepiece",
    price: 459,
    description: "Biometric tracking with holographic display. This timepiece doesn't just tell time—it connects to your digital life.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3",
    colors: ["#FF3366", "#000000", "#6600FF"],
    rating: 5.0,
    reviews: 42,
    featured: true,
    dateAdded: new Date("2023-06-10"),
    category: "Accessories"
  },
  {
    id: 4,
    name: "Neo Shades",
    price: 149,
    description: "AR-enhanced sunglasses with customizable display settings and UV protection.",
    image: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?ixlib=rb-4.0.3",
    colors: ["#000000", "#FF3366", "#6600FF"],
    rating: 4.8,
    reviews: 23,
    dateAdded: new Date("2023-03-25"),
    category: "Accessories"
  },
  {
    id: 5,
    name: "Quantum Pack",
    price: 219,
    description: "Smart backpack with integrated charging, anti-theft technology, and expandable compartments.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3",
    colors: ["#000000", "#00FFCC", "#6600FF"],
    rating: 4.9,
    reviews: 31,
    dateAdded: new Date("2023-02-18"),
    category: "Accessories"
  },
  {
    id: 6,
    name: "Reflex Coat",
    price: 329,
    description: "Temperature-adaptive coat with holographic accents and water-repellent finish.",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3",
    colors: ["#6600FF", "#FF3366", "#000000"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 19,
    dateAdded: new Date("2023-01-15"),
    category: "Outerwear"
  },
  {
    id: 7,
    name: "Pulse Watch",
    price: 279,
    description: "Health-monitoring smartwatch with holographic display and customizable interfaces.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3",
    colors: ["#000000", "#FF3366", "#00FFCC"],
    rating: 5.0,
    reviews: 45,
    dateAdded: new Date("2023-05-05"),
    category: "Accessories"
  },
  {
    id: 8,
    name: "Gravity Boots",
    price: 239,
    description: "Ultra-lightweight boots with enhanced suspension and energy-return technology.",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3",
    colors: ["#000000", "#6600FF"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    rating: 4.6,
    reviews: 37,
    dateAdded: new Date("2023-03-10"),
    category: "Footwear"
  },
  {
    id: 9,
    name: "Vantage Glasses",
    price: 189,
    description: "Digital-overlay glasses with ambient information display and eye protection.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3",
    colors: ["#FF3366", "#6600FF", "#000000"],
    rating: 4.9,
    reviews: 29,
    dateAdded: new Date("2023-06-22"),
    category: "Accessories"
  },
  {
    id: 10,
    name: "Echo Bag",
    price: 199,
    description: "Modular crossbody bag with customizable compartments and tech-friendly features.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3",
    colors: ["#000000", "#FF3366", "#00FFCC"],
    rating: 4.8,
    reviews: 26,
    dateAdded: new Date("2023-04-15"),
    category: "Accessories"
  },
  {
    id: 11,
    name: "Prism Dress",
    price: 299,
    description: "Light-reactive dress that changes patterns based on environment and movement.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3",
    colors: ["#FF3366", "#00FFCC", "#6600FF"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.7,
    reviews: 33,
    dateAdded: new Date("2023-05-28"),
    category: "Apparel"
  },
  {
    id: 12,
    name: "Apex Headset",
    price: 349,
    description: "Immersive audio headset with spatial sound and customizable lighting.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3",
    colors: ["#000000", "#FF3366", "#6600FF"],
    rating: 4.9,
    reviews: 41,
    dateAdded: new Date("2023-02-12"),
    category: "Tech"
  }
];

// Get all products
export function getAllProducts(): Product[] {
  return products;
}

// Get featured products
export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

// Get product by ID
export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}

// Get products by category
export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

export default products;
