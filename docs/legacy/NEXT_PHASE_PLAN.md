# 🚀 Next Phase Implementation Plan

## ✅ Current Status:
- Products showing in hero sections
- Horizontal scroll working
- 100 products in database
- Storefront live and functional

---

## 📋 Phase 1: Warehouse App Enhancements

### 1. **Inventory Management Tab** 🏪
**Purpose**: Track stock levels, manage inventory, stock alerts

**Features**:
- ✅ View all products with current stock levels
- ✅ Quick stock adjustment (add/remove quantities)
- ✅ Low stock alerts (configurable threshold)
- ✅ Stock history/audit log
- ✅ Bulk stock import (CSV/Excel)
- ✅ Stock location management
- ✅ Real-time sync with Medusa v2

**API Integration**:
```javascript
// Medusa v2 Inventory APIs
GET /admin/inventory-items
POST /admin/inventory-items/{id}/location-levels/{location_id}
GET /admin/inventory-items/{id}/location-levels
```

**UI Components**:
- Inventory table with filters
- Quick adjust modal
- Stock alerts sidebar
- Import/export buttons

---

### 2. **Accounting Tab** 💰
**Purpose**: Financial management, sales tracking, reports

**Features**:
- ✅ Sales dashboard (daily/weekly/monthly)
- ✅ Revenue tracking
- ✅ Expense management
- ✅ Profit/loss reports
- ✅ Invoice generation
- ✅ Payment tracking
- ✅ Tax calculations
- ✅ Export to Excel/PDF

**Data Sources**:
- Medusa orders API
- Custom accounting database table
- Payment gateway integrations

**UI Components**:
- Dashboard with charts (revenue, orders, profit)
- Expense entry form
- Reports generator
- Invoice templates

---

### 3. **Enhanced Products Tab** 📦
**Purpose**: Complete product management with easy data entry

**Current Features**:
- ✅ Add/Edit products
- ✅ Upload images
- ✅ Set prices
- ✅ Assign categories

**New Features to Add**:
- ✅ **Bulk product import** (CSV/Excel template)
- ✅ **Product variants** (size, color, etc.)
- ✅ **SEO fields** (meta title, description, keywords)
- ✅ **Product tags** for better organization
- ✅ **Discount management** (sale prices, coupons)
- ✅ **Product reviews** management
- ✅ **Related products** suggestions
- ✅ **Duplicate product** feature
- ✅ **Quick edit** inline editing
- ✅ **Advanced filters** (category, price range, stock status)

**Medusa v2 Integration**:
```javascript
// Product Management
POST /admin/products (create)
POST /admin/products/{id} (update)
DELETE /admin/products/{id} (delete)
POST /admin/uploads (image upload)

// Variants
POST /admin/products/{id}/variants
POST /admin/products/{id}/variants/{variant_id}

// Categories
GET /admin/product-categories
POST /admin/products/{id}/categories
```

---

## 📋 Phase 2: Storefront Enhancements

### 1. **Product Sorting Features** 🔄

**Sort Options**:
- ✅ Price: Low to High
- ✅ Price: High to Low
- ✅ Newest First
- ✅ Best Selling
- ✅ Most Reviewed
- ✅ A-Z / Z-A

**Implementation**:
```tsx
// Add to product listing pages
<select onChange={handleSort}>
  <option value="price_asc">Price: Low to High</option>
  <option value="price_desc">Price: High to Low</option>
  <option value="created_desc">Newest First</option>
  <option value="sales_desc">Best Selling</option>
</select>
```

**Locations**:
- Category pages
- Search results
- Featured products section
- All products page

---

### 2. **Hero Section Horizontal Scroll** ✅
**Status**: Already implemented!
- Each hero section scrolls horizontally
- 4 products per category
- RTL support for Arabic
- Scroll indicators

---

## 📋 Phase 3: Warehouse App - All Tabs Coordination

### **Tab Structure**:

```
┌─────────────────────────────────────────┐
│  Warehouse Management App               │
├─────────────────────────────────────────┤
│  📦 Products  │  🏪 Inventory  │  💰 Accounting  │
└─────────────────────────────────────────┘
```

### **1. Products Tab** 📦
**Columns**:
- Image thumbnail
- Product name
- SKU
- Category
- Price
- Stock (live from inventory)
- Status (published/draft)
- Actions (edit, duplicate, delete)

