# 📦 Product Fields Required for Medusa v2 & Good Card Display

## ✅ Essential Fields for Product Creation

### 1. **Basic Information** (Required)
```javascript
{
    title: string,              // Product name (e.g., "Luxury Face Serum")
    description: string,        // Detailed description for SEO and display
    handle: string,             // URL-friendly slug (auto-generated from title)
    status: 'published' | 'draft',  // Product visibility
}
```

### 2. **Pricing** (Required)
```javascript
{
    prices: [{
        amount: number,         // Price in cents (e.g., 2500 SDG = 250000)
        currency_code: 'sdg'    // Currency (SDG for Sudanese Pound)
    }]
}
```

### 3. **Inventory** (Required for Stock Management)
```javascript
{
    manage_inventory: boolean,  // Enable inventory tracking
    weight: number,             // Product weight in grams
}
```

### 4. **Categorization** (Recommended)
```javascript
{
    categories: [{
        id: string              // Category ID from Medusa
    }]
}
```

### 5. **Metadata** (For Custom Features)
```javascript
{
    metadata: {
        featured: boolean,      // Show in featured sections
        category: string,       // Category handle for filtering
        brand: string,          // Brand name (optional)
        nameAr: string,         // Arabic name (optional)
        descriptionAr: string   // Arabic description (optional)
    }
}
```

### 6. **Images** (Highly Recommended)
```javascript
{
    thumbnail: string,          // Main product image URL
    images: [{
        url: string             // Additional product images
    }]
}
```

---

## 🎨 Fields for Beautiful Card Display

### Minimum Required for Good Display:
1. ✅ **title** - Product name
2. ✅ **description** - Short description (first 100 chars shown)
3. ✅ **price** - At least one price
4. ✅ **thumbnail** or **images[0]** - Product image
5. ✅ **status** - Must be 'published'

### Enhanced Display (Recommended):
6. ✅ **metadata.featured** - Show in featured sections
7. ✅ **metadata.brand** - Brand badge on card
8. ✅ **weight** - For shipping calculations
9. ✅ **categories** - For filtering and navigation
10. ✅ **inventory_quantity** - Stock availability

---

## 📋 Complete Product Object Example

```javascript
{
    // Basic Info
    title: "Luxury Anti-Aging Serum",
    description: "Premium anti-aging serum with hyaluronic acid and vitamin C. Reduces fine lines and wrinkles for youthful skin.",
    handle: "cosmetics-luxury-anti-aging-serum",
    status: "published",
    
    // Flags
    is_giftcard: false,
    discountable: true,
    
    // Physical Properties
    weight: 50,  // grams
    length: 10,  // cm (optional)
    height: 15,  // cm (optional)
    width: 5,    // cm (optional)
    
    // Categorization
    categories: [
        { id: "pcat_01XXXXX" }  // Cosmetics category
    ],
    
    // Custom Data
    metadata: {
        featured: true,
        category: "cosmetics",
        brand: "Ola Beauty",
        nameAr: "سيروم مضاد للشيخوخة الفاخر",
        descriptionAr: "سيروم مضاد للشيخوخة الفاخر مع حمض الهيالورونيك وفيتامين سي"
    },
    
    // Variant (created separately)
    variants: [{
        title: "Default",
        manage_inventory: true,
        prices: [{
            amount: 250000,  // 2500 SDG in cents
            currency_code: "sdg"
        }],
        inventory_quantity: 100
    }],
    
    // Images (uploaded separately)
    thumbnail: "https://example.com/serum.jpg",
    images: [
        { url: "https://example.com/serum-1.jpg" },
        { url: "https://example.com/serum-2.jpg" }
    ]
}
```

---

## 🏪 Warehouse App - Product Addition Form

### Required Form Fields:

#### **Basic Information Tab**
- [ ] Product Name (English) *
- [ ] Product Name (Arabic)
- [ ] Description (English) *
- [ ] Description (Arabic)
- [ ] Category * (dropdown)
- [ ] Brand (optional)

