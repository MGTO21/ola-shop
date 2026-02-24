import { model } from "@medusajs/framework/utils"

export const CustomerActivity = model.define("customer_activity", {
    id: model.id().primaryKey(),
    customer_id: model.text(),
    type: model.enum(["view_product", "add_to_cart", "view_page", "search"]),
    resource_id: model.text().nullable(), // e.g. Product ID
    resource_name: model.text().nullable(), // e.g. "iPhone 15"
    metadata: model.json().nullable(),
})
