# 🔧 Fix: Products Missing Metadata

## Problem:
Products don't have `metadata.category` and `metadata.featured` fields, so they can't be grouped and displayed in hero sections.

## Solution:
Re-run the product addition script on VPS to add products with proper metadata.

## SSH to VPS and run:

```bash
ssh root@46.224.43.113
cd /root/ola-shop-v2
python3 add_50_products.py
```

OR create a new script that updates existing products with metadata.

## Quick Fix Script:

Create `fix_product_metadata.py` on VPS:

```python
import requests

BACKEND = 'http://localhost:9000'
EMAIL = 'admin@ola-shop.com'
PASSWORD = 'Abc996050@'

# Login
r = requests.post(f'{BACKEND}/auth/user/emailpass', json={'email': EMAIL, 'password': PASSWORD})
token = r.json()['token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Get all products
r = requests.get(f'{BACKEND}/admin/products?limit=100', headers=headers)
products = r.json().get('products', [])

print(f'Found {len(products)} products')

# Update each product with metadata
categories = ['cosmetics', 'perfumes', 'fashion', 'accessories', 'sudanese']
for i, product in enumerate(products):
    category = categories[i % 5]  # Distribute across categories
    
    update_data = {
        'metadata': {
            'category': category,
            'featured': True
        }
    }
    
    r = requests.post(f'{BACKEND}/admin/products/{product["id"]}', json=update_data, headers=headers)
    if r.status_code == 200:
        print(f'✓ Updated: {product["title"]} -> {category}')
    else:
        print(f'✗ Failed: {product["title"]}')

print('\nDone! Refresh browser to see products.')
```

Run on VPS:
```bash
python3 fix_product_metadata.py
```
