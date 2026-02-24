# Hero Sections & Banners Management Guide

## 📍 Configuration File Location

**Path:** `apps/storefront/public/config/hero-sections.json`

This file controls:
- 5 Category Hero Sections (hero1-hero5)
- 3 Promotional Banners (top, middle, bottom)

---

## 🎨 Home Page Layout

```
┌─────────────────────────────────────┐
│  Main Hero Section                  │ ← Original Hero
├─────────────────────────────────────┤
│  Top Promotional Banner             │ ← Editable from warehouse
├─────────────────────────────────────┤
│  Categories Overview                │
├─────────────────────────────────────┤
│  Hero Section 1: Cosmetics          │
│  ├─ Poster (top half)               │ ← hero1 poster
│  └─ Featured Products (bottom)      │ ← Auto-fetched
├─────────────────────────────────────┤
│  Hero Section 2: Perfumes           │
│  ├─ Poster (top half)               │ ← hero2 poster
│  └─ Featured Products (bottom)      │
├─────────────────────────────────────┤
│  Hero Section 3: Fashion            │
│  ├─ Poster (top half)               │ ← hero3 poster
│  └─ Featured Products (bottom)      │
├─────────────────────────────────────┤
│  Hero Section 4: Accessories        │
│  ├─ Poster (top half)               │ ← hero4 poster
│  └─ Featured Products (bottom)      │
├─────────────────────────────────────┤
│  Hero Section 5: Sudanese Products  │
│  ├─ Poster (top half)               │ ← hero5 poster
│  └─ Featured Products (bottom)      │
├─────────────────────────────────────┤
│  TikTok Video Section               │
├─────────────────────────────────────┤
│  General Featured Products          │
├─────────────────────────────────────┤
│  Mobile App Download                │
└─────────────────────────────────────┘
```

---

## 🖼️ Poster Management from Warehouse

### Hero Posters (5 sections)
Upload images to: `apps/storefront/public/posters/`

**Required Images:**
1. `hero1-cosmetics.jpg` - Cosmetics section poster
2. `hero2-perfumes.jpg` - Perfumes section poster
3. `hero3-fashion.jpg` - Fashion section poster
4. `hero4-accessories.jpg` - Accessories section poster
5. `hero5-sudanese.jpg` - Sudanese products poster

**Recommended Size:** 1920x800px (2.4:1 ratio)

### Promotional Banners (3 positions)
**Required Images:**
1. `top-banner.jpg` - Top promotional banner
2. `middle-banner.jpg` - Middle promotional banner (between sections)
3. `bottom-banner.jpg` - Bottom promotional banner

**Recommended Size:** 1920x400px (4.8:1 ratio)

---

## ⚙️ Editable Settings per Hero Section

```json
{
  "id": "hero1",
  "category": "cosmetics",
  "categoryName": "مستحضرات تجميل",
  "categoryNameEn": "Cosmetics",
  "posterImage": "/posters/hero1-cosmetics.jpg",
  "posterTitle": "أحدث مستحضرات التجميل",
  "posterTitleEn": "Latest Cosmetics",
  "posterSubtitle": "جمال طبيعي وأصيل",
  "posterSubtitleEn": "Natural & Authentic Beauty",
  "enabled": true,
  "showFeaturedProducts": true,
  "backgroundColor": "#FFF0F5",
  "order": 1
}
```

### Editable Fields:
- ✅ **posterImage** - Path to poster image
- ✅ **posterTitle** - Main title (Arabic)
- ✅ **posterTitleEn** - Main title (English)
- ✅ **posterSubtitle** - Subtitle (Arabic)
- ✅ **posterSubtitleEn** - Subtitle (English)
- ✅ **enabled** - Show/hide section
- ✅ **showFeaturedProducts** - Show/hide products
- ✅ **backgroundColor** - Section background color
- ✅ **order** - Display order (1-5)

---

## 🔄 How Products are Fetched

### Automatic Filtering
Each hero section automatically shows:
- Products from its category
- Marked as "featured" in Medusa
- Maximum 4 products per section
- Sorted by newest/most popular

### Example:
```
Hero Section 1 (Cosmetics)
  ↓
Fetches products where:
  - category = "cosmetics"
  - featured = true
  - limit = 4
```

---

## 🎯 Warehouse App Integration

### Poster Upload Section
```
┌─────────────────────────────────────┐
│  Poster Management                  │
├─────────────────────────────────────┤
│                                     │
│  Hero Posters                       │
│  ├─ Hero 1 (Cosmetics)              │
│  │   [Upload Image] [Preview]       │
│  ├─ Hero 2 (Perfumes)               │
│  │   [Upload Image] [Preview]       │
│  ├─ Hero 3 (Fashion)                │
│  │   [Upload Image] [Preview]       │
│  ├─ Hero 4 (Accessories)            │
│  │   [Upload Image] [Preview]       │
│  └─ Hero 5 (Sudanese)               │
│      [Upload Image] [Preview]       │
│                                     │
│  Promotional Banners                │
│  ├─ Top Banner                      │
│  │   [Upload Image] [Preview]       │
│  ├─ Middle Banner                   │
│  │   [Upload Image] [Preview]       │
│  └─ Bottom Banner                   │
│      [Upload Image] [Preview]       │
│                                     │
│  [Save All Changes]                 │
└─────────────────────────────────────┘
```

### Text Content Editor
```
┌─────────────────────────────────────┐
│  Hero Section Content               │
├─────────────────────────────────────┤
│  Section: [Cosmetics ▼]             │
│                                     │
│  Title (Arabic):                    │
│  [أحدث مستحضرات التجميل]            │
│                                     │
│  Title (English):                   │
│  [Latest Cosmetics]                 │
│                                     │
│  Subtitle (Arabic):                 │
│  [جمال طبيعي وأصيل]                 │
│                                     │
│  Subtitle (English):                │
│  [Natural & Authentic Beauty]       │
│                                     │
│  Background Color:                  │
│  [#FFF0F5] 🎨                       │
│                                     │
│  ☑ Enable Section                  │
│  ☑ Show Featured Products          │
│                                     │
│  [Save Changes]                     │
└─────────────────────────────────────┘
```

---

## 📊 Benefits

✅ **5 Category Showcases** - Each category gets its own hero section
✅ **Auto Product Display** - Featured products auto-populate
✅ **Flexible Banners** - 3 promotional banner positions
✅ **Full Control** - Edit all posters from warehouse
✅ **Bilingual** - Arabic & English support
✅ **Easy Management** - Enable/disable any section
✅ **Custom Styling** - Control colors and layout

---

## 🚀 Next Steps

1. Create poster images (8 total: 5 heroes + 3 banners)
2. Upload to `/public/posters/` directory
3. Update `hero-sections.json` with image paths
4. Add poster upload UI to warehouse app
5. Test on storefront

---

**Created:** December 12, 2025  
**Components:** CategoryHeroSections, PromotionalBanners  
**Config:** hero-sections.json
