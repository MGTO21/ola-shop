# 🚀 DEPLOY OLA SHOP V2.0 - ACTION PLAN

This guide is your **single source of truth** for deploying the latest version of Ola Shop to your VPS.

## 1. Prepare Your Local Files (On Your PC)

1.  **Add Your Logo:**
    *   Rename your logo file to `logo.png`.
    *   Copy it to: `C:\Users\hp\.gemini\antigravity\scratch\ola-shop-v2\apps\storefront\public\logo.png`.

2.  **Compress the Project:**
    *   Open PowerShell.
    *   Run this command to create a ZIP file:
        ```powershell
        cd C:\Users\hp\.gemini\antigravity\scratch
        Compress-Archive -Path ola-shop-v2 -DestinationPath ola-shop-v2.zip -Force
        ```

## 2. Upload to VPS (Using cPanel)

1.  **Login to cPanel:** Go to your hosting control panel.
2.  **Open File Manager:** Navigate to `/home/your-username/`.
3.  **Upload:** Upload the `ola-shop-v2.zip` file you just created.
4.  **Extract:** Right-click the ZIP file and select "Extract".
    *   This will create a folder named `ola-shop-v2`.

## 3. Run Deployment Scripts (Using Terminal/SSH)

1.  **Connect to VPS:**
    *   Open PowerShell or Terminal.
    *   Run: `ssh root@your-server-ip` (Enter your password when prompted).

2.  **Navigate to Project:**
    ```bash
    cd /home/your-username/ola-shop-v2
    ```

3.  **Make Scripts Executable:**
    ```bash
    chmod +x *.sh
    ```

4.  **Run the Deployment Script:**
    ```bash
    ./deploy-vps.sh
    ```
    *   *This script will install Docker, build the app, and start the services.*
    *   *It may take 10-15 minutes.*

5.  **Configure Nginx (Web Server):**
    ```bash
    ./configure-nginx.sh
    ```
    *   *Follow the prompts. Enter `ola-shop.com` as your domain.*

6.  **Setup SSL (Secure HTTPS):**
    ```bash
    ./setup-ssl.sh
    ```
    *   *Enter your email when prompted.*

## 4. Verify & Launch 🚀

1.  **Visit your site:** https://ola-shop.com
2.  **Test the New Login Flow:**
    *   Go to Login page.
    *   Enter a phone number.
    *   **Action Required:** You will see a code (e.g., `OLA-1234`).
    *   **As a User:** Send this code to your WhatsApp business number.
    *   **As Admin:** When you receive the code on WhatsApp, reply with a temporary password.
    *   **As User:** Use that password to login.
    *   **Complete Profile:** You will be asked to change password and add details.
3.  **Check Features:**
    *   ✅ Loyalty Points (Check account page)
    *   ✅ Shipping Address Warning (Check account page)
    *   ✅ Autoplay Videos (Homepage)

## 5. Admin Panel

*   **URL:** https://ola-shop.com/app
*   **Login:** `admin@ola-shop.com` / `supersecret` (Change this immediately!)
*   **Task:** When users send you verification codes on WhatsApp, you need to manually generate a password for them and send it back.

---

**Need Help?**
If you encounter any issues, check the `logs` directory or contact support.
