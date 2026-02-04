import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data
const mockProducts = [
    {
        id: '1',
        name_en: 'Royal Gadwal Silk Saree',
        name_te: 'గద్వాల్ సిల్క్ చీర',
        price: 9850,
        mrp: 12500,
        category: 'sarees',
        seller_name: 'Lakshmi Weavers',
        average_rating: 4.8,
        total_reviews: 156,
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'],
        variants: [{ id: 'v1', size: 'Free Size', stock_available: 5, is_available: true }],
    },
    {
        id: '2',
        name_en: 'White Chikankari Kurta',
        name_te: 'చికంకారి కుర్తా',
        price: 3850,
        mrp: 4500,
        category: 'kurtas',
        seller_name: 'Lucknowi Crafts',
        average_rating: 4.6,
        total_reviews: 98,
        images: ['https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=600'],
        variants: [{ id: 'v2', size: 'M', stock_available: 10, is_available: true }, { id: 'v3', size: 'L', stock_available: 8, is_available: true }],
    },
    {
        id: '3',
        name_en: 'Pastel Organza Lehenga',
        name_te: 'ఆర్గపట్టు లెహంగా',
        price: 12850,
        mrp: 18000,
        category: 'lehengas',
        seller_name: 'Bridal Boutique',
        average_rating: 4.9,
        total_reviews: 45,
        images: ['https://images.unsplash.com/photo-1632766329767-f3d2f97c8386?q=80&w=600'],
        variants: [{ id: 'v4', size: 'Free Size', stock_available: 2, is_available: true }],
    },
    {
        id: '4',
        name_en: 'Mens Ivory Kurta Set',
        name_te: 'పురుషుల కుర్తా సెట్',
        price: 4200,
        mrp: 5500,
        category: 'mens',
        seller_name: 'Ethnic Man',
        average_rating: 4.7,
        total_reviews: 78,
        images: ['https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?q=80&w=600'],
        variants: [{ id: 'v5', size: 'L', stock_available: 15, is_available: true }, { id: 'v6', size: 'XL', stock_available: 10, is_available: true }],
    },
    {
        id: '5',
        name_en: 'Banarasi Silk Fabric (Per Meter)',
        name_te: 'బెనారస్ సిల్క్ ఫాబ్రిక్',
        price: 850,
        mrp: 1200,
        category: 'fabrics',
        seller_name: 'Weavers Hub',
        average_rating: 4.5,
        total_reviews: 67,
        images: ['https://images.unsplash.com/photo-1621255877395-849547d21825?q=80&w=600'],
        variants: [{ id: 'v7', size: 'Meter', stock_available: 100, is_available: true }],
    },
    {
        id: '6',
        name_en: 'Kids Pattu Pavadai',
        name_te: 'పిల్లల పట్టు పావడ',
        price: 2450,
        mrp: 3200,
        category: 'kids',
        seller_name: 'Little Stars',
        average_rating: 4.8,
        total_reviews: 210,
        images: ['https://m.media-amazon.com/images/I/61FKajl2nEL._AC_UY1100_.jpg'],
        variants: [{ id: 'v8', size: '4-5Y', stock_available: 12, is_available: true }],
    },
    {
        id: '7',
        name_en: 'Kanjeevaram Silk Saree',
        name_te: 'కాంచీపురం పట్టు చీర',
        price: 15500,
        mrp: 18000,
        category: 'sarees',
        seller_name: 'South India Silks',
        average_rating: 4.9,
        total_reviews: 89,
        images: ['https://images.unsplash.com/photo-1610030469668-965d05a5771f?q=80&w=600'],
        variants: [{ id: 'v9', size: 'Free Size', stock_available: 3, is_available: true }],
    },
    {
        id: '8',
        name_en: 'Cotton Printed Kurti',
        name_te: 'కాటన్ కుర్తీ',
        price: 1250,
        mrp: 1999,
        category: 'kurtas',
        seller_name: 'Jaipur Prints',
        average_rating: 4.3,
        total_reviews: 340,
        images: ['https://images.unsplash.com/photo-1632766329767-f3d2f97c8386?q=80&w=600'],
        variants: [{ id: 'v10', size: 'M', stock_available: 25, is_available: true }],
    }
];

