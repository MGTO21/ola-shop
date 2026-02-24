import { model } from "@medusajs/framework/utils"

export const WhatsAppIdentity = model.define("whatsapp_identity", {
    id: model.id().primaryKey(),
    phone_number: model.text().unique(),
    name: model.text().nullable(), // For initial signup
    otp_hash: model.text().nullable(),
    otp_expires_at: model.dateTime().nullable(),
    is_verified: model.boolean().default(false),
    signup_step: model.enum(["initiated", "otp_sent", "verified", "profile_completed"]).default("initiated"),
    customer_id: model.text().nullable(), // Logical link to Medusa Customer
    metadata: model.json().nullable(),
})
