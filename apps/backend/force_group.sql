INSERT INTO customer_group (id, name, created_at, updated_at)
VALUES ('cusgroup_unverified', 'Unverified', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO customer_group_customer (customer_group_id, customer_id, created_at, updated_at)
SELECT 'cusgroup_unverified', id, NOW(), NOW() FROM customer
ON CONFLICT DO NOTHING;
