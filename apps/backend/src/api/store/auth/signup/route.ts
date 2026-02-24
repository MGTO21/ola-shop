import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import jwt from "jsonwebtoken";

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    try {
        console.log("[Backend Signup] STARTING SIGNUP PROCESS");
        const { phone, firstName, lastName, password } = req.body as any;
        const config = req.scope.resolve("configModule");
        const jwtSecret = config.projectConfig.http.jwtSecret || process.env.JWT_SECRET || "supersecret";

        console.log("[Backend Signup] Body:", JSON.stringify({ phone, firstName, lastName, passwordExists: !!password }));

        if (!phone || !password || !firstName) {
            console.warn("[Backend Signup] Missing required fields");
            res.status(400).json({
                error: "رقم الهاتف والاسم وكلمة المرور مطلوبة"
            });
            return;
        }

        // Create unique email identifier from phone
        const phoneDigits = phone.replace(/\D/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const identityEmail = `${phoneDigits}.${randomSuffix}@ola-shop.com`;
        console.log("[Backend Signup] Generated identityEmail:", identityEmail);

        // Use Medusa's auth module to register
        const authModule = req.scope.resolve("auth");

        try {
            console.log("[Backend Signup] Registering with authModule...");
            // Register with emailpass provider
            const authResponse = await (authModule as any).register("emailpass", {
                body: {
                    email: identityEmail,
                    password: password
                }
            } as any);

            console.log("[Backend Signup] Auth registration success:", authResponse.success);

            if (!authResponse.success) {
                console.error("[Backend Signup] Auth registration failed:", authResponse.error);
                res.status(400).json({
                    error: authResponse.error || "فشل إنشاء الحساب في نظام الهوية"
                });
                return;
            }

            // Create customer profile
            console.log("[Backend Signup] Creating customer profile...");
            const customerModule = req.scope.resolve("customer");
            const customer = await customerModule.createCustomers({
                email: identityEmail,
                first_name: firstName,
                last_name: lastName || "User",
                phone: phone,
                metadata: {
                    whatsapp_verified: false,
                    auth_identifier: identityEmail
                }
            });

            console.log("[Backend Signup] Customer profile created:", customer.id);

            // Authenticate to get authIdentity
            console.log("[Backend Signup] Authenticating to get token...");
            const loginResponse = await (authModule as any).authenticate("emailpass", {
                body: {
                    email: identityEmail,
                    password: password
                }
            } as any);

            console.log("[Backend Signup] Login response success:", loginResponse.success);

            let token = null;
            if (loginResponse.success && loginResponse.authIdentity) {
                const authIdentity = loginResponse.authIdentity;
                const actorId = authIdentity.app_metadata?.customer_id || customer.id;

                console.log("[Backend Signup] Generating JWT for actorId:", actorId);
                // Sign a real JWT for the storefront
                token = jwt.sign({
                    actor_id: actorId,
                    actor_type: 'customer',
                    auth_identity_id: authIdentity.id,
                    app_metadata: {
                        customer_id: actorId
                    }
                }, jwtSecret, { expiresIn: '7d' });
                console.log("[Backend Signup] JWT generated successfully");
            }

            console.log("[Backend Signup] SIGNUP COMPLETED SUCCESSFULLY");
            res.status(201).json({
                success: true,
                customer: customer,
                token: token,
                message: "تم إنشاء الحساب بنجاح"
            });

        } catch (authError: any) {
            console.error("[Backend Signup] Error during inner signup steps:", authError.message);
            res.status(500).json({
                error: "خطأ داخلي في إنشاء الحساب",
                details: authError.message
            });
        }

    } catch (error: any) {
        console.error("[Backend Signup] FATAL ERROR:", error);
        res.status(500).json({
            error: "خطأ غير متوقع في السيرفر",
            details: error.message
        });
    }
}
