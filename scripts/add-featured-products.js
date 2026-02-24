const axios = require('axios');

const BACKEND_URL = 'http://46.224.43.113:9000';
const ADMIN_EMAIL = 'admin@ola-shop.com';
const ADMIN_PASSWORD = 'Abc996050@';

// Get authentication token
async function getAuthToken() {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/user/emailpass`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        return response.data.token;
    } catch (error) {
        console.error('❌ Authentication failed:', error.message);
        throw error;
    }
}

// Sample products for each category with all required fields
const productsByCategory = {
    cosmetics: [
        { title: 'Luxury Anti-Aging Serum', description: 'Premium anti-aging serum with hyaluronic acid and vitamin C. Reduces fine lines and wrinkles.', price: 2500, weight: 50 },
        { title: 'Matte Lipstick Collection', description: 'Long-lasting matte lipstick set in 5 stunning shades. Waterproof and smudge-proof.', price: 1500, weight: 30 },
        { title: 'Professional Eyeshadow Palette', description: '12-color eyeshadow palette with shimmer and matte finishes. Highly pigmented.', price: 1800, weight: 100 },
        { title: 'Full Coverage Foundation', description: 'Flawless full coverage foundation for all skin types. SPF 15 protection.', price: 2200, weight: 40 },
        { title: 'Volumizing Waterproof Mascara', description: 'Dramatic volume and length mascara. Waterproof formula lasts all day.', price: 800, weight: 15 },
        { title: 'Natural Glow Blush Powder', description: 'Silky blush powder for a natural, healthy glow. Buildable coverage.', price: 900, weight: 20 },
        { title: 'Professional Makeup Brush Set', description: '10-piece professional makeup brush set with synthetic bristles.', price: 1200, weight: 200 },
        { title: 'Hydrating Face Moisturizer', description: 'Daily hydrating moisturizer with SPF 30. Suitable for all skin types.', price: 1600, weight: 50 },
        { title: 'Vitamin E Lip Gloss', description: 'Shiny lip gloss enriched with vitamin E. Non-sticky formula.', price: 600, weight: 10 },
        { title: 'Waterproof Eyeliner Pencil', description: 'Long-lasting waterproof eyeliner pencil. Smooth application.', price: 500, weight: 5 }
    ],
    perfumes: [
        { title: 'Rose Oud Luxury Perfume', description: 'Exquisite blend of Bulgarian rose and Arabian oud. Long-lasting fragrance.', price: 3500, weight: 100 },
        { title: 'Pure Musk Perfume Oil', description: 'Concentrated musk perfume oil. Alcohol-free, long-lasting scent.', price: 2800, weight: 30 },
        { title: 'Jasmine Night Eau de Parfum', description: 'Elegant jasmine evening perfume with woody base notes.', price: 3200, weight: 75 },
        { title: 'Amber Gold Fragrance', description: 'Rich amber and gold scent with oriental notes. Perfect for special occasions.', price: 4000, weight: 100 },
        { title: 'Lavender Dreams Perfume', description: 'Calming lavender fragrance with hints of vanilla. Relaxing scent.', price: 2500, weight: 50 },
        { title: 'Citrus Fresh Eau de Toilette', description: 'Refreshing citrus perfume with bergamot and lemon notes.', price: 2200, weight: 50 },
        { title: 'Vanilla Essence Perfume', description: 'Sweet vanilla perfume with caramel undertones. Warm and inviting.', price: 2600, weight: 75 },
        { title: 'Sandalwood Mist', description: 'Woody sandalwood fragrance with earthy notes. Unisex scent.', price: 3800, weight: 100 },
        { title: 'Floral Bouquet Perfume', description: 'Mixed floral perfume with rose, lily, and peony. Romantic scent.', price: 2900, weight: 75 },
        { title: 'Ocean Breeze Eau de Parfum', description: 'Fresh ocean scent with aquatic and marine notes.', price: 2400, weight: 50 }
    ],
    fashion: [
        { title: 'Premium Silk Hijab', description: 'Luxurious silk hijab in multiple colors. Soft and breathable fabric.', price: 1200, weight: 50 },
        { title: 'Elegant Embroidered Abaya', description: 'Beautiful embroidered abaya with intricate details. Modest and stylish.', price: 4500, weight: 500 },
        { title: 'Comfortable Cotton Tunic', description: 'Soft cotton tunic perfect for everyday wear. Loose and comfortable fit.', price: 1800, weight: 300 },
        { title: 'Flowing Maxi Dress', description: 'Elegant flowing maxi dress for special occasions. Modest design.', price: 3200, weight: 400 },
        { title: 'Soft Knit Cardigan', description: 'Cozy knit cardigan perfect for layering. Warm and stylish.', price: 2200, weight: 350 },
        { title: 'Trendy Wide Leg Pants', description: 'Modern wide leg pants with elastic waist. Comfortable and fashionable.', price: 1900, weight: 300 },
        { title: 'Stylish Kimono Jacket', description: 'Lightweight kimono jacket with beautiful patterns. Versatile piece.', price: 2800, weight: 250 },
        { title: 'Elegant Pleated Skirt', description: 'Flowy pleated skirt perfect for any occasion. Modest length.', price: 1600, weight: 200 },
        { title: 'Modest Full Coverage Swimwear', description: 'Full coverage swimwear with UV protection. Comfortable and modest.', price: 3500, weight: 300 },
        { title: 'Comfortable Prayer Dress', description: 'Easy-to-wear prayer dress with hood. Soft and breathable fabric.', price: 2500, weight: 400 }
    ],
    accessories: [
        { title: '18K Gold Plated Necklace', description: 'Elegant 18K gold plated necklace with pendant. Tarnish-resistant.', price: 5500, weight: 50 },
        { title: 'Sterling Silver Bracelet', description: 'Beautiful sterling silver bracelet with delicate design.', price: 2200, weight: 30 },
        { title: 'Elegant Pearl Earrings', description: 'Classic pearl earrings perfect for any occasion. Hypoallergenic.', price: 1800, weight: 10 },
        { title: 'Designer Leather Handbag', description: 'Luxury leather handbag with multiple compartments. Durable and stylish.', price: 6500, weight: 800 },
        { title: 'UV Protection Sunglasses', description: 'Stylish sunglasses with 100% UV protection. Polarized lenses.', price: 1500, weight: 50 },
        { title: 'Elegant Ladies Wristwatch', description: 'Beautiful ladies watch with leather strap. Water-resistant.', price: 4200, weight: 100 },
        { title: 'Hair Accessories Set', description: 'Beautiful hair clips, bands, and pins set. Perfect for styling.', price: 800, weight: 100 },
        { title: 'Decorative Scarf Ring', description: 'Elegant scarf ring with crystal details. Holds hijab securely.', price: 600, weight: 20 },
        { title: 'Elegant Brooch Pin', description: 'Beautiful brooch pin with rhinestone details. Versatile accessory.', price: 900, weight: 15 },
        { title: 'Delicate Gold Anklet', description: 'Dainty gold anklet with adjustable chain. Elegant and feminine.', price: 1200, weight: 10 }
    ],
    sudanese: [
        { title: 'Natural Sudanese Henna Powder', description: 'Pure natural henna powder from Sudan. Creates beautiful designs.', price: 500, weight: 100 },
        { title: 'Traditional Dukhan Incense Set', description: 'Complete dukhan set with acacia wood and accessories. Traditional beauty ritual.', price: 1800, weight: 500 },
        { title: 'Natural Dilka Body Scrub', description: 'Traditional Sudanese body scrub for smooth skin. Natural ingredients.', price: 800, weight: 200 },
        { title: 'Karkar Hair Growth Oil', description: 'Traditional Sudanese hair oil for growth and shine. Natural formula.', price: 1200, weight: 250 },
        { title: 'Authentic Sudanese Toob Fabric', description: 'Beautiful authentic Sudanese toob fabric. Traditional patterns.', price: 2500, weight: 400 },
        { title: 'Premium Bakhoor Incense', description: 'High-quality bakhoor incense with rich aroma. Long-lasting fragrance.', price: 900, weight: 100 },
        { title: 'Pure Sudanese Shea Butter', description: 'Unrefined shea butter from Sudan. Moisturizing and nourishing.', price: 700, weight: 250 },
        { title: 'Natural Frankincense Resin', description: 'Pure frankincense resin for burning. Traditional aromatic.', price: 1100, weight: 100 },
        { title: 'Pure Myrrh Resin', description: 'High-quality myrrh resin. Traditional aromatic and medicinal uses.', price: 1000, weight: 100 },
        { title: 'Handmade Sudanese Jewelry', description: 'Beautiful handmade traditional Sudanese jewelry. Unique designs.', price: 3500, weight: 150 }
    ]
};

async function addProducts() {
    console.log('🚀 Starting to add 50 featured products...\n');

    try {
        // Step 1: Authenticate
        console.log('🔐 Authenticating...');
        const token = await getAuthToken();
        console.log('✅ Authentication successful!\n');

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Step 2: Get or create stock location
        console.log('📍 Checking stock locations...');
        let stockLocation;
        try {
            const locResponse = await axios.get(`${BACKEND_URL}/admin/stock-locations`, { headers });
            stockLocation = locResponse.data.stock_locations?.[0];

            if (!stockLocation) {
                console.log('Creating default stock location...');
                const newLoc = await axios.post(`${BACKEND_URL}/admin/stock-locations`, {
                    name: 'Port Sudan Main Warehouse'
                }, { headers });
                stockLocation = newLoc.data.stock_location;
            }
            console.log(`✅ Using stock location: ${stockLocation.name}\n`);
        } catch (error) {
            console.error('⚠️  Could not setup stock location:', error.message);
        }

        // Step 3: Get or create categories
        console.log('📁 Setting up categories...');
        const categoryMap = {};

        for (const categoryHandle of Object.keys(productsByCategory)) {
            try {
                // Try to find existing category
                const catResponse = await axios.get(
                    `${BACKEND_URL}/admin/product-categories?handle=${categoryHandle}`,
                    { headers }
                );

                let category = catResponse.data.product_categories?.[0];

                if (!category) {
                    // Create category if it doesn't exist
                    const categoryNames = {
                        cosmetics: { name: 'Cosmetics', nameAr: 'مستحضرات تجميل' },
                        perfumes: { name: 'Perfumes', nameAr: 'عطور' },
                        fashion: { name: 'Fashion', nameAr: 'أزياء' },
                        accessories: { name: 'Accessories', nameAr: 'إكسسوارات' },
                        sudanese: { name: 'Sudanese Products', nameAr: 'منتجات سودانية' }
                    };

                    const newCat = await axios.post(`${BACKEND_URL}/admin/product-categories`, {
                        name: categoryNames[categoryHandle].name,
                        handle: categoryHandle,
                        is_active: true,
                        metadata: {
                            nameAr: categoryNames[categoryHandle].nameAr
                        }
                    }, { headers });

                    category = newCat.data.product_category;
                    console.log(`  ✅ Created category: ${category.name}`);
                } else {
                    console.log(`  ✅ Found category: ${category.name}`);
                }

                categoryMap[categoryHandle] = category.id;
            } catch (error) {
                console.error(`  ⚠️  Error with category ${categoryHandle}:`, error.message);
            }
        }

        console.log('\n📦 Adding products...\n');

        let successCount = 0;
        let failCount = 0;

        // Step 4: Add products for each category
        for (const [categoryHandle, products] of Object.entries(productsByCategory)) {
            console.log(`\n📁 Adding ${categoryHandle} products...`);

            for (let i = 0; i < products.length; i++) {
                const product = products[i];

                try {
                    // Create product
                    const productData = {
                        title: product.title,
                        description: product.description,
                        handle: `${categoryHandle}-${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                        status: 'published',
                        is_giftcard: false,
                        discountable: true,
                        weight: product.weight,
                        metadata: {
                            featured: true,
                            category: categoryHandle
                        },
                        categories: categoryMap[categoryHandle] ? [{ id: categoryMap[categoryHandle] }] : []
                    };

                    const productResponse = await axios.post(
                        `${BACKEND_URL}/admin/products`,
                        productData,
                        { headers }
                    );

                    const createdProduct = productResponse.data.product;

                    // Create variant with price
                    const variantData = {
                        title: 'Default',
                        manage_inventory: true,
                        prices: [
                            {
                                amount: product.price * 100, // Convert to cents
                                currency_code: 'sdg'
                            }
                        ]
                    };

                    await axios.post(
                        `${BACKEND_URL}/admin/products/${createdProduct.id}/variants`,
                        variantData,
                        { headers }
                    );

                    // Set initial stock if location exists
                    if (stockLocation && createdProduct.variants?.[0]) {
                        const variant = createdProduct.variants[0];
                        if (variant.inventory_items?.[0]) {
                            const invItemId = variant.inventory_items[0].inventory_item_id;

                            try {
                                await axios.post(
                                    `${BACKEND_URL}/admin/inventory-items/${invItemId}/location-levels`,
                                    {
                                        location_id: stockLocation.id,
                                        stocked_quantity: 100
                                    },
                                    { headers }
                                );
                            } catch (stockError) {
                                // Stock level might already exist, try update
                                try {
                                    await axios.post(
                                        `${BACKEND_URL}/admin/inventory-items/${invItemId}/location-levels/${stockLocation.id}`,
                                        { stocked_quantity: 100 },
                                        { headers }
                                    );
                                } catch (e) {
                                    console.log(`    ⚠️  Could not set stock for ${product.title}`);
                                }
                            }
                        }
                    }

                    console.log(`  ✅ ${i + 1}/10: ${product.title}`);
                    successCount++;

                } catch (error) {
                    console.log(`  ❌ Failed: ${product.title}`);
                    console.log(`     Error: ${error.response?.data?.message || error.message}`);
                    failCount++;
                }

                // Small delay to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        console.log('\n\n🎉 Product Addition Complete!');
        console.log(`✅ Successfully added: ${successCount} products`);
        console.log(`❌ Failed: ${failCount} products`);
        console.log(`\n📊 Total: ${successCount + failCount}/50 products processed`);

    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

// Run the script
addProducts();