**Features**:
- Search by name/SKU
- Filter by category/status
- Sort by name/price/stock
- Bulk actions (delete, publish, export)
- Quick edit modal
- Image gallery view

---

### **2. Inventory Tab** 🏪
**Columns**:
- Product name
- SKU
- Current stock
- Location
- Reserved qty
- Available qty
- Low stock alert
- Actions (adjust, transfer, history)

**Features**:
- Stock adjustment modal
- Transfer between locations
- Stock alerts configuration
- Inventory audit log
- CSV import/export
- Barcode scanning (future)

---

### **3. Accounting Tab** 💰
**Sections**:

**A. Dashboard**:
- Total revenue (today/week/month)
- Total orders
- Average order value
- Profit margin
- Charts (line, bar, pie)

**B. Sales**:
- Order list with details
- Payment status
- Refunds/returns
- Export to Excel

**C. Expenses**:
- Add expense form
- Expense categories
- Expense list
- Monthly totals

**D. Reports**:
- Profit & Loss statement
- Sales by category
- Sales by product
- Tax reports
- Custom date ranges

---

## 🔧 Technical Implementation

### **Database Schema** (SQLite for Desktop App):

```sql
-- Products (synced from Medusa)
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  price REAL,
  category TEXT,
  stock INTEGER,
  images TEXT, -- JSON array
  medusa_id TEXT UNIQUE,
  last_synced DATETIME
);

-- Inventory
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY,
  product_id TEXT,
  location TEXT,
  quantity INTEGER,
  reserved INTEGER,
  last_updated DATETIME,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Expenses
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY,
  date DATE,
  category TEXT,
  amount REAL,
  description TEXT,
  receipt_image TEXT,
  created_at DATETIME
);

-- Sales (synced from Medusa orders)
CREATE TABLE sales (
  id INTEGER PRIMARY KEY,
  order_id TEXT UNIQUE,
  customer_name TEXT,
  total REAL,
  payment_status TEXT,
  order_date DATETIME,
  medusa_order_id TEXT
);
```

---

### **Medusa v2 API Integration**:

```javascript
// Products
const syncProducts = async () => {
  const response = await fetch('http://46.224.43.113:9000/admin/products', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const { products } = await response.json()
  // Save to local SQLite
  products.forEach(p => saveToLocalDB(p))
}

// Inventory
const updateStock = async (productId, locationId, quantity) => {
  await fetch(`http://46.224.43.113:9000/admin/inventory-items/${productId}/location-levels/${locationId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ stocked_quantity: quantity })
  })
}

// Orders (for accounting)
const syncOrders = async () => {
  const response = await fetch('http://46.224.43.113:9000/admin/orders', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const { orders } = await response.json()
  // Calculate totals and save
}
```

---

## 📅 Implementation Timeline

### **Week 1**: Inventory Tab
- Day 1-2: Database schema & API integration
- Day 3-4: UI components (table, modals)
- Day 5: Stock adjustment features
- Day 6-7: Testing & refinement

### **Week 2**: Accounting Tab
- Day 1-2: Dashboard & charts
- Day 3-4: Sales tracking
- Day 5: Expense management
- Day 6-7: Reports & export

### **Week 3**: Enhanced Products Tab
- Day 1-2: Bulk import/export
- Day 3-4: Variants & SEO
- Day 5: Advanced filters
- Day 6-7: Polish & testing

### **Week 4**: Storefront Sorting
- Day 1-2: Sort functionality
- Day 3-4: Filter UI
- Day 5-7: Testing & deployment

---

## 🎯 Priority Order

1. **✅ DONE**: Hero sections horizontal scroll
2. **HIGH**: Inventory Tab (most requested)
3. **HIGH**: Enhanced Products Tab (bulk import)
4. **MEDIUM**: Accounting Tab (dashboard)
5. **MEDIUM**: Storefront sorting
6. **LOW**: Advanced accounting features

---

## 📝 Next Steps

**Immediate Actions**:
1. ✅ Confirm hero sections are working
2. Start Inventory Tab development
3. Design database schema
4. Create UI mockups
5. Implement Medusa v2 API calls

**Questions for You**:
1. Which tab should we start with first? (Inventory or Products enhancement?)
2. Do you need multi-location inventory support?
3. What currency for accounting? (SDG?)
4. Any specific reports needed for accounting?

---

**Ready to start implementation!** 🚀

Which feature should we tackle first?