// Mock In-Memory Database
const users = [
    {
        id: 'user-123',
        email: 'test@test.com',
        fullName: 'Test User',
        phoneNumber: '9876543210',
        userType: 'customer'
    }
];

let addresses = [
    {
        id: 'addr-1',
        user_id: 'user-123',
        full_name: 'Test User',
        phone_number: '9876543210',
        address_line1: 'Flat 101, Test Appt',
        address_line2: 'Jubilee Hills',
        landmark: 'Near Temple',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        is_default: true
    }
];

// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Hyderabad Clothing API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// API Routes

// Products
app.get('/api/v1/products', (req, res) => {
    const { category, search, page = 1, limit = 20 } = req.query;
    let filtered = mockProducts;

    // Filter by Category
    if (category) {
        filtered = filtered.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    // Filter by Search Term
    if (search) {
        const searchTerm = String(search).toLowerCase();
        filtered = filtered.filter(p =>
            p.name_en.toLowerCase().includes(searchTerm) ||
            p.name_te.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedResults = filtered.slice(startIndex, endIndex);

    res.json({
        success: true,
        data: {
            products: paginatedResults,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: filtered.length,
                totalPages: Math.ceil(filtered.length / Number(limit)),
            },
        },
    });
});

// Product by ID
app.get('/api/v1/products/:id', (req, res) => {
    const product = mockProducts.find(p => p.id === req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    res.json({
        success: true,
        data: product,
    });
});

// Size recommendation
app.get('/api/v1/products/:id/size-recommendation', (req, res) => {
    const { height, weight } = req.query;

    let recommendedSize = 'M';
    let confidence = 0.7;

    if (height && weight) {
        const heightNum = Number(height);
        const weightNum = Number(weight);
        const bmi = weightNum / ((heightNum / 100) ** 2);

        if (bmi < 18.5) recommendedSize = 'S';
        else if (bmi < 25) recommendedSize = 'M';
        else if (bmi < 30) recommendedSize = 'L';
        else recommendedSize = 'XL';

        confidence = 0.85;
    }

    res.json({
        success: true,
        data: {
            recommendedSize,
            confidence,
            message: `Based on your measurements, we recommend size ${recommendedSize}`,
            alternativeSizes: [recommendedSize],
        },
    });
});

// Auth - Register (mock)
app.post('/api/v1/auth/register', (req, res) => {
    const { email, phoneNumber, password, fullName, userType } = req.body;

    if (!email || !phoneNumber || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: {
                id: 'user-' + Date.now(),
                email,
                phoneNumber,
                fullName,
                userType: userType || 'customer',
                preferredLanguage: 'en',
            },
            token: 'mock-jwt-token-' + Date.now(),
        },
    });
});

// Auth - Login (mock)
app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password',
        });
    }

    const user = users.find(u => u.email === email) || users[0];

    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                userType: 'customer',
                preferredLanguage: 'en',
            },
            token: 'mock-jwt-token-' + Date.now(),
        },
    });
});

// Customer - Get Profile (mock)
app.get('/api/v1/customer/profile', (req, res) => {
    // In a real app we would get ID from token
    const user = users[0];

    res.json({
        success: true,
        data: {
            ...user,
            total_orders: 5,
            total_spent: 2500
        }
    });
});

// Customer - Update Profile (mock)
app.put('/api/v1/customer/profile', (req, res) => {
    const { fullName, phoneNumber } = req.body;

    // Update mock user
    if (fullName) users[0].fullName = fullName;
    if (phoneNumber) users[0].phoneNumber = phoneNumber;

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: users[0]
    });
});

// Customer - Get Addresses (mock)
app.get('/api/v1/customer/addresses', (req, res) => {
    res.json({
        success: true,
        data: addresses
    });
});

