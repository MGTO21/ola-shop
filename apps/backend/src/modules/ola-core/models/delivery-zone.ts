import { model } from "@medusajs/framework/utils"

export const DeliveryZone = model.define("delivery_zone", {
    id: model.id().primaryKey(),
    country_code: model.text(), // "sd", "eg", "sa"
    city_name: model.text(), // "Khartoum", "Port Sudan"
    fee_amount: model.number().default(0),
    currency_code: model.text().default("sdg"),
    is_coming_soon: model.boolean().default(false),
    metadata: model.json().nullable(),
})
