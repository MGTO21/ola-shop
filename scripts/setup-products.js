const axios = require('axios');

const BACKEND_URL = 'http://46.224.43.113:9000';

// Sample products for each category
const products = {
    cosmetics: [
        { title: 'Luxury Face Serum', price: 2500, description: 'Premium anti-aging serum with natural ingredients' },
        { title: 'Matte Lipstick Set', price: 1500, description: 'Long-lasting matte lipstick in 5 shades' },
        { title: 'Eyeshadow Palette', price: 1800, description: '12-color professional eyeshadow palette' },
        { title: 'Foundation Cream', price: 2200, description: 'Full coverage foundation for all skin types' },
        { title: 'Mascara Waterproof', price: 800, description: 'Volumizing waterproof mascara' },
        { title: 'Blush Powder', price: 900, description: 'Natural glow blush powder' },
        { title: 'Makeup Brush Set', price: 1200, description: 'Professional 10-piece brush set' },
        { title: 'Face Moisturizer', price: 1600, description: 'Hydrating daily moisturizer' },
        { title: 'Lip Gloss', price: 600, description: 'Shiny lip gloss with vitamin E' },
        { title: 'Eyeliner Pencil', price: 500, description: 'Waterproof eyeliner pencil' }
    ],
    perfumes: [
        { title: 'Rose Oud Perfume', price: 3500, description: 'Luxurious rose and oud fragrance' },
        { title: 'Musk Perfume Oil', price: 2800, description: 'Pure musk perfume oil' },
        { title: 'Jasmine Night', price: 3200, description: 'Elegant jasmine evening perfume' },
        { title: 'Amber Gold', price: 4000, description: 'Rich amber and gold scent' },
        { title: 'Lavender Dreams', price: 2500, description: 'Calming lavender fragrance' },
        { title: 'Citrus Fresh', price: 2200, description: 'Refreshing citrus perfume' },
        { title: 'Vanilla Essence', price: 2600, description: 'Sweet vanilla perfume' },
        { title: 'Sandalwood Mist', price: 3800, description: 'Woody sandalwood fragrance' },
        { title: 'Floral Bouquet', price: 2900, description: 'Mixed floral perfume' },
        { title: 'Ocean Breeze', price: 2400, description: 'Fresh ocean scent' }
    ],
    fashion: [
        { title: 'Silk Hijab', price: 1200, description: 'Premium silk hijab in multiple colors' },
        { title: 'Abaya Dress', price: 4500, description: 'Elegant embroidered abaya' },
        { title: 'Cotton Tunic', price: 1800, description: 'Comfortable cotton tunic' },
        { title: 'Maxi Dress', price: 3200, description: 'Flowing maxi dress' },
        { title: 'Cardigan Sweater', price: 2200, description: 'Soft knit cardigan' },
        { title: 'Wide Leg Pants', price: 1900, description: 'Trendy wide leg pants' },
        { title: 'Kimono Jacket', price: 2800, description: 'Stylish kimono jacket' },
        { title: 'Pleated Skirt', price: 1600, description: 'Elegant pleated skirt' },
        { title: 'Modest Swimwear', price: 3500, description: 'Full coverage swimwear' },
        { title: 'Prayer Dress', price: 2500, description: 'Comfortable prayer dress' }
    ],
    accessories: [
        { title: 'Gold Necklace', price: 5500, description: '18K gold plated necklace' },
        { title: 'Silver Bracelet', price: 2200, description: 'Sterling silver bracelet' },
        { title: 'Pearl Earrings', price: 1800, description: 'Elegant pearl earrings' },
        { title: 'Designer Handbag', price: 6500, description: 'Luxury leather handbag' },
        { title: 'Sunglasses', price: 1500, description: 'UV protection sunglasses' },
        { title: 'Wristwatch', price: 4200, description: 'Elegant ladies watch' },
        { title: 'Hair Accessories Set', price: 800, description: 'Beautiful hair clips and bands' },
        { title: 'Scarf Ring', price: 600, description: 'Decorative scarf ring' },
        { title: 'Brooch Pin', price: 900, description: 'Elegant brooch pin' },
        { title: 'Anklet', price: 1200, description: 'Delicate gold anklet' }
    ],
    sudanese: [
        { title: 'Sudanese Henna', price: 500, description: 'Natural Sudanese henna powder' },
        { title: 'Dukhan Set', price: 1800, description: 'Traditional dukhan incense set' },
        { title: 'Dilka Scrub', price: 800, description: 'Natural body scrub' },
        { title: 'Karkar Oil', price: 1200, description: 'Traditional hair oil' },
        { title: 'Toob Fabric', price: 2500, description: 'Authentic Sudanese toob' },
        { title: 'Bakhoor Incense', price: 900, description: 'Premium bakhoor' },
        { title: 'Shea Butter', price: 700, description: 'Pure Sudanese shea butter' },
        { title: 'Frankincense', price: 1100, description: 'Natural frankincense' },
        { title: 'Myrrh Resin', price: 1000, description: 'Pure myrrh resin' },
        { title: 'Traditional Jewelry', price: 3500, description: 'Handmade Sudanese jewelry' }
    ]
};

async function setupStore() {
    try {
        console.log('🚀 Starting store setup...\n');

        // Step 1: Get publishable API key
        console.log('📋 Step 1: Getting publishable API key...');
        const keysResponse = await axios.get(`${BACKEND_URL}/admin/publishable-api-keys`, {
            headers: {
                'Authorization': 'Bearer your-admin-token-here'
            }
        }).catch(() => ({ data: { publishable_api_keys: [] } }));

        let publishableKey = keysResponse.data.publishable_api_keys?.[0]?.id;

        if (!publishableKey) {
            console.log('⚠️  No publishable key found. Using default sales channel...');
            publishableKey = 'pk_default';
        } else {
            console.log(`✅ Found publishable key: ${publishableKey}\n`);
        }

        // Step 2: Create products for each category
        console.log('📦 Step 2: Creating products...\n');

        for (const [category, items] of Object.entries(products)) {
            console.log(`\n📁 Creating ${category} products...`);

            for (let i = 0; i < items.length; i++) {
                const product = items[i];
                try {
                    const response = await axios.post(`${BACKEND_URL}/store/products`, {
                        title: product.title,
                        description: product.description,
                        handle: `${category}-${product.title.toLowerCase().replace(/\s+/g, '-')}`,
                        status: 'published',
                        is_giftcard: false,
                        discountable: true,
                        options: [
                            {
                                title: 'Default',
                                values: ['Default']
                            }
                        ],
                        variants: [
                            {
                                title: 'Default Variant',
                                prices: [
                                    {
                                        amount: product.price * 100, // Convert to cents
                                        currency_code: 'sdg'
                                    }
                                ],
                                options: [
                                    {
                                        value: 'Default'
                                    }
                                ],
                                inventory_quantity: 100,
                                manage_inventory: true
                            }
                        ],
                        categories: [
                            {
                                name: category,
                                handle: category
                            }
                        ],
                        metadata: {
                            category: category,
                            featured: i < 4 // First 4 products are featured
                        }
                    }, {
                        headers: {
                            'x-publishable-api-key': publishableKey
                        }
                    });

                    console.log(`  ✅ Created: ${product.title}`);
                } catch (error) {
                    console.log(`  ⚠️  Failed to create ${product.title}: ${error.response?.data?.message || error.message}`);
                }
            }
        }

        console.log('\n\n🎉 Store setup complete!');
        console.log(`\n📝 Add this to your .env.local file:`);
        console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableKey}`);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

setupStore();
