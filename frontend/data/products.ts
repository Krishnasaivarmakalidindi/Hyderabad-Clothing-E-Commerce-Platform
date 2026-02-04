// Complete Product Data for Hyderabad Clothing E-Commerce Platform
// All images are copyright-free from Pexels

import { Product, FALLBACK_IMAGE } from '../types/product';

// Mock reviews generator for products
const generateMockReviews = (productId: number, count: number) => {
    const reviewers = [
        'Priya S.', 'Rahul M.', 'Anjali K.', 'Vikram P.', 'Sneha R.',
        'Arjun D.', 'Meera T.', 'Karthik N.', 'Divya B.', 'Suresh G.'
    ];
    const comments = [
        'Excellent quality! Exactly as shown in the pictures.',
        'Beautiful fabric and great stitching. Very happy with my purchase.',
        'Perfect fit and fast delivery. Will buy again!',
        'The color is slightly different but overall good product.',
        'Amazing craftsmanship. Worth every rupee.',
        'Good product for the price. Packaging was also nice.',
        'Received compliments at the wedding. Loved it!',
        'Material is comfortable and breathable. Perfect for summer.',
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: productId * 100 + i,
        userId: i + 1,
        userName: reviewers[i % reviewers.length],
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 rating
        comment: comments[i % comments.length],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        helpful: Math.floor(Math.random() * 50),
    }));
};

