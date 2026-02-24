#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upload AI-generated product images to Medusa v2 and assign to products
"""

import requests
import os
import glob
from pathlib import Path

# Configuration
MEDUSA_URL = "http://46.224.43.113:9000"
ADMIN_EMAIL = "admin@ola-shop.com"
ADMIN_PASSWORD = "Abc996050@"

# Image directory (where AI generated images are)
IMAGE_DIR = r"C:\Users\hp\.gemini\antigravity\brain\ed206807-b59b-4a4c-8735-c968fb52c000"

# Product keyword to image mapping
PRODUCT_IMAGE_MAP = {
    # Cosmetics
    'serum': 'cosmetics_serum_product',
    'lipstick': 'cosmetics_lipstick_product',
    'eyeshadow': 'cosmetics_eyeshadow_product',
    'foundation': 'cosmetics_foundation_product',
    'mascara': 'cosmetics_foundation_product',
    'blush': 'cosmetics_lipstick_product',
    'moisturizer': 'cosmetics_serum_product',
    'gloss': 'cosmetics_lipstick_product',
    'eyeliner': 'cosmetics_eyeshadow_product',
    'brush': 'cosmetics_eyeshadow_product',
    'cream': 'cosmetics_serum_product',
    'scrub': 'cosmetics_serum_product',
    'butter': 'cosmetics_serum_product',
    
    # Perfumes
    'oud': 'perfume_oud_product',
    'musk': 'perfume_musk_product',
    'jasmine': 'perfume_jasmine_product',
    'amber': 'perfume_amber_product',
    'lavender': 'perfume_jasmine_product',
    'citrus': 'perfume_jasmine_product',
    'vanilla': 'perfume_musk_product',
    'sandalwood': 'perfume_oud_product',
    'floral': 'perfume_jasmine_product',
    'breeze': 'perfume_jasmine_product',
    'perfume': 'perfume_oud_product',
    'fragrance': 'perfume_musk_product',
    
    # Fashion
    'hijab': 'fashion_hijab_product',
    'abaya': 'fashion_abaya_product',
    'dress': 'fashion_dress_product',
    'tunic': 'fashion_tunic_product',
    'cardigan': 'fashion_tunic_product',
    'pants': 'fashion_tunic_product',
    'kimono': 'fashion_abaya_product',
    'skirt': 'fashion_dress_product',
    'swimwear': 'fashion_dress_product',
    'prayer': 'fashion_abaya_product',
    'scarf': 'fashion_hijab_product',
    
    # Accessories
    'necklace': 'accessories_necklace_product',
    'bracelet': 'accessories_bracelet_product',
    'earrings': 'accessories_earrings_product',
    'handbag': 'accessories_handbag_product',
    'sunglasses': 'accessories_handbag_product',
    'watch': 'accessories_bracelet_product',
    'ring': 'accessories_necklace_product',
    'brooch': 'accessories_earrings_product',
    'anklet': 'accessories_bracelet_product',
    'clutch': 'accessories_handbag_product',
    'jewelry': 'accessories_necklace_product',
    
    # Sudanese
    'henna': 'sudanese_henna_product',
    'dukhan': 'sudanese_dukhan_product',
    'bakhoor': 'sudanese_bakhoor_product',
    'karkar': 'sudanese_karkar_product',
    'toob': 'fashion_abaya_product',
    'frankincense': 'sudanese_bakhoor_product',
    'myrrh': 'sudanese_bakhoor_product',
    'dilka': 'sudanese_henna_product',
}

def login():
    """Login to Medusa and get auth token"""
    print("Logging in to Medusa...")
    response = requests.post(
        f"{MEDUSA_URL}/admin/auth",
        json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
    )
    
    if response.status_code == 200:
        token = response.json()['user']['api_token']
        print("[OK] Login successful!")
        return token
    else:
        print(f"[ERROR] Login failed: {response.status_code}")
        print(response.text)
        return None

def get_products(token):
    """Fetch all products from Medusa"""
    print("\nFetching products...")
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(
        f"{MEDUSA_URL}/admin/products?limit=100",
        headers=headers
    )
    
    if response.status_code == 200:
        products = response.json()['products']
        print(f"[OK] Found {len(products)} products")
        return products
    else:
        print(f"[ERROR] Failed to fetch products: {response.status_code}")
        return []

def find_image_file(image_name):
    """Find the generated image file"""
    pattern = f"{IMAGE_DIR}\\{image_name}_*.png"
    files = glob.glob(pattern)
    if files:
        return files[0]
    return None

def upload_image(token, image_path):
    """Upload image to Medusa"""
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    with open(image_path, 'rb') as f:
        files = {'files': f}
        response = requests.post(
            f"{MEDUSA_URL}/admin/uploads",
            headers=headers,
            files=files
        )
    
    if response.status_code == 200:
        uploads = response.json()['uploads']
        if uploads:
            return uploads[0]['url']
    return None

def update_product_image(token, product_id, image_url):
    """Update product with image"""
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(
        f"{MEDUSA_URL}/admin/products/{product_id}",
        headers=headers,
        json={
            'thumbnail': image_url,
            'images': [{'url': image_url}]
        }
    )
    
    return response.status_code == 200

def get_image_for_product(product_title):
    """Determine which image to use for a product"""
    title_lower = product_title.lower()
    
    for keyword, image_name in PRODUCT_IMAGE_MAP.items():
        if keyword in title_lower:
            return image_name
    
    # Default to serum if no match
    return 'cosmetics_serum_product'

def main():
    print("=" * 60)
    print("AI Product Image Uploader for Medusa v2")
    print("=" * 60)
    
    # Login
    token = login()
    if not token:
        return
    
    # Get products
    products = get_products(token)
    if not products:
        return
    
    # Process each product
    print("\n" + "=" * 60)
    print("Processing Products...")
    print("=" * 60)
    
    uploaded_images = {}  # Cache uploaded images
    success_count = 0
    skip_count = 0
    
    for i, product in enumerate(products, 1):
        product_id = product['id']
        product_title = product['title']
        
        print(f"\n[{i}/{len(products)}] {product_title}")
        
        # Skip if product already has image
        if product.get('thumbnail'):
            print(f"  [SKIP] Already has image")
            skip_count += 1
            continue
        
        # Determine which image to use
        image_name = get_image_for_product(product_title)
        print(f"  [IMAGE] {image_name}")
        
        # Check if we've already uploaded this image
        if image_name in uploaded_images:
            image_url = uploaded_images[image_name]
            print(f"  [CACHE] Using cached upload")
        else:
            # Find image file
            image_path = find_image_file(image_name)
            if not image_path:
                print(f"  [ERROR] Image file not found: {image_name}")
                continue
            
            # Upload image
            print(f"  [UPLOAD] Uploading image...")
            image_url = upload_image(token, image_path)
            if not image_url:
                print(f"  [ERROR] Failed to upload image")
                continue
            
            # Cache the uploaded image URL
            uploaded_images[image_name] = image_url
            print(f"  [OK] Uploaded: {image_url}")
        
        # Update product
        print(f"  [UPDATE] Updating product...")
        if update_product_image(token, product_id, image_url):
            print(f"  [OK] Product updated successfully!")
            success_count += 1
        else:
            print(f"  [ERROR] Failed to update product")
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total products: {len(products)}")
    print(f"[OK] Updated: {success_count}")
    print(f"[SKIP] Already had images: {skip_count}")
    print(f"[ERROR] Failed: {len(products) - success_count - skip_count}")
    print(f"[INFO] Unique images uploaded: {len(uploaded_images)}")
    print("\n[OK] Done! Refresh your storefront to see the images!")

if __name__ == "__main__":
    main()