// Customer - Add Address (mock)
app.post('/api/v1/customer/addresses', (req, res) => {
    const newAddress = {
        id: 'addr-' + Date.now(),
        user_id: 'user-123',
        ...req.body,
        is_default: req.body.isDefault || false
    };

    if (newAddress.is_default) {
        addresses.forEach(a => a.is_default = false);
    }

    addresses.push(newAddress);

    res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: newAddress
    });
});


// Mock Cart
let cart = {
    items: [],
    subtotal: 0
};

// Customer - Get Cart (mock)
app.get('/api/v1/customer/cart', (req, res) => {
    // Recalculate subtotal
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);

    res.json({
        success: true,
        data: cart
    });
});

// Customer - Add to Cart (mock)
app.post('/api/v1/customer/cart/add', (req, res) => {
    const { productId, variantId, quantity } = req.body;

    // Find product details
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) {
        return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    const cartItem = {
        id: 'item-' + Date.now(),
        product_id: product.id,
        variant_id: variant.id,
        product_name: product.name_en,
        size: variant.size,
        price: product.price,
        quantity: quantity || 1,
        images: product.images,
        total: product.price * (quantity || 1)
    };

    cart.items.push(cartItem);
    cart.subtotal += cartItem.total;

    res.json({
        success: true,
        message: 'Added to cart',
        data: cart
    });
});

// Customer - Remove from Cart (mock)
app.delete('/api/v1/customer/cart/:id', (req, res) => {
    cart.items = cart.items.filter(item => item.id !== req.params.id);
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);

    res.json({
        success: true,
        message: 'Item removed',
        data: cart
    });
});

// Customer - Empty Cart (mock - helper for checkout)
app.delete('/api/v1/customer/cart', (req, res) => {
    cart.items = [];
    cart.subtotal = 0;
    res.json({ success: true, message: 'Cart cleared' });
});

// Customer - Update Address (mock)
app.put('/api/v1/customer/addresses/:id', (req, res) => {
    const index = addresses.findIndex(a => a.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const updatedAddress = {
        ...addresses[index],
        ...req.body,
        is_default: req.body.isDefault !== undefined ? req.body.isDefault : addresses[index].is_default
    };

    if (updatedAddress.is_default) {
        addresses.forEach(a => {
            if (a.id !== updatedAddress.id) a.is_default = false;
        });
    }

    addresses[index] = updatedAddress;

    res.json({
        success: true,
        message: 'Address updated',
        data: updatedAddress
    });
});

// Customer - Delete Address (mock)
app.delete('/api/v1/customer/addresses/:id', (req, res) => {
    addresses = addresses.filter(a => a.id !== req.params.id);
    res.json({
        success: true,
        message: 'Address deleted'
    });
});

// Orders - Create (mock)
app.post('/api/v1/orders', (req, res) => {
    const { items, deliveryAddressId, paymentMethod, totalAmount } = req.body;

    if ((!items || items.length === 0) || !deliveryAddressId || !paymentMethod) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    // Process items - stock deduction simulation would happen here

    // Clear cart (simulation)
    cart = { items: [] };

    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
            id: 'order-' + Date.now().toString(36) + Math.random().toString(36).substr(2),
            items,
            totalAmount,
            status: 'Pending',
            createdAt: new Date()
        }
    });
});

// Orders - Get (mock)
app.get('/api/v1/orders', (req, res) => {
    res.json({
        success: true,
        data: {
            orders: [
                {
                    id: 'order-1',
                    order_number: 'HYD1234567890',
                    product_name: 'Cotton Kurta',
                    total_amount: 649,
                    status: 'delivered',
                    created_at: '2026-01-01T10:00:00Z',
                },
            ],
            pagination: {
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            },
        },
    });
});

// Error handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🛍️  Hyderabad Clothing E-Commerce Platform API             ║
║                                                                ║
║   Server running on: http://localhost:${PORT}                    ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                    ║
║   API Version: v1                                              ║
║                                                                ║
║   Mock Mode: All responses are demo data                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});
