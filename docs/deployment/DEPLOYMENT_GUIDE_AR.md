# 🚀 دليل النشر السريع - Ola Shop v2.0

## 📋 الملخص التنفيذي

### ✅ السيرفر الموصى به

**الخيار الأول (الأرخص):**
- **المزود:** Hetzner Cloud
- **الخطة:** CPX21
- **المواصفات:** 4GB RAM, 3 vCPUs, 80GB SSD
- **السعر:** €8.50/شهر (~$9)
- **الموقع:** ألمانيا

**الخيار الثاني (الأسهل):**
- **المزود:** DigitalOcean
- **الخطة:** Basic Droplet 4GB
- **المواصفات:** 4GB RAM, 2 vCPUs, 80GB SSD
- **السعر:** $24/شهر
- **الموقع:** Frankfurt

---

## 🎯 خطوات النشر (3 أيام)

### اليوم الأول: إعداد السيرفر

#### 1️⃣ حجز VPS
```
1. سجل حساب في Hetzner أو DigitalOcean
2. اختر الخطة (4GB RAM)
3. اختر نظام Ubuntu 22.04 LTS
4. اختر الموقع (Frankfurt أو Amsterdam)
5. أضف SSH Key (اختياري)
6. احجز السيرفر
```

#### 2️⃣ الاتصال بالسيرفر
```bash
# من جهازك (Windows)
ssh root@YOUR_SERVER_IP

# أو استخدم PuTTY
```

#### 3️⃣ تشغيل سكريبت التنصيب التلقائي
```bash
# إنشاء مستخدم جديد
adduser ola
usermod -aG sudo ola

# تسجيل الدخول كمستخدم جديد
su - ola

# تحميل سكريبت التنصيب
wget https://raw.githubusercontent.com/YOUR_REPO/auto-install.sh
chmod +x auto-install.sh

# تشغيل السكريبت
./auto-install.sh
```

**السكريبت سيقوم بـ:**
- ✅ تحديث النظام
- ✅ إعداد الأمان (Firewall)
- ✅ تركيب Node.js 20
- ✅ تركيب PostgreSQL
- ✅ تركيب Redis
- ✅ تركيب Nginx
- ✅ تركيب PM2
- ✅ إنشاء قاعدة البيانات
- ✅ إعداد النسخ الاحتياطي التلقائي

**المدة:** 15-20 دقيقة

---

### اليوم الثاني: رفع التطبيق

#### 1️⃣ رفع الملفات

**الطريقة الأولى: باستخدام Git**
```bash
cd ~/ola-shop/backend
git clone YOUR_MEDUSA_REPO .

cd ~/ola-shop/frontend
git clone YOUR_NEXTJS_REPO .
```

**الطريقة الثانية: باستخدام SCP**
```bash
# من جهازك (Windows)
scp -r C:\path\to\backend ola@YOUR_SERVER_IP:~/ola-shop/
scp -r C:\path\to\frontend ola@YOUR_SERVER_IP:~/ola-shop/
```

**الطريقة الثالثة: باستخدام FileZilla**
1. افتح FileZilla
2. اتصل بـ: YOUR_SERVER_IP
3. المستخدم: ola
4. ارفع المجلدات إلى ~/ola-shop/

#### 2️⃣ إعداد ملفات البيئة

```bash
# عرض بيانات قاعدة البيانات
cat ~/ola-shop-credentials/database.txt

# إعداد Backend
cd ~/ola-shop/backend
cp .env.template .env
nano .env
# املأ البيانات من database.txt

# إعداد Frontend
cd ~/ola-shop/frontend
cp .env.template .env
nano .env
# أضف رابط API الخاص بك
```

#### 3️⃣ تشغيل Backend (Medusa)

```bash
cd ~/ola-shop/backend

# تركيب الحزم
npm install

# تشغيل Migrations
npm run migrations

# إنشاء مستخدم Admin
npm run seed

# بناء المشروع
npm run build

# تشغيل بـ PM2
pm2 start npm --name "medusa-backend" -- start
pm2 save
```

#### 4️⃣ تشغيل Frontend (Next.js)

```bash
cd ~/ola-shop/frontend

# تركيب الحزم
npm install

# بناء المشروع
npm run build

# تشغيل بـ PM2
pm2 start npm --name "nextjs-frontend" -- start
pm2 save
```

#### 5️⃣ التحقق من التشغيل

```bash
# عرض حالة التطبيقات
pm2 list

# عرض logs
pm2 logs

# التحقق من عمل Backend
curl http://localhost:9000/health

# التحقق من عمل Frontend
curl http://localhost:3000
```

---

### اليوم الثالث: الدومين و SSL

#### 1️⃣ ربط الدومين

في لوحة تحكم الدومين (GoDaddy, Namecheap, etc):
```
نوع السجل: A
الاسم: @
القيمة: YOUR_SERVER_IP
TTL: 3600

نوع السجل: A
الاسم: www
القيمة: YOUR_SERVER_IP
TTL: 3600

نوع السجل: A
الاسم: api
القيمة: YOUR_SERVER_IP
TTL: 3600
```

