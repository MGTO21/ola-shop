#!/bin/bash
FILE="/root/ola-shop-v2/apps/storefront/app/api/verify-otp/route.ts"
mkdir -p $(dirname $FILE)

cat <<'CODE_EOF' > $FILE
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, code } = body;
        const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://46.224.43.113:9000";
        const adminToken = process.env.MEDUSA_ADMIN_TOKEN;
        const authHeader = \`Basic \${Buffer.from(\`\${adminToken}:\`).toString('base64')}\`;
        const phoneDigits = phone.replace(/\D/g, '');

        // 1. Find Guest
        const searchRes = await fetch(\`\${BACKEND_URL}/admin/customers?q=\${phoneDigits}\`, {
            headers: { 'Authorization': authHeader }
        });

        if (!searchRes.ok) return NextResponse.json({ success: false, message: "Backend connection failed" }, { status: 500 });
        const searchData = await searchRes.json();
        const customer = searchData.customers?.find((c: any) => 
            c.phone === phone || c.phone === phone.replace(/\+/g, '') || (c.email && c.email.startsWith(phoneDigits))
        );

        if (!customer) return NextResponse.json({ success: false, message: "لم نجد حسابك. يرجى التسجيل أولاً." }, { status: 404 });

        // 2. Match OTP
        const otpCode = customer.metadata?.otp_code || customer.metadata?.otp;
        if (otpCode && otpCode.toString() === code.toString()) {
            const savedPassword = customer.metadata?.guest_password_intent || "Welcome2025!";
            const customerEmail = customer.email;

            // Rename guest first (Safe Mode: No deletion yet!)
            await fetch(\`\${BACKEND_URL}/admin/customers/\${customer.id}\`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": authHeader },
                body: JSON.stringify({ email: \`verified-\${customer.id}@ola-shop.com\` })
            });

            // 3. Register Real Identity
            const registerRes = await fetch(\`\${BACKEND_URL}/auth/customer/emailpass/register\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: customerEmail, 
                    password: savedPassword, 
                    first_name: customer.first_name || 'Al-Ola', 
                    last_name: customer.last_name || 'Customer' 
                })
            });

            let regData: any = {};
            if (!registerRes.ok) {
                regData = await registerRes.json();
                if (registerRes.status !== 409) {
                    return NextResponse.json({ success: false, message: "فشل إنشاء الحساب النهائي." }, { status: 500 });
                }
            } else {
                regData = await registerRes.json();
            }

            const newCustomer = regData.customer;
            if (newCustomer) {
                // Success! Now we can safely delete the guest
                await fetch(\`\${BACKEND_URL}/admin/customers/\${customer.id}\`, { method: "DELETE", headers: { "Authorization": authHeader } });
                
                const regGroupId = "cusgroup_01KE9D2DDG29F5BH5YPBF0N4AB";
                await fetch(\`\${BACKEND_URL}/admin/customers/\${newCustomer.id}\`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": authHeader },
                    body: JSON.stringify({ 
                        phone: phone, 
                        metadata: { ...newCustomer.metadata, whatsapp_verified: true, otp_verified_at: new Date().toISOString() } 
                    })
                });
                await fetch(\`\${BACKEND_URL}/admin/customer-groups/\${regGroupId}/customers\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                    body: JSON.stringify({ add: [newCustomer.id] })
                });
            }
            return NextResponse.json({ success: true, customer: { id: newCustomer?.id || customer.id, email: customerEmail, password: savedPassword } });
        } else {
            return NextResponse.json({ success: false, message: "رمز التحقق غير صحيح أو انتهت صلاحيته" }, { status: 400 });
        }
    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
CODE_EOF

# 2. Run it and restart
pm2 restart 48
