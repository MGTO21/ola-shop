import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const customerService: any = req.scope.resolve("customerService");
    const manager: any = req.scope.resolve("manager");

    const { whatsapp_number, source } = req.body as any;

    if (!whatsapp_number) {
        res.status(400).json({ message: "WhatsApp number required" });
        return;
    }

    // Sanitize phone (e.g. ensure it starts with + or just digits)
    // For simplicity, we assume the bot sends it clean or we clean it here.
    const emailPlaceholder = `${whatsapp_number}@ola-shop.com`;

    try {
        await manager.transaction(async (transactionManager) => {
            // 1. Check if user exists (by email, as phone is not unique constraint by default in Medusa core)
            // Note: In a real app we might want to search by phone metadata
            const existing = await customerService
                .withTransaction(transactionManager)
                .retrieveByEmail(emailPlaceholder)
                .catch(() => null);

            if (existing) {
                res.status(200).json({
                    message: "User exists",
                    customer_id: existing.id,
                    is_new: false
                });
                return;
            }

            // 2. Create User
            const newCustomer = await customerService
                .withTransaction(transactionManager)
                .create({
                    email: emailPlaceholder,
                    password: "Welcome2025!", // Temp password
                    first_name: "WhatsApp",
                    last_name: "User",
                    phone: whatsapp_number,
                    metadata: {
                        source: source || "whatsapp_bot",
                        whatsapp_verified: true,
                        force_password_change: true
                    }
                });

            res.status(201).json({
                message: "User created",
                customer_id: newCustomer.id,
                is_new: true,
                temp_password: "Welcome2025!"
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Error", error: error.message });
    }
}
