import requests

BACKEND = 'http://localhost:9000'
EMAIL = 'admin@ola-shop.com'
PASSWORD = 'Abc996050@'

# Login
print('Logging in...')
r = requests.post(f'{BACKEND}/auth/user/emailpass', json={'email': EMAIL, 'password': PASSWORD})
token = r.json()['token']
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Get all products
print('Fetching products...')
r = requests.get(f'{BACKEND}/admin/products?limit=100', headers=headers)
products = r.json().get('products', [])
print(f'Found {len(products)} products\n')

# Category mapping
product_categories = {
    'serum': 'cosmetics', 'lipstick': 'cosmetics', 'eyeshadow': 'cosmetics', 
    'foundation': 'cosmetics', 'mascara': 'cosmetics', 'blush': 'cosmetics',
    'brush': 'cosmetics', 'moisturizer': 'cosmetics', 'gloss': 'cosmetics',
    'eyeliner': 'cosmetics', 'cream': 'cosmetics', 'wrinkle': 'cosmetics',
    'bb': 'cosmetics', 'gel': 'cosmetics', 'spray': 'cosmetics',
    
    'oud': 'perfumes', 'musk': 'perfumes', 'jasmine': 'perfumes',
    'amber': 'perfumes', 'lavender': 'perfumes', 'citrus': 'perfumes',
    'vanilla': 'perfumes', 'sandalwood': 'perfumes', 'floral': 'perfumes',
    'ocean': 'perfumes', 'rose': 'perfumes', 'white': 'perfumes',
    'nights': 'perfumes', 'garden': 'perfumes', 'royale': 'perfumes',
    'splash': 'perfumes', 'midnight': 'perfumes', 'tahara': 'perfumes',
    
    'hijab': 'fashion', 'abaya': 'fashion', 'tunic': 'fashion',
    'dress': 'fashion', 'cardigan': 'fashion', 'pants': 'fashion',
    'kimono': 'fashion', 'skirt': 'fashion', 'swimwear': 'fashion',
    'prayer': 'fashion', 'chiffon': 'fashion', 'jersey': 'fashion',
    'linen': 'fashion', 'evening': 'fashion', 'wool': 'fashion',
    'palazzo': 'fashion', 'kaftan': 'fashion', 'satin': 'fashion',
    'scarf': 'fashion',
    
    'necklace': 'accessories', 'bracelet': 'accessories', 'earrings': 'accessories',
    'handbag': 'accessories', 'sunglasses': 'accessories', 'watch': 'accessories',
    'hair': 'accessories', 'ring': 'accessories', 'brooch': 'accessories',
    'anklet': 'accessories', 'clutch': 'accessories', 'wallet': 'accessories',
    'pins': 'accessories', 'gold': 'accessories', 'silver': 'accessories',
    'pearl': 'accessories', 'leather': 'accessories', 'statement': 'accessories',
    
    'henna': 'sudanese', 'dukhan': 'sudanese', 'dilka': 'sudanese',
    'karkar': 'sudanese', 'toob': 'sudanese', 'bakhoor': 'sudanese',
    'shea': 'sudanese', 'frankincense': 'sudanese', 'myrrh': 'sudanese',
    'traditional': 'sudanese', 'acacia': 'sudanese', 'coconut': 'sudanese',
    'embroidered': 'sudanese', 'black seed': 'sudanese', 'incense': 'sudanese',
    'sidr': 'sudanese'
}

# Update products
success = 0
for product in products:
    title_lower = product['title'].lower()
    
    # Determine category
    category = 'cosmetics'  # default
    for keyword, cat in product_categories.items():
        if keyword in title_lower:
            category = cat
            break
    
    # Update product metadata
    update_data = {
        'metadata': {
            'category': category,
            'featured': True
        }
    }
    
    r = requests.post(f'{BACKEND}/admin/products/{product["id"]}', json=update_data, headers=headers)
    if r.status_code == 200:
        print(f'✓ {product["title"]} -> {category}')
        success += 1
    else:
        print(f'✗ {product["title"]}: {r.status_code}')

print(f'\n🎉 Updated {success}/{len(products)} products!')
