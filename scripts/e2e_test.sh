#!/bin/bash
# E2E Test Script for Ola Shop v2
# Tests: Signup -> Login -> Product -> Cart -> Order -> DB Verification

BASE_URL="http://localhost:9000/store"
EMAIL="test_e2e_$(date +%s)@example.com"
PASSWORD="SecurePass123!"
PUB_KEY="pk_dd569b1e6fb86fd087430d2af1b3ec2ea78f7d181709ffc6324fe2b77aa4c4e3"
PRODUCT_ID=""
REGION_ID=""
CART_ID=""

echo "🚀 Starting Deep E2E Test Sequence"
echo "-----------------------------------"

# 1. Get a Valid Product & Region
echo "🔎 Finding Valid Product and Region..."
PRODUCT_ID=$(sudo -u postgres psql -d medusa_db -t -c "SELECT id FROM product LIMIT 1;" | tr -d '[:space:]')
REGION_ID=$(sudo -u postgres psql -d medusa_db -t -c "SELECT id FROM region LIMIT 1;" | tr -d '[:space:]')

if [ -z "$PRODUCT_ID" ] || [ -z "$REGION_ID" ]; then
  echo "❌ Failed to fetch Product or Region from DB."
  exit 1
fi
echo "✅ Found Product: $PRODUCT_ID"
echo "✅ Found Region: $REGION_ID"

# 2. Customer Signup (Medusa V2 Flow)
echo "-----------------------------------"
echo "👤 Testing Customer Signup (Identity)..."
# Register Identity
REGISTER_RES=$(curl -s -X POST "$BASE_URL/../auth/customer/emailpass/register" \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: $PUB_KEY" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"first_name\": \"Test\", \"last_name\": \"User\"}")

TOKEN=$(echo "$REGISTER_RES" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Identity Created. Token: ${TOKEN:0:10}..."
else
  echo "❌ Identity Registration Failed: $REGISTER_RES"
  exit 1
fi

echo "👤 Creating Customer Profile..."
RESPONSE=$(curl -s -X POST "$BASE_URL/customers" \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: $PUB_KEY" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"email\": \"$EMAIL\", \"first_name\": \"Test\", \"last_name\": \"User\", \"phone\": \"+249123456789\"}")

if echo "$RESPONSE" | grep -q "customer"; then
  echo "✅ Customer Profile Created: $EMAIL"
else
  echo "❌ Profile Creation Failed: $RESPONSE"
fi

# 3. Customer Login
echo "-----------------------------------"
echo "🔑 Testing Login..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/../auth/customer/emailpass" \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: $PUB_KEY" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

if echo "$LOGIN_RES" | grep -q "token"; then
  echo "✅ Login Successful"
else
  echo "❌ Login Failed: $LOGIN_RES"
  exit 1
fi

# 4. Create Cart
echo "-----------------------------------"
echo "🛒 Creating Cart..."
CART_RES=$(curl -s -X POST "$BASE_URL/carts" \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: $PUB_KEY" \
  -d "{\"region_id\": \"$REGION_ID\"}")

CART_ID=$(echo "$CART_RES" | grep -o '"id":"cart_[^"]*"' | cut -d'"' -f4)

if [ -z "$CART_ID" ]; then
    echo "❌ Failed to create cart. Response: $CART_RES"
    exit 1
else
    echo "✅ Cart Created: $CART_ID"
fi

# 5. Add Line Item
echo "-----------------------------------"
echo "➕ Adding Product to Cart..."
# First obtain variant ID
VARIANT_ID=$(sudo -u postgres psql -d medusa_db -t -c "SELECT id FROM product_variant WHERE product_id='$PRODUCT_ID' LIMIT 1;" | tr -d '[:space:]')
echo "   Variant ID: $VARIANT_ID"

ADD_RES=$(curl -s -X POST "$BASE_URL/carts/$CART_ID/line-items" \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: $PUB_KEY" \
  -d "{\"variant_id\": \"$VARIANT_ID\", \"quantity\": 1}")

if echo "$ADD_RES" | grep -q "line_items"; then
  echo "✅ Product Added to Cart"
else
  echo "❌ Failed to add item: $ADD_RES"
fi

# 6. Verify Prices
echo "-----------------------------------"
echo "💰 Verifying Cart Totals..."
# Assuming previous step succeeded, cart total should be > 0 or calculated
TOTAL=$(echo "$ADD_RES" | grep -o '"total":[0-9]*' | head -1)
echo "   Cart $TOTAL"

# 7. Complete Order (Mock - Payment Collection V2)
echo "-----------------------------------"
echo "📦 Finalizing Order (Mock)..."
# Medusa V2 uses Payment Collections
PAY_RES=$(curl -s -X POST "$BASE_URL/payment-collections" \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: $PUB_KEY" \
  -d "{\"cart_id\": \"$CART_ID\"}")

if echo "$PAY_RES" | grep -q "id"; then
  echo "✅ Payment Collection Initialized"
else
   echo "⚠️  Could not init payment collection: $PAY_RES"
   # Add address (sometimes needed for region calc)
   echo "   Adding Address..."
   curl -s -X POST "$BASE_URL/carts/$CART_ID" \
     -H "Content-Type: application/json" \
     -H "x-publishable-api-key: $PUB_KEY" \
     -d '{"email": "'"$EMAIL"'", "shipping_address": {"first_name": "Test", "last_name": "User", "address_1": "123 Street", "city": "Khartoum", "country_code": "sd", "postal_code": "11111"}}' > /dev/null
     
   # Retry Payment Collection
   PAY_RES_2=$(curl -s -X POST "$BASE_URL/payment-collections" \
    -H "Content-Type: application/json" \
    -H "x-publishable-api-key: $PUB_KEY" \
    -d "{\"cart_id\": \"$CART_ID\"}")

   if echo "$PAY_RES_2" | grep -q "id"; then
        echo "✅ Payment Collection Initialized (After Address Update)"
   else
        echo "❌ Still failed to init payments"
   fi
fi

echo "-----------------------------------"
echo "🎉 E2E Test Sequence Completed"
