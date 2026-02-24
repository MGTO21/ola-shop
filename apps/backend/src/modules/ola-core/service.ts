import { MedusaService } from "@medusajs/framework/utils"
import { WhatsAppIdentity } from "./models/whatsapp-identity"
import { LoyaltyTransaction } from "./models/loyalty-transaction"
import { CustomerActivity } from "./models/customer-activity"
import { DeliveryZone } from "./models/delivery-zone"

class OlaCoreService extends MedusaService({
  WhatsAppIdentity,
  LoyaltyTransaction,
  CustomerActivity,
  DeliveryZone,
}) {

  // ==========================
  // WHATSAPP AUTH
  // ==========================

  /**
   * Generates a 6-digit OTP, saves it, and simulates sending via WhatsApp.
   */
  async generateOtp(phoneNumber: string): Promise<string> {
    // 1. Normalization (Simple trim for now)
    const normalizedPhone = phoneNumber.trim()

    // 2. Generate 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // 3. Find existing or create placeholder
    const existing = await this.listWhatsAppIdentities({ phone_number: normalizedPhone })

    if (existing.length > 0) {
      // RESEND REQUEST Logic
      console.log(`[OlaCore] 🔄 Resend OTP requested for ${normalizedPhone}`)
      await this.updateWhatsAppIdentities([{
        id: existing[0].id,
        otp_hash: otp,
        otp_expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
        signup_step: "otp_sent"
      }])
    } else {
      // NEW SIGNUP Logic
      await this.createWhatsAppIdentities([{
        phone_number: normalizedPhone,
        otp_hash: otp,
        otp_expires_at: new Date(Date.now() + 5 * 60 * 1000),
        is_verified: false,
        signup_step: "otp_sent"
      }])
    }

    // 4. Send via SMS/WhatsApp Provider
    // For Development: Log to console with CLICKABLE LINK
    const message = encodeURIComponent(`Your Ola Shop code is: ${otp}`)
    const waLink = `https://wa.me/${normalizedPhone}?text=${message}`

    console.log(`[OlaCore] 🟢 SMS SENT to ${normalizedPhone}`)
    console.log(`[OlaCore] 👉 CLICK TO SEND: ${waLink}`)

    return otp
  }

  /**
   * Generates a Google Contacts CSV string of all verified customers.
   */
  async exportContactsToCsv(): Promise<string> {
    const contacts = await this.listWhatsAppIdentities({
      is_verified: true
    })

    const header = "Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,E-mail 1 - Type,E-mail 1 - Value,Phone 1 - Type,Phone 1 - Value\n"

    const rows = contacts.map(c => {
      const name = c.name || "Unknown Customer"
      return `${name},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,Mobile,${c.phone_number}`
    }).join("\n")

    return header + rows
  }

  /**
   * Logs a customer action (SEO/Behavior).
   */
  async logActivity(customerId: string, type: "view_product" | "add_to_cart" | "view_page", resourceId: string, resourceName?: string): Promise<void> {
    await this.createCustomerActivities([{
      customer_id: customerId,
      type: type,
      resource_id: resourceId,
      resource_name: resourceName
    }])
  }

  /**
   * Verifies the OTP and returns the Identity if successful.
   */
  async verifyOtp(phoneNumber: string, code: string): Promise<boolean> {
    const normalizedPhone = phoneNumber.trim()
    const identities = await this.listWhatsAppIdentities({ phone_number: normalizedPhone })

    if (identities.length === 0) return false
    const identity = identities[0]

    // Check expiry
    if (!identity.otp_expires_at || new Date() > identity.otp_expires_at) {
      console.log(`[OlaCore] 🔴 OTP Expired for ${normalizedPhone}`)
      return false
    }

    // Check code match
    if (identity.otp_hash !== code) {
      console.log(`[OlaCore] 🔴 Invalid OTP for ${normalizedPhone}`)
      return false
    }

    // Success: Mark verified and clear OTP to prevent replay
    await this.updateWhatsAppIdentities([{
      id: identity.id,
      is_verified: true,
      otp_hash: null
    }])

    return true
  }

  // ==========================
  // LOYALTY SYSTEM (Sudan Gold)
  // ==========================

  /**
   * Adds (or subtracts) points for a customer.
   */
  async addPoints(customerId: string, amount: number, reason: string): Promise<void> {
    await this.createLoyaltyTransactions([{
      customer_id: customerId,
      points: amount,
      reason: reason
    }])
    console.log(`[OlaCore] 🪙 Loyalty: Added ${amount} pts to ${customerId} for ${reason}`)
  }

  /**
   * Calculates the current point balance.
   */
  async getLoyaltyBalance(customerId: string): Promise<number> {
    const txs = await this.listLoyaltyTransactions({
      customer_id: customerId
    })
    return txs.reduce((sum: number, tx: any) => sum + tx.points, 0)
  }

  // ==========================
  // DELIVERY LOGIC
  // ==========================

  /**
   * Calculates delivery fee based on location.
   */
  async getDeliveryQuote(countryCode: string, city: string): Promise<{
    fee: number,
    currency: string,
    status: "available" | "coming_soon" | "no_coverage"
  }> {
    const code = countryCode.toLowerCase()

    // 1. Check International "Coming Soon" list
    const comingSoonCountries = ["eg", "sa", "ae", "qa", "om"] // Egypt, KSA, UAE, Qatar, Oman
    if (comingSoonCountries.includes(code)) {
      return { fee: 0, currency: "sdg", status: "coming_soon" }
    }

    // 2. Sudan Logic (Manual Cities)
    if (code === "sd") {
      const zones = await this.listDeliveryZones({
        country_code: "sd",
        city_name: city // Precise match for now, could be fuzzy later
      })

      if (zones.length > 0) {
        return {
          fee: zones[0].fee_amount,
          currency: zones[0].currency_code,
          status: "available"
        }
      }
    }

    return { fee: 0, currency: "sdg", status: "no_coverage" }
  }
}

export default OlaCoreService
