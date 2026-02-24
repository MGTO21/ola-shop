import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import jwt from "jsonwebtoken";

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    try {
        const { phone, password } = req.body as any;
        const config = req.scope.resolve("configModule");
        const jwtSecret = config.projectConfig.http.jwtSecret || process.env.JWT_SECRET || "supersecret";

        // Normalize phone number: ensure it starts with '+'
        let normalizedPhone = phone.trim();
        if (!normalizedPhone.startsWith('+')) {
            normalizedPhone = '+' + normalizedPhone;
        }

        console.log("[Backend Login] Normalized Phone:", { original: phone, normalized: normalizedPhone });

        // Find identity email from phone
        // Query database to find matching customer by phone
        const customerModule = req.scope.resolve("customer");

        // Try searching with normalized phone
        let customers = await customerModule.listCustomers({
            phone: normalizedPhone
        } as any);

        // If not found, try searching with original phone (just in case)
        if (!customers || customers.length === 0) {
            customers = await customerModule.listCustomers({
                phone: phone
            } as any);
        }

        if (!customers || customers.length === 0) {
            res.status(404).json({
                error: "الرقم غير مسجل. يرجى إنشاء حساب جديد"
            });
            return;
        }

        const customer = customers[0];
        const identityEmail = customer.metadata?.auth_identifier || customer.email;

        console.log("[Backend Login] Found customer:", customer.id, "email:", identityEmail);

        // Authenticate with Medusa auth
        const authModule = req.scope.resolve("auth");
        const loginResponse = await (authModule as any).authenticate("emailpass", {
            body: {
                email: identityEmail,
                password: password
            }
        } as any);

        if (!loginResponse.success) {
            res.status(401).json({
                error: "كلمة المرور غير صحيحة"
            });
            return;
        }

        let token = null;
        if (loginResponse.authIdentity) {
            const authIdentity = loginResponse.authIdentity;
            const actorId = authIdentity.app_metadata?.customer_id || customer.id;

            // Sign a real JWT for the storefront
            token = jwt.sign({
                actor_id: actorId,
                actor_type: 'customer',
                auth_identity_id: authIdentity.id,
                app_metadata: {
                    customer_id: actorId
                }
            }, jwtSecret, { expiresIn: '7d' });
        }

        res.status(200).json({
            success: true,
            customer: customer,
            token: token,
            message: "تم تسجيل الدخول بنجاح"
        });

    } catch (error: any) {
        console.error("[Backend Login] Fatal error:", error);
        res.status(500).json({
            error: "خطأ في السيرفر",
            details: error.message
        });
    }
}
