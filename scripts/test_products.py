import requests

BACKEND = 'http://46.224.43.113:9000'
KEY = 'pk_dd569b1e6fb86fd087430d2af1b3ec2ea78f7d181709ffc6324fe2b77aa4c4e3'

print("Fetching products from Medusa...")
r = requests.get(f'{BACKEND}/store/products?limit=10', headers={'x-publishable-api-key': KEY})

if r.status_code == 200:
    data = r.json()
    products = data.get('products', [])
    print(f"\nTotal products: {len(products)}\n")
    
    for p in products[:5]:
        title = p.get('title', 'N/A')
        metadata = p.get('metadata', {})
        category = metadata.get('category', 'MISSING')
        featured = metadata.get('featured', 'MISSING')
        
        print(f"Product: {title}")
        print(f"  Category: {category}")
        print(f"  Featured: {featured}")
        print()
else:
    print(f"❌ Error: {r.status_code}")
    print(r.text)
