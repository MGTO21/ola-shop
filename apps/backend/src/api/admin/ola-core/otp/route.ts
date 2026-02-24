import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { customer_id } = req.body as any;
  const customerModule = req.scope.resolve("customer");

  try {
    const customer = await customerModule.retrieveCustomer(customer_id);
    
    console.log(`[OTP DEBUG] Customer ID: ${customer_id}`);
    console.log(`[OTP DEBUG] Original Phone: '${customer.phone}'`);

    if (!customer?.phone) {
      return res.status(400).json({ message: "Customer has no phone" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in metadata
    await customerModule.updateCustomers(customer_id, {
      metadata: {
        otp_code: code,
        otp_created_at: new Date().toISOString()
      }
    });

    // --- SANITIZE PHONE ---
    let phone = customer.phone.replace(/\D/g, ''); // Remove non-digits
    if (phone.startsWith('0')) phone = phone.substring(1); // Remove leading '0'
    
    // Add Sudan Code (249) if 9 digits
    if (phone.length === 9) phone = '249' + phone;

    console.log(`[OTP DEBUG] Final Phone: '${phone}'`);

    const message = encodeURIComponent(`Your verification code is ${code}`);
    const link = `https://wa.me/${phone}?text=${message}`;

    console.log(`[OTP DEBUG] Generated Link: ${link}`);

    res.json({
      success: true,
      code: code,
      link: link
    });

  } catch (e) {
    console.error("OTP Error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
