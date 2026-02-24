import { model } from "@medusajs/framework/utils"

export const LoyaltyTransaction = model.define("loyalty_transaction", {
    id: model.id().primaryKey(),
    customer_id: model.text(),
    points: model.number(),
    reason: model.text(),
    metadata: model.json().nullable(),
})