export const products: Product[] = [
    // ==================== SAREES (1-5) ====================
    {
        id: 1,
        slug: "kanjeevaram-wedding-silk-saree-emerald-green",
        name: "Kanjeevaram Wedding Silk Saree - Emerald Green",
        category: "Sarees",
        subcategory: "Kanjeevaram",
        brand: "South Silk Studio",
        description: "Stunning Kanjeevaram silk saree in rich emerald green with traditional motifs. Handwoven with pure silk zari for a luxurious wedding look. Perfect for brides and special occasions.",
        price: 8999,
        originalPrice: 10999,
        discountPercentage: 18,
        currency: "₹",
        availableSizes: ["Free Size"],
        fitType: "Regular",
        weight: 780,
        length: 630,
        width: 46,
        height: 4,
        material: "Silk",
        averageRating: 4.9,
        ratingCount: 321,
        popularityScore: 990,
        reviews: generateMockReviews(1, 5),
        stockQuantity: 15,
        inStock: true,
        isNewArrival: false,
        isFeatured: true,
        images: ["https://images.pexels.com/photos/730055/pexels-photo-730055.jpeg"]
    },
    {
        id: 2,
        slug: "banarasi-silk-festive-saree-red-gold",
        name: "Banarasi Silk Festive Saree - Red & Gold",
        category: "Sarees",
        subcategory: "Banarasi",
        brand: "Varanasi Weaves",
        description: "Exquisite Banarasi silk saree with traditional red and gold zari work. Handwoven by skilled artisans with authentic patterns. Perfect for weddings, festivals, and celebrations.",
        price: 4299,
        originalPrice: 5999,
        discountPercentage: 28,
        currency: "₹",
        availableSizes: ["Free Size"],
        fitType: "Regular",
        weight: 650,
        length: 620,
        width: 45,
        height: 4,
        material: "Silk",
        averageRating: 4.7,
        ratingCount: 214,
        popularityScore: 945,
        reviews: generateMockReviews(2, 5),
        stockQuantity: 38,
        inStock: true,
        isNewArrival: false,
        isFeatured: true,
        images: ["https://images.pexels.com/photos/2723623/pexels-photo-2723623.jpeg"]
    },
    {
        id: 3,
        slug: "handloom-cotton-dailywear-saree-mustard",
        name: "Handloom Cotton Dailywear Saree - Mustard",
        category: "Sarees",
        subcategory: "Handloom",
        brand: "Kalamkari Co.",
        description: "Comfortable handloom cotton saree in vibrant mustard. Breathable fabric perfect for daily wear with easy maintenance. Features traditional Kalamkari-inspired block prints.",
        price: 1199,
        originalPrice: 1999,
        discountPercentage: 40,
        currency: "₹",
        availableSizes: ["Free Size"],
        fitType: "Regular",
        weight: 520,
        length: 600,
        width: 44,
        height: 3,
        material: "Cotton",
        averageRating: 4.3,
        ratingCount: 87,
        popularityScore: 610,
        reviews: generateMockReviews(3, 4),
        stockQuantity: 62,
        inStock: true,
        isNewArrival: true,
        isFeatured: false,
        images: ["https://images.pexels.com/photos/35390247/pexels-photo-35390247.jpeg"]
    },
    {
        id: 4,
        slug: "linen-stripe-summer-saree-charcoal-grey",
        name: "Linen Stripe Summer Saree - Charcoal Grey",
        category: "Sarees",
        subcategory: "Linen",
        brand: "Monsoon Looms",
        description: "Lightweight linen saree with subtle stripe pattern in charcoal grey. Ideal for summer with natural temperature regulation. Modern design with traditional drape.",
        price: 2599,
        originalPrice: 3499,
        discountPercentage: 25,
        currency: "₹",
        availableSizes: ["Free Size"],
        fitType: "Regular",
        weight: 560,
        length: 610,
        width: 44,
        height: 3,
        material: "Linen",
        averageRating: 4.2,
        ratingCount: 56,
        popularityScore: 530,
        reviews: generateMockReviews(4, 4),
        stockQuantity: 40,
        inStock: true,
        isNewArrival: true,
        isFeatured: false,
        images: ["https://images.pexels.com/photos/1229414/pexels-photo-1229414.jpeg"]
    },
    {
        id: 5,
        slug: "georgette-party-wear-saree-navy-sequin",
        name: "Georgette Party Wear Saree - Navy Sequin",
        category: "Sarees",
        subcategory: "Party Wear",
        brand: "Urban Ethnic",
        description: "Elegant georgette saree adorned with navy sequins and beaded work. Perfect for parties, receptions, and evening events. Graceful drape with shimmering details.",
        price: 3199,
        originalPrice: 4599,
        discountPercentage: 30,
        currency: "₹",
        availableSizes: ["Free Size"],
        fitType: "Regular",
        weight: 600,
        length: 615,
        width: 45,
        height: 3,
        material: "Georgette",
        averageRating: 3.9,
        ratingCount: 42,
        popularityScore: 420,
        reviews: generateMockReviews(5, 3),
        stockQuantity: 22,
        inStock: true,
        isNewArrival: false,
        isFeatured: false,
        images: ["https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg"]
    },

    // ==================== MENS ETHNIC (6-10) ====================
    {
        id: 6,
        slug: "mens-solid-cotton-kurta-white",
        name: "Men's Solid Cotton Kurta - White",
        category: "Mens Ethnic",
        subcategory: "Kurtas",
        brand: "Desi Threads",
        description: "Classic white cotton kurta for men. A versatile wardrobe essential perfect for festivals, ceremonies, or casual wear. Comfortable and breathable fabric.",
        price: 999,
        originalPrice: 1499,
        discountPercentage: 33,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        fitType: "Regular",
        weight: 380,
        length: 80,
        width: 35,
        height: 3,
        material: "Cotton",
        averageRating: 4.1,
        ratingCount: 132,
        popularityScore: 765,
        reviews: generateMockReviews(6, 4),
        stockQuantity: 70,
        inStock: true,
        isNewArrival: false,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/6311570/pexels-photo-6311570.jpeg"
        ]
    },
    {
        id: 7,
        slug: "mens-pathani-kurta-black",
        name: "Men's Pathani Kurta - Jet Black",
        category: "Mens Ethnic",
        subcategory: "Pathani",
        brand: "Nawab Street",
        description: "Stylish Pathani suit in jet black with traditional collar design. Perfect for Eid celebrations and formal ethnic occasions. Premium cotton blend fabric.",
        price: 1499,
        originalPrice: 2199,
        discountPercentage: 31,
        currency: "₹",
        availableSizes: ["M", "L", "XL", "XXL"],
        fitType: "Loose",
        weight: 420,
        length: 88,
        width: 36,
        height: 3,
        material: "Cotton Blend",
        averageRating: 4.5,
        ratingCount: 98,
        popularityScore: 840,
        reviews: generateMockReviews(7, 4),
        stockQuantity: 34,
        inStock: true,
        isNewArrival: true,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/6311571/pexels-photo-6311571.jpeg"
        ]
    },
    {
        id: 8,
        slug: "mens-silk-kurta-pajama-maroon",
        name: "Men's Silk Kurta Pajama Set - Maroon",
        category: "Mens Ethnic",
        subcategory: "Kurta Set",
        brand: "Shaadi Edit",
        description: "Luxurious maroon silk kurta pajama set with subtle embroidery. Ideal for weddings, engagements, and grand celebrations. Comes with matching churidar pajama.",
        price: 2799,
        originalPrice: 3499,
        discountPercentage: 20,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL"],
        fitType: "Slim",
        weight: 620,
        length: 90,
        width: 38,
        height: 4,
        material: "Art Silk",
        averageRating: 4.6,
        ratingCount: 187,
        popularityScore: 910,
        reviews: generateMockReviews(8, 5),
        stockQuantity: 28,
        inStock: true,
        isNewArrival: false,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/7697321/pexels-photo-7697321.jpeg"
        ]
    },
    {
        id: 9,
        slug: "mens-nehru-jacket-navy",
        name: "Men's Nehru Jacket - Navy Textured",
        category: "Mens Ethnic",
        subcategory: "Jackets",
        brand: "Regal Roots",
        description: "Elegant Nehru jacket in textured navy fabric. Layer over kurtas or shirts for a sophisticated ethnic look. Perfect for corporate events and festive occasions.",
        price: 1899,
        originalPrice: 2599,
        discountPercentage: 27,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL"],
        fitType: "Slim",
        weight: 480,
        length: 72,
        width: 40,
        height: 4,
        material: "Poly Viscose Blend",
        averageRating: 3.8,
        ratingCount: 64,
        popularityScore: 520,
        reviews: generateMockReviews(9, 3),
        stockQuantity: 19,
        inStock: true,
        isNewArrival: true,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/6311572/pexels-photo-6311572.jpeg"
        ]
    },
    {
        id: 10,
        slug: "mens-casual-kurta-linen-olive",
        name: "Men's Casual Linen Kurta - Olive",
        category: "Mens Ethnic",
        subcategory: "Kurtas",
        brand: "Everyday Desi",
        description: "Casual linen kurta in earthy olive shade. Perfect for brunches, beach outings, and relaxed gatherings. Soft, breathable, and effortlessly stylish.",
        price: 1299,
        originalPrice: 1799,
        discountPercentage: 28,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        fitType: "Regular",
        weight: 410,
        length: 82,
        width: 36,
        height: 3,
        material: "Linen Blend",
        averageRating: 4.0,
        ratingCount: 73,
        popularityScore: 640,
        reviews: generateMockReviews(10, 4),
        stockQuantity: 45,
        inStock: true,
        isNewArrival: false,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/6311576/pexels-photo-6311576.jpeg"
        ]
    },

    // ==================== WOMENS KURTAS (11-15) ====================
    {
        id: 11,
        slug: "womens-straight-kurta-cotton-teal",
        name: "Women's Straight Cotton Kurta - Teal Print",
        category: "Kurtas",
        subcategory: "Straight Kurta",
        brand: "Jaipur Prints",
        description: "Elegant straight-cut cotton kurta with beautiful teal print pattern. Perfect for office wear and casual outings. Features side slits and three-quarter sleeves.",
        price: 899,
        originalPrice: 1399,
        discountPercentage: 36,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL"],
        fitType: "Regular",
        weight: 320,
        length: 46,
        width: 30,
        height: 3,
        material: "Cotton",
        averageRating: 4.4,
        ratingCount: 205,
        popularityScore: 880,
        reviews: generateMockReviews(11, 5),
        stockQuantity: 80,
        inStock: true,
        isNewArrival: false,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/6311500/pexels-photo-6311500.jpeg"
        ]
    },
    {
        id: 12,
        slug: "womens-anarkali-kurta-rayon-wine",
        name: "Women's Anarkali Kurta - Wine Gold Foil",
        category: "Kurtas",
        subcategory: "Anarkali",
        brand: "Festive Aura",
        description: "Stunning Anarkali kurta in wine color with gold foil print. Perfect for festive celebrations and parties. Features umbrella cut and elegant neckline.",
        price: 1699,
        originalPrice: 2499,
        discountPercentage: 32,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        fitType: "Flared",
        weight: 480,
        length: 52,
        width: 32,
        height: 4,
        material: "Rayon",
        averageRating: 4.6,
        ratingCount: 142,
        popularityScore: 905,
        reviews: generateMockReviews(12, 5),
        stockQuantity: 37,
        inStock: true,
        isNewArrival: true,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/6311504/pexels-photo-6311504.jpeg"
        ]
    },
    {
        id: 13,
        slug: "womens-a-line-kurta-linen-mint",
        name: "Women's A-line Linen Kurta - Mint",
        category: "Kurtas",
        subcategory: "A-line",
        brand: "Breeze Wear",
        description: "Fresh mint-colored A-line kurta in premium linen blend. Ideal for summer days and office wear. Features mandarin collar and wooden buttons.",
        price: 1199,
        originalPrice: 1899,
        discountPercentage: 36,
        currency: "₹",
        availableSizes: ["S", "M", "L"],
        fitType: "Regular",
        weight: 340,
        length: 48,
        width: 31,
        height: 3,
        material: "Linen Blend",
        averageRating: 3.9,
        ratingCount: 54,
        popularityScore: 590,
        reviews: generateMockReviews(13, 3),
        stockQuantity: 25,
        inStock: true,
        isNewArrival: false,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/6311511/pexels-photo-6311511.jpeg"
        ]
    },
    {
        id: 14,
        slug: "womens-kurta-set-cotton-mustard-palazzo",
        name: "Women's Printed Kurta Set with Palazzo - Mustard",
        category: "Kurtas",
        subcategory: "Kurta Set",
        brand: "Gulmohar Lane",
        description: "Complete kurta set with matching palazzo pants in vibrant mustard. Perfect for festivals and casual occasions. Includes printed dupatta.",
        price: 1999,
        originalPrice: 2899,
        discountPercentage: 31,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL"],
        fitType: "Regular",
        weight: 620,
        length: 50,
        width: 34,
        height: 5,
        material: "Cotton",
        averageRating: 4.8,
        ratingCount: 267,
        popularityScore: 960,
        reviews: generateMockReviews(14, 5),
        stockQuantity: 42,
        inStock: true,
        isNewArrival: false,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/6311503/pexels-photo-6311503.jpeg"
        ]
    },
    {
        id: 15,
        slug: "womens-short-kurti-denim-blue",
        name: "Women's Short Kurti - Denim Blue",
        category: "Kurtas",
        subcategory: "Short Kurti",
        brand: "UrbanFusion",
        description: "Trendy short kurti in denim blue shade. Perfect for pairing with jeans or palazzos. Features contemporary design with traditional embroidery.",
        price: 699,
        originalPrice: 1099,
        discountPercentage: 36,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL"],
        fitType: "Slim",
        weight: 280,
        length: 34,
        width: 30,
        height: 2,
        material: "Cotton Blend",
        averageRating: 3.7,
        ratingCount: 39,
        popularityScore: 430,
        reviews: generateMockReviews(15, 3),
        stockQuantity: 50,
        inStock: true,
        isNewArrival: true,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/6311502/pexels-photo-6311502.jpeg"
        ]
    },

    // ==================== LEHENGAS (16-19) ====================
    {
        id: 16,
        slug: "bridal-lehenga-velvet-red-zari",
        name: "Bridal Velvet Lehenga - Deep Red Zari",
        category: "Lehengas",
        subcategory: "Bridal",
        brand: "Royal Shaadi",
        description: "Magnificent bridal lehenga in deep red velvet with intricate zari embroidery. A show-stopping piece for your special day. Includes matching choli and dupatta.",
        price: 21999,
        originalPrice: 27999,
        discountPercentage: 21,
        currency: "₹",
        availableSizes: ["S", "M", "L"],
        fitType: "Regular",
        weight: 2400,
        length: 110,
        width: 45,
        height: 15,
        material: "Velvet",
        averageRating: 4.9,
        ratingCount: 87,
        popularityScore: 995,
        reviews: generateMockReviews(16, 5),
        stockQuantity: 8,
        inStock: true,
        isNewArrival: false,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/7697311/pexels-photo-7697311.jpeg"
        ]
    },
    {
        id: 17,
        slug: "partywear-lehenga-georgette-peach",
        name: "Partywear Georgette Lehenga - Peach Sequin",
        category: "Lehengas",
        subcategory: "Party Wear",
        brand: "Twirl & Tassel",
        description: "Glamorous party wear lehenga in peach georgette with sequin detailing. Perfect for sangeet, engagement, and cocktail parties. Lightweight and easy to carry.",
        price: 7999,
        originalPrice: 9999,
        discountPercentage: 20,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL"],
        fitType: "Regular",
        weight: 1650,
        length: 108,
        width: 44,
        height: 12,
        material: "Georgette",
        averageRating: 4.4,
        ratingCount: 112,
        popularityScore: 870,
        reviews: generateMockReviews(17, 5),
        stockQuantity: 18,
        inStock: true,
        isNewArrival: true,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/7697320/pexels-photo-7697320.jpeg"
        ]
    },
    {
        id: 18,
        slug: "printed-fusion-lehenga-cotton-yellow",
        name: "Printed Fusion Lehenga - Yellow Floral",
        category: "Lehengas",
        subcategory: "Fusion",
        brand: "Boho Baraat",
        description: "Contemporary fusion lehenga with yellow floral prints. Perfect for mehendi and haldi ceremonies. Comfortable cotton blend for all-day wear.",
        price: 4299,
        originalPrice: 5999,
        discountPercentage: 28,
        currency: "₹",
        availableSizes: ["S", "M", "L", "XL"],
        fitType: "Regular",
        weight: 1300,
        length: 104,
        width: 43,
        height: 10,
        material: "Cotton Blend",
        averageRating: 4.0,
        ratingCount: 63,
        popularityScore: 710,
        reviews: generateMockReviews(18, 4),
        stockQuantity: 22,
        inStock: true,
        isNewArrival: false,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/7697290/pexels-photo-7697290.jpeg"
        ]
    },
    {
        id: 19,
        slug: "silk-lehenga-teal-gota-patti",
        name: "Silk Lehenga - Teal Gota Patti",
        category: "Lehengas",
        subcategory: "Festive",
        brand: "Jaipur Royale",
        description: "Stunning teal silk lehenga with traditional gota patti work. Perfect for festive occasions and receptions. Features beautiful mirror and sequin embellishments.",
        price: 11999,
        originalPrice: 14999,
        discountPercentage: 20,
        currency: "₹",
        availableSizes: ["S", "M", "L"],
        fitType: "Regular",
        weight: 1900,
        length: 110,
        width: 45,
        height: 13,
        material: "Silk",
        averageRating: 4.7,
        ratingCount: 94,
        popularityScore: 930,
        reviews: generateMockReviews(19, 5),
        stockQuantity: 11,
        inStock: true,
        isNewArrival: true,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/7697323/pexels-photo-7697323.jpeg"
        ]
    },

    // ==================== FABRICS (20-23) ====================
    {
        id: 20,
        slug: "unstitched-cotton-fabric-blockprint-blue-2-5m",
        name: "Unstitched Cotton Fabric - Indigo Block Print (2.5m)",
        category: "Fabrics",
        subcategory: "Unstitched",
        brand: "Indigo Loom",
        description: "Premium quality unstitched cotton fabric with authentic indigo block print. Perfect for creating custom kurtas or dresses. 2.5 meters length.",
        price: 549,
        originalPrice: 799,
        discountPercentage: 31,
        currency: "₹",
        availableSizes: ["Free Size"],
        fitType: "Regular",
        weight: 350,
        length: 250,
        width: 110,
        height: 2,
        material: "Cotton",
        averageRating: 4.3,
        ratingCount: 76,
        popularityScore: 620,
        reviews: generateMockReviews(20, 4),
        stockQuantity: 120,
        inStock: true,
        isNewArrival: false,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg"
        ]
    },
    {
        id: 21,
        slug: "silk-blend-fabric-plain-maroon-3m",
        name: "Silk Blend Fabric - Plain Maroon (3m)",
        category: "Fabrics",
        subcategory: "Silk Blend",
        brand: "Fabric Vault",
        description: "Luxurious silk blend fabric in rich maroon color. Ideal for creating elegant kurtas, blouses, or evening wear. 3 meters length with excellent drape.",
        price: 1299,
        originalPrice: 1699,
        discountPercentage: 24,
        currency: "₹",
        availableSizes: ["Free Size"],
        fitType: "Regular",
        weight: 420,
        length: 300,
        width: 115,
        height: 2,
        material: "Silk Blend",
        averageRating: 4.5,
        ratingCount: 58,
        popularityScore: 700,
        reviews: generateMockReviews(21, 4),
        stockQuantity: 60,
        inStock: true,
        isNewArrival: true,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/3738085/pexels-photo-3738085.jpeg"
        ]
    },
    {
        id: 22,
        slug: "linen-fabric-textured-beige-2m",
        name: "Linen Fabric - Textured Beige (2m)",
        category: "Fabrics",
        subcategory: "Linen",
        brand: "Summer Looms",
        description: "Premium textured linen fabric in versatile beige shade. Perfect for summer wear and casual ethnic clothing. 2 meters length, breathable and comfortable.",
        price: 899,
        originalPrice: 1199,
        discountPercentage: 25,
        currency: "₹",
        availableSizes: ["Free Size"],
        fitType: "Regular",
        weight: 310,
        length: 200,
        width: 115,
        height: 2,
        material: "Linen",
        averageRating: 4.1,
        ratingCount: 44,
        popularityScore: 540,
        reviews: generateMockReviews(22, 3),
        stockQuantity: 48,
        inStock: true,
        isNewArrival: false,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg"
        ]
    },
    {
        id: 23,
        slug: "chiffon-printed-fabric-rose-3m",
        name: "Chiffon Printed Fabric - Rose Motif (3m)",
        category: "Fabrics",
        subcategory: "Printed",
        brand: "Print Studio",
        description: "Delicate chiffon fabric with beautiful rose motif prints. Perfect for dupattas, sarees, or flowy dresses. 3 meters length with elegant drape.",
        price: 749,
        originalPrice: 1099,
        discountPercentage: 32,
        currency: "₹",
        availableSizes: ["Free Size"],
        fitType: "Regular",
        weight: 280,
        length: 300,
        width: 110,
        height: 2,
        material: "Chiffon",
        averageRating: 3.8,
        ratingCount: 31,
        popularityScore: 430,
        reviews: generateMockReviews(23, 3),
        stockQuantity: 65,
        inStock: true,
        isNewArrival: true,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/3738087/pexels-photo-3738087.jpeg"
        ]
    },

    // ==================== KIDS (24-28) ====================
    {
        id: 24,
        slug: "girls-lehenga-choli-pink-printed",
        name: "Girls Printed Lehenga Choli - Pink",
        category: "Kids",
        subcategory: "Girls Ethnic",
        brand: "Little Festive",
        description: "Adorable pink lehenga choli set for girls. Perfect for festivals, weddings, and birthday parties. Comfortable fabric with beautiful print design.",
        price: 1299,
        originalPrice: 1899,
        discountPercentage: 31,
        currency: "₹",
        availableSizes: ["S", "M", "L"],
        fitType: "Regular",
        weight: 520,
        length: 65,
        width: 35,
        height: 5,
        material: "Poly Cotton",
        averageRating: 4.4,
        ratingCount: 73,
        popularityScore: 780,
        reviews: generateMockReviews(24, 4),
        stockQuantity: 33,
        inStock: true,
        isNewArrival: true,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/6311574/pexels-photo-6311574.jpeg"
        ]
    },
    {
        id: 25,
        slug: "boys-kurta-pajama-yellow",
        name: "Boys Kurta Pajama Set - Yellow",
        category: "Kids",
        subcategory: "Boys Ethnic",
        brand: "Tiny Traditions",
        description: "Bright yellow kurta pajama set for boys. Perfect for festive occasions and family functions. Soft cotton fabric for all-day comfort.",
        price: 999,
        originalPrice: 1499,
        discountPercentage: 33,
        currency: "₹",
        availableSizes: ["S", "M", "L"],
        fitType: "Regular",
        weight: 460,
        length: 60,
        width: 32,
        height: 4,
        material: "Cotton",
        averageRating: 4.2,
        ratingCount: 51,
        popularityScore: 650,
        reviews: generateMockReviews(25, 3),
        stockQuantity: 41,
        inStock: true,
        isNewArrival: false,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/6311573/pexels-photo-6311573.jpeg"
        ]
    },
    {
        id: 26,
        slug: "kids-anarkali-dress-mint",
        name: "Kids Anarkali Dress - Mint Embroidered",
        category: "Kids",
        subcategory: "Girls Ethnic",
        brand: "Sparkle Kids",
        description: "Beautiful mint Anarkali dress with delicate embroidery for little girls. Perfect for parties and special occasions. Features flared silhouette.",
        price: 1599,
        originalPrice: 2199,
        discountPercentage: 27,
        currency: "₹",
        availableSizes: ["S", "M", "L"],
        fitType: "Flared",
        weight: 540,
        length: 70,
        width: 34,
        height: 5,
        material: "Net & Silk Blend",
        averageRating: 4.6,
        ratingCount: 69,
        popularityScore: 830,
        reviews: generateMockReviews(26, 4),
        stockQuantity: 24,
        inStock: true,
        isNewArrival: true,
        isFeatured: true,
        images: [
            "https://images.pexels.com/photos/6311575/pexels-photo-6311575.jpeg"
        ]
    },
    {
        id: 27,
        slug: "kids-kurta-dhoti-orange",
        name: "Kids Kurta Dhoti Set - Orange",
        category: "Kids",
        subcategory: "Boys Ethnic",
        brand: "Little Prince",
        description: "Traditional kurta dhoti set in vibrant orange for boys. Perfect for pujas, festivals, and cultural events. Easy to wear dhoti style bottom.",
        price: 1199,
        originalPrice: 1699,
        discountPercentage: 29,
        currency: "₹",
        availableSizes: ["S", "M", "L"],
        fitType: "Regular",
        weight: 480,
        length: 58,
        width: 31,
        height: 4,
        material: "Cotton Blend",
        averageRating: 4.0,
        ratingCount: 38,
        popularityScore: 600,
        reviews: generateMockReviews(27, 3),
        stockQuantity: 29,
        inStock: true,
        isNewArrival: false,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/6311578/pexels-photo-6311578.jpeg"
        ]
    },
    {
        id: 28,
        slug: "kids-festive-jacket-set-blue",
        name: "Kids Festive Jacket Set - Blue",
        category: "Kids",
        subcategory: "Unisex Ethnic",
        brand: "Mini Monarch",
        description: "Stylish festive jacket set in royal blue for kids. Includes kurta and Nehru jacket. Perfect for weddings and formal occasions.",
        price: 1799,
        originalPrice: 2499,
        discountPercentage: 28,
        currency: "₹",
        availableSizes: ["S", "M", "L"],
        fitType: "Regular",
        weight: 560,
        length: 62,
        width: 33,
        height: 5,
        material: "Silk Blend",
        averageRating: 3.9,
        ratingCount: 27,
        popularityScore: 520,
        reviews: generateMockReviews(28, 3),
        stockQuantity: 21,
        inStock: true,
        isNewArrival: false,
        isFeatured: false,
        images: [
            "https://images.pexels.com/photos/6311581/pexels-photo-6311581.jpeg"
        ]
    }
];

// Helper function to get product by ID
export const getProductById = (id: number): Product | undefined => {
    return products.find(p => p.id === id);
};

// Helper function to get product by slug
export const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
};

// Helper function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
};

// Helper function to get featured products
export const getFeaturedProducts = (): Product[] => {
    return products.filter(p => p.isFeatured);
};

// Helper function to get new arrivals
export const getNewArrivals = (): Product[] => {
    return products.filter(p => p.isNewArrival);
};

// Helper function to search products
export const searchProducts = (query: string): Product[] => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return products;

    return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.subcategory.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.material.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
    );
};

// Get unique materials from all products
export const getAllMaterials = (): string[] => {
    const materials = new Set(products.map(p => p.material));
    return Array.from(materials).sort();
};

// Get price range from all products
export const getPriceRange = (): [number, number] => {
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
};

// Get unique brands
export const getAllBrands = (): string[] => {
    const brands = new Set(products.map(p => p.brand));
    return Array.from(brands).sort();
};

export default products;