#### **Pricing Tab**
- [ ] Price (SDG) *
- [ ] Original Price (for discounts)
- [ ] Currency (default: SDG)

#### **Inventory Tab**
- [ ] Initial Stock Quantity *
- [ ] Weight (grams) *
- [ ] Manage Inventory (checkbox, default: true)
- [ ] Stock Location * (dropdown)

#### **Images Tab**
- [ ] Main Image * (upload)
- [ ] Additional Images (upload multiple)
- [ ] Image Alt Text

#### **Settings Tab**
- [ ] Status * (Published/Draft)
- [ ] Featured Product (checkbox)
- [ ] Allow Discounts (checkbox, default: true)
- [ ] Is Gift Card (checkbox, default: false)

---

## 🔧 Warehouse App Implementation

### Add Product Function Structure:

```javascript
async function addProduct(formData) {
    const token = await getAuthToken();
    
    // 1. Create Product
    const productData = {
        title: formData.titleEn,
        description: formData.descriptionEn,
        handle: generateHandle(formData.titleEn),
        status: formData.status,
        is_giftcard: formData.isGiftCard,
        discountable: formData.allowDiscounts,
        weight: formData.weight,
        metadata: {
            featured: formData.featured,
            category: formData.category,
            brand: formData.brand,
            nameAr: formData.titleAr,
            descriptionAr: formData.descriptionAr
        },
        categories: [{ id: formData.categoryId }]
    };
    
    const product = await apiCall('/admin/products', 'POST', productData);
    
    // 2. Create Variant with Price
    const variantData = {
        title: 'Default',
        manage_inventory: true,
        prices: [{
            amount: formData.price * 100,
            currency_code: 'sdg'
        }]
    };
    
    await apiCall(`/admin/products/${product.id}/variants`, 'POST', variantData);
    
    // 3. Set Initial Stock
    const variant = product.variants[0];
    const invItemId = variant.inventory_items[0].inventory_item_id;
    
    await apiCall(
        `/admin/inventory-items/${invItemId}/location-levels`,
        'POST',
        {
            location_id: formData.stockLocationId,
            stocked_quantity: formData.initialStock
        }
    );
    
    // 4. Upload Images (if provided)
    if (formData.images.length > 0) {
        for (const image of formData.images) {
            const formData = new FormData();
            formData.append('files', image);
            
            await apiCall(
                `/admin/products/${product.id}/images`,
                'POST',
                formData
            );
        }
    }
    
    return product;
}
```

---

## 📊 Field Validation Rules

### Title
- Min length: 3 characters
- Max length: 255 characters
- Required: Yes

### Description
- Min length: 10 characters
- Max length: 5000 characters
- Required: Yes

### Price
- Min value: 1 (SDG)
- Max value: 999999999
- Format: Number (converted to cents)
- Required: Yes

### Weight
- Min value: 1 (gram)
- Max value: 999999
- Format: Number
- Required: Yes

### Stock Quantity
- Min value: 0
- Max value: 999999
- Format: Integer
- Required: Yes

### Images
- Max file size: 5MB per image
- Allowed formats: JPG, PNG, WebP
- Max images: 10
- Required: At least 1 image recommended

---

## 🎯 Categories Setup

### Required Categories:
1. **Cosmetics** (handle: `cosmetics`)
   - Arabic: مستحضرات تجميل
   
2. **Perfumes** (handle: `perfumes`)
   - Arabic: عطور
   
3. **Fashion** (handle: `fashion`)
   - Arabic: أزياء
   
4. **Accessories** (handle: `accessories`)
   - Arabic: إكسسوارات
   
5. **Sudanese Products** (handle: `sudanese`)
   - Arabic: منتجات سودانية

---

## 🚀 Quick Start

### Run the Product Addition Script:

```powershell
cd c:\Users\hp\.gemini\antigravity\scratch\ola-shop-v2
node add-featured-products.js
```

This will add 50 featured products (10 per category) with all required fields!

---

**Created**: December 12, 2025  
**Purpose**: Guide for adding products to Medusa v2  
**Compatibility**: Warehouse App & Storefront
