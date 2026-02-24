# 🌐 How to Connect Your Domain (ola-shop.com)

This guide will help you connect your domain name (`ola-shop.com`) to your new VPS server so customers can visit your store easily.

## Step 1: Log in to Your Domain Provider
Go to the website where you bought your domain (e.g., GoDaddy, Namecheap, Hostinger, Bluehost).

## Step 2: Find DNS Settings
1.  Go to your **Domain List** or **My Products**.
2.  Find `ola-shop.com`.
3.  Look for a button that says **"DNS"**, **"DNS Management"**, or **"Name Servers"**.

## Step 3: Add an "A Record"
You need to tell the domain to point to your server's IP address (`46.224.43.113`).

1.  Look for the **Records** section.
2.  If there are existing **A Records** with the name `@` or `www`, **delete them** or **edit them**.
3.  **Add a New Record** with these details:

| Type | Name / Host | Value / Points to | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `46.224.43.113` | Automatic / 1 Hour |

4.  **Add a Second Record** (for www):

| Type | Name / Host | Value / Points to | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `ola-shop.com` | Automatic / 1 Hour |

*(Note: If you can't add a CNAME, you can add another **A Record** with Name `www` and Value `46.224.43.113`)*

## Step 4: Wait for Propagation
DNS changes can take anywhere from **10 minutes to 24 hours** to spread across the internet.
- You can check if it's working by visiting [https://whatsmydns.net](https://whatsmydns.net) and typing `ola-shop.com`. If you see green checkmarks with `46.224.43.113`, it's ready!

## Step 5: Secure Your Site (HTTPS) - **IMPORTANT!**
Once your domain is connected and working, you need to enable the "Secure Lock" (SSL) so your customers' data is safe.

**Run this command on your server (via PowerShell/SSH):**

```bash
certbot --nginx -d ola-shop.com -d www.ola-shop.com
```

1.  It will ask for your email (enter it).
2.  It will ask to agree to terms (type `Y`).
3.  It will ask to share email (type `N`).
4.  It will do the rest automatically!

---
**Need Help?**
If you are stuck, tell me which domain provider you use (e.g., "I use GoDaddy"), and I can give you specific instructions for their website!