#### 2️⃣ إعداد Nginx

```bash
sudo nano /etc/nginx/sites-available/ola-shop
```

أضف هذا الكود:
```nginx
# Frontend (ola-shop.com)
server {
    listen 80;
    server_name ola-shop.com www.ola-shop.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API (api.ola-shop.com)
server {
    listen 80;
    server_name api.ola-shop.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

تفعيل الإعدادات:
```bash
sudo ln -s /etc/nginx/sites-available/ola-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3️⃣ تركيب SSL (HTTPS)

```bash
sudo certbot --nginx -d ola-shop.com -d www.ola-shop.com -d api.ola-shop.com
```

اتبع التعليمات:
1. أدخل بريدك الإلكتروني
2. وافق على الشروط
3. اختر "Redirect" لتحويل HTTP إلى HTTPS تلقائياً

#### 4️⃣ التحقق النهائي

```bash
# اختبار SSL
curl https://ola-shop.com
curl https://api.ola-shop.com/health

# عرض حالة النظام
~/ola-shop/status.sh
```

---

## ✅ Checklist النشر الكامل

### قبل البدء
- [ ] حجزت VPS (4GB RAM على الأقل)
- [ ] لديك دومين جاهز
- [ ] لديك بطاقة ائتمان للدفع
- [ ] لديك برنامج SSH (PuTTY أو Terminal)

### اليوم الأول
- [ ] اتصلت بالسيرفر عبر SSH
- [ ] أنشأت مستخدم جديد
- [ ] شغلت سكريبت التنصيب التلقائي
- [ ] حفظت بيانات قاعدة البيانات

### اليوم الثاني
- [ ] رفعت كود Backend
- [ ] رفعت كود Frontend
- [ ] أعددت ملفات .env
- [ ] شغلت Backend بنجاح
- [ ] شغلت Frontend بنجاح
- [ ] تحققت من PM2

### اليوم الثالث
- [ ] ربطت الدومين بالـ IP
- [ ] أعددت Nginx
- [ ] ركبت SSL
- [ ] اختبرت الموقع على HTTPS
- [ ] اختبرت جميع الميزات

---

## 🔧 أوامر مفيدة

### إدارة PM2
```bash
pm2 list                    # عرض التطبيقات
pm2 logs                    # عرض السجلات
pm2 restart all             # إعادة تشغيل الكل
pm2 stop medusa-backend     # إيقاف Backend
pm2 start medusa-backend    # تشغيل Backend
pm2 monit                   # مراقبة الأداء
```

### إدارة Nginx
```bash
sudo systemctl status nginx     # حالة Nginx
sudo systemctl restart nginx    # إعادة تشغيل
sudo nginx -t                   # اختبار الإعدادات
sudo tail -f /var/log/nginx/error.log  # عرض الأخطاء
```

### إدارة قاعدة البيانات
```bash
sudo -u postgres psql           # الدخول لـ PostgreSQL
\l                              # عرض قواعد البيانات
\c ola_shop                     # الاتصال بقاعدة البيانات
\dt                             # عرض الجداول
```

### النسخ الاحتياطي
```bash
~/ola-shop/backups/backup.sh    # نسخ احتياطي يدوي
ls ~/ola-shop/backups/          # عرض النسخ الاحتياطية
```

### مراقبة الموارد
```bash
htop                # استهلاك CPU و RAM
df -h               # مساحة القرص
free -h             # الذاكرة المتاحة
```

---

## 🆘 حل المشاكل الشائعة

### المشكلة: الموقع لا يفتح
```bash
# تحقق من حالة التطبيقات
pm2 list

# تحقق من Nginx
sudo systemctl status nginx

# تحقق من Firewall
sudo ufw status
```

### المشكلة: خطأ في قاعدة البيانات
```bash
# تحقق من PostgreSQL
sudo systemctl status postgresql

# عرض السجلات
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### المشكلة: SSL لا يعمل
```bash
# تجديد الشهادة
sudo certbot renew

# اختبار Nginx
sudo nginx -t
```

---

## 📞 الدعم

إذا واجهت أي مشكلة:

1. **تحقق من السجلات:**
   ```bash
   pm2 logs
   sudo tail -f /var/log/nginx/error.log
   ```

2. **أعد تشغيل الخدمات:**
   ```bash
   pm2 restart all
   sudo systemctl restart nginx
   ```

3. **تحقق من حالة النظام:**
   ```bash
   ~/ola-shop/status.sh
   ```

---

## 🎉 تم النشر بنجاح!

بعد إتمام جميع الخطوات، موقعك سيكون جاهزاً على:
- 🌐 **Frontend:** https://ola-shop.com
- 🔌 **API:** https://api.ola-shop.com
- 👨‍💼 **Admin:** https://ola-shop.com/app

**ميزات جاهزة:**
- ✅ تسجيل دخول WhatsApp
- ✅ تصفح كضيف
- ✅ نظام النقاط
- ✅ الكوبونات
- ✅ سلة التسوق
- ✅ الدفع عند الاستلام

**بالتوفيق! 🚀**
