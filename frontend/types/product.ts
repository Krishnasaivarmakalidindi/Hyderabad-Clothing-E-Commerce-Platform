// Complete Product Type Definition for Hyderabad Clothing E-Commerce Platform

export interface Product {
    id: number;
    slug: string;
    name: string;
    category: ProductCategory;
    subcategory: string;
    brand: string;
    description?: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    currency: string;

    // Size & Fit
    availableSizes: Size[];
    sizeChart?: string;
    fitType: FitType;

    // Physical Attributes
    weight: number; // in grams
    length: number; // in cm
    width: number; // in cm
    height: number; // in cm
    material: string;

    // Ratings & Popularity
    averageRating: number;
    ratingCount: number;
    popularityScore: number;
    reviews?: Review[];

    // Inventory & Status
    stockQuantity: number;
    inStock: boolean;
    isNewArrival: boolean;
    isFeatured: boolean;

    // Images & Media
    images: string[];
    videoUrl?: string;

    // Display
    tag?: string;
}

export type ProductCategory =
    | 'Sarees'
    | 'Kurtas'
    | 'Lehengas'
    | 'Fabrics'
    | 'Mens Ethnic'
    | 'Kids'
    | 'Accessories';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XS' | 'Free Size' | '38' | '40' | '42' | '44' | '46';

export type FitType = 'Regular' | 'Slim' | 'Loose' | 'Flared' | 'Semi-Fitted' | 'Custom' | 'Tailored';

export type SortOption =
    | 'popular'
    | 'price-low-high'
    | 'price-high-low'
    | 'highest-rated'
    | 'new-arrivals';

export interface Review {
    id: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
}

export interface FilterState {
    category: ProductCategory | 'All';
    priceRange: [number, number];
    minRating: number;
    sizes: Size[];
    materials: string[];
    inStock: boolean;
}

export interface ProductSearchParams {
    query?: string;
    category?: ProductCategory | 'All';
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: SortOption;
    page?: number;
    limit?: number;
}

// Fallback image for broken images
export const FALLBACK_IMAGE = 'https://images.pexels.com/photos/6311545/pexels-photo-6311545.jpeg';

// Category display names and icons
export const CATEGORY_CONFIG: Record<ProductCategory, { label: string; icon: string }> = {
    'Sarees': { label: 'Sarees', icon: '🥻' },
    'Kurtas': { label: 'Kurtas', icon: '👘' },
    'Lehengas': { label: 'Lehengas', icon: '👗' },
    'Fabrics': { label: 'Fabrics', icon: '🧵' },
    'Mens Ethnic': { label: "Men's Ethnic", icon: '👔' },
    'Kids': { label: 'Kids', icon: '👶' },
    'Accessories': { label: 'Accessories', icon: '👜' },
};

// Sort options configuration
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'highest-rated', label: 'Highest Rated' },
    { value: 'new-arrivals', label: 'New Arrivals' },
];

// Rating filter options
export const RATING_OPTIONS = [
    { value: 4, label: '4★ & Up' },
    { value: 3, label: '3★ & Up' },
    { value: 2, label: '2★ & Up' },
];
