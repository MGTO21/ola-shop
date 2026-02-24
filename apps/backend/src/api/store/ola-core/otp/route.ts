import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { phone, code } = req.body as any;
  const customerModule = req.scope.resolve("customer");

  // FIXED: Filter syntax (using 'q' or 'filters' depending on version, safe bet is listing all)
  // Medusa v2 often requires specific filters. We try simple 'q' if 'phone' is indexed
  const customers = await customerModule.listCustomers({ 
    q: phone 
  }, { take: 1 });

  const customer = customers.find(c => c.phone?.includes(phone) || (c.phone && phone && c.phone === phone));

  if (!customer) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (customer.metadata?.otp_code === code) {
    // FIXED: 'updateCustomers' (plural)
    await customerModule.updateCustomers(customer.id, {
      metadata: {
        is_verified: true,
        otp_code: null
      }
    });
    return res.json({ success: true, customer });
  }

  return res.status(400).json({ success: false, message: "Invalid Code" });
}
