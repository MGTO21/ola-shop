#!/bin/bash
# Login
echo "Logging in..."
TOKEN=$(curl -s -X POST http://localhost:9000/admin/auth -H "Content-Type: application/json" -d '{"email":"debug_admin@ola-shop.com","password":"Abc996050@"}' | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login Failed"
  exit 1
fi
echo "Got Token (Length: ${#TOKEN})"

# Create Group if missing (safety)
curl -s -X POST http://localhost:9000/admin/customer-groups \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"name":"Unverified","id":"cusgroup_unverified"}' > /dev/null

# Loop and Add
echo "Fetching IDs and Adding to Group..."
sudo -u postgres psql -d medusa_db -t -c "SELECT id FROM customer" | while read -r id ; do
    id=$(echo $id | xargs) # trim whitespace
    if [ ! -z "$id" ]; then
        echo -n "Adding $id: "
        curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:9000/admin/customer-groups/cusgroup_unverified/customers/batch \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"customer_ids\":[{\"id\":\"$id\"}]}"
    fi
done
echo "Done."
