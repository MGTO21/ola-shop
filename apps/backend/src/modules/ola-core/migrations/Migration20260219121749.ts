import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260219121749 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "whatsapp_identity" drop constraint if exists "whatsapp_identity_phone_number_unique";`);
    this.addSql(`create table if not exists "customer_activity" ("id" text not null, "customer_id" text not null, "type" text check ("type" in ('view_product', 'add_to_cart', 'view_page', 'search')) not null, "resource_id" text null, "resource_name" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_activity_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_activity_deleted_at" ON "customer_activity" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "delivery_zone" ("id" text not null, "country_code" text not null, "city_name" text not null, "fee_amount" integer not null default 0, "currency_code" text not null default 'sdg', "is_coming_soon" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "delivery_zone_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_delivery_zone_deleted_at" ON "delivery_zone" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "loyalty_transaction" ("id" text not null, "customer_id" text not null, "points" integer not null, "reason" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "loyalty_transaction_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_loyalty_transaction_deleted_at" ON "loyalty_transaction" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "whatsapp_identity" ("id" text not null, "phone_number" text not null, "name" text null, "otp_hash" text null, "otp_expires_at" timestamptz null, "is_verified" boolean not null default false, "signup_step" text check ("signup_step" in ('initiated', 'otp_sent', 'verified', 'profile_completed')) not null default 'initiated', "customer_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "whatsapp_identity_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_whatsapp_identity_phone_number_unique" ON "whatsapp_identity" ("phone_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_whatsapp_identity_deleted_at" ON "whatsapp_identity" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer_activity" cascade;`);

    this.addSql(`drop table if exists "delivery_zone" cascade;`);

    this.addSql(`drop table if exists "loyalty_transaction" cascade;`);

    this.addSql(`drop table if exists "whatsapp_identity" cascade;`);
  }

}
