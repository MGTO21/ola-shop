# TikTok Integration - Editable from Warehouse App

## 📍 Configuration File Location

**Path:** `apps/storefront/public/config/tiktok-config.json`

This file controls all TikTok content displayed on the storefront.

---

## 🎛️ How to Edit from Warehouse App

### Option 1: Direct File Edit
The warehouse desktop app can directly edit the JSON file at:
```
c:\Users\hp\.gemini\antigravity\scratch\ola-shop-v2\apps\storefront\public\config\tiktok-config.json
```

### Option 2: Add TikTok Manager to Warehouse App
Create a new section in the warehouse app to manage:
- TikTok profile settings
- Featured videos (add/remove/reorder)
- Section visibility
- Text content (Arabic & English)

---

## 📝 Configuration Structure

```json
{
  "tiktokProfile": {
    "username": "ola.beauty.sd",
    "profileUrl": "https://www.tiktok.com/@ola.beauty.sd",
    "displayName": "Ola Beauty Sudan",
    "displayNameAr": "علا بيوتي السودان"
  },
  "featuredVideos": [
    {
      "id": "1",
      "title": "منتجات العناية بالبشرة",
      "titleEn": "Skincare Products",
      "videoUrl": "https://www.tiktok.com/@ola.beauty.sd/video/1",
      "thumbnailUrl": "",
      "enabled": true
    }
  ],
  "sectionSettings": {
    "enabled": true,
    "titleAr": "شاهد منتجاتنا على تيك توك",
    "titleEn": "Trending on TikTok",
    "ctaTextAr": "تابعنا على تيك توك",
    "ctaTextEn": "Follow us on TikTok",
    "showCreatorEmbed": true,
    "showVideoGrid": true
  }
}
```

---

## 🔧 Editable Fields

### Profile Settings
- `username` - TikTok username
- `profileUrl` - Full TikTok profile URL
- `displayName` - English display name
- `displayNameAr` - Arabic display name

### Featured Videos
- `id` - Unique identifier
- `title` - Arabic title
- `titleEn` - English title
- `videoUrl` - Direct link to TikTok video
- `thumbnailUrl` - Optional custom thumbnail
- `enabled` - Show/hide video (true/false)

### Section Settings
- `enabled` - Show/hide entire section (true/false)
- `titleAr` - Section title in Arabic
- `titleEn` - Section title in English
- `ctaTextAr` - Call-to-action button text (Arabic)
- `ctaTextEn` - Call-to-action button text (English)
- `showCreatorEmbed` - Show TikTok creator embed (true/false)
- `showVideoGrid` - Show video grid (true/false)

---

## 🚀 Implementation in Warehouse App

### Suggested UI in Warehouse Desktop App

```
┌─────────────────────────────────────┐
│  TikTok Content Manager             │
├─────────────────────────────────────┤
│                                     │
│  Profile Settings                   │
│  ├─ Username: ola.beauty.sd         │
│  ├─ Profile URL: [edit]             │
│  └─ Display Names: [edit]           │
│                                     │
│  Featured Videos                    │
│  ├─ Video 1: [Edit] [Delete] [↑↓]  │
│  ├─ Video 2: [Edit] [Delete] [↑↓]  │
│  ├─ Video 3: [Edit] [Delete] [↑↓]  │
│  └─ [+ Add New Video]               │
│                                     │
│  Section Settings                   │
│  ├─ ☑ Enable Section               │
│  ├─ ☑ Show Creator Embed            │
│  ├─ ☑ Show Video Grid               │
│  ├─ Title (AR): [edit]              │
│  ├─ Title (EN): [edit]              │
│  ├─ CTA Text (AR): [edit]           │
│  └─ CTA Text (EN): [edit]           │
│                                     │
│  [Save Changes]  [Preview]          │
└─────────────────────────────────────┘
```

---

## 💡 Benefits

✅ **Centralized Control** - Edit TikTok content from warehouse app
✅ **No Code Changes** - Update content without touching code
✅ **Real-time Updates** - Changes reflect immediately on storefront
✅ **Bilingual Support** - Manage both Arabic and English content
✅ **Easy Management** - Enable/disable videos or entire section
✅ **Flexible** - Add/remove videos as needed

---

## 📋 Next Steps

1. Add TikTok manager UI to warehouse desktop app
2. Implement JSON file read/write functionality
3. Add validation for URLs and required fields
4. Test changes reflect on storefront
5. Add preview functionality

---

**File Created:** December 12, 2025  
**Integration:** Warehouse App ↔ Storefront
