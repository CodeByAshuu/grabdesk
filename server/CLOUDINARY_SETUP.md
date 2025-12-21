# Cloudinary Configuration Guide

## Environment Variables Required

Add these to your `.env` file in the **server** directory:

```env
# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### How to Get Cloudinary Credentials:

1. **Sign up** at [cloudinary.com](https://cloudinary.com)
2. **Login** to your Cloudinary dashboard
3. Navigate to **Dashboard** → **Account Details**
4. Copy the following:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Example `.env` (DO NOT commit to Git!):

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/grabdesk

# JWT
JWT_SECRET=your_jwt_secret_here

# Cloudinary (NEW)
CLOUD_NAME=dgabcdef1234
CLOUD_API_KEY=123456789012345
CLOUD_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Server
PORT=5000
```

---

## Quick Test

After adding credentials, test the integration:

### 1. Restart Backend
```bash
cd server
npm run dev
```

### 2. Add a Product
- Go to Admin Dashboard
- Click "Add Product"
- Upload 3 images (base64)
- Submit

### 3. Verify
- Images should upload to Cloudinary
- Check Cloudinary dashboard → Media Library → "products" folder
- Product should save with Cloudinary URLs

---

## How It Works

### Before (Base64 in Database):
```javascript
{
  images: [
    "data:image/png;base64,iVBORw0KGgoAAAANS...", // Large base64 string
    "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..." // Large base64 string
  ]
}
```

### After (Cloudinary URLs):
```javascript
{
  images: [
    "https://res.cloudinary.com/dgabcd/image/upload/v1234/products/abc123.jpg",
    "https://res.cloudinary.com/dgabcd/image/upload/v1234/products/def456.jpg"
  ]
}
```

### Automatic Optimizations:
- ✅ **Compression**: Quality auto-optimized
- ✅ **Format**: Auto-converts to WebP/AVIF when supported
- ✅ **Resizing**: Max 800x800px to reduce file size
- ✅ **CDN**: Served from Cloudinary's global CDN
- ✅ **HTTPS**: Secure URLs only

---

## Backward Compatibility

### Existing Products Keep Working:
- ✅ Unsplash URLs remain unchanged
- ✅ Old base64 images work (if already saved)
- ✅ Mixed sources supported in same database

Example product with mixed sources:
```javascript
{
  _id: "123",
  name: "Office Chair",
  images: [
    // Cloudinary (new)
    "https://res.cloudinary.com/dgabcd/image/upload/v123/products/chair1.jpg",
    // Unsplash (existing - still works!)
    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800"
  ]
}
```

---

## Duplicate Prevention

Products are now checked for duplicates **before** saving:

### Check Logic:
- **Name** (case-insensitive) + **Category** (case-insensitive)

### Example:
```javascript
// First product
{ name: "Gaming Chair", category: "Office" } // ✅ Saved

// Duplicate attempt
{ name: "Gaming Chair", category: "Office" } // ❌ Rejected (409 error)
{ name: "GAMING CHAIR", category: "office" } // ❌ Rejected (same, case-insensitive)

// Different category (allowed)
{ name: "Gaming Chair", category: "Home" } // ✅ Saved
```

### Response on Duplicate:
```json
{
  "success": false,
  "message": "Duplicate product detected: \"Gaming Chair\" already exists in category \"Office\". Please use a different name or category."
}
```

---

## Error Handling

### If Cloudinary Upload Fails:
- ✅ Falls back to original images (base64 or URLs)
- ✅ Product still saves successfully
- ✅ Error logged but not shown to user

### If Credentials Missing:
- Server won't crash
- Image upload attempts will fail
- Fallback to original images

---

## Testing Checklist

- [ ] Add Cloudinary credentials to `.env`
- [ ] Restart backend server
- [ ] Upload new product with images
- [ ] Check Cloudinary dashboard for uploaded images
- [ ] Verify product displays correctly with Cloudinary URLs
- [ ] Test duplicate product (same name + category) - should reject
- [ ] Verify existing Unsplash products still load
- [ ] Test mixed image sources (Cloudinary + Unsplash)

---

## Troubleshooting

### Images not uploading to Cloudinary:
1. Check `.env` credentials are correct
2. Verify Cloudinary account is active
3. Check server logs for errors
4. Test credentials with Cloudinary API directly

### Frontend still shows base64 previews:
- **This is normal!** Frontend converts files to base64 for preview
- Backend receives base64, uploads to Cloudinary, returns URL
- Database stores Cloudinary URLs, not base64

### Mixed images (some Cloudinary, some not):
- **This is normal!** Backward compatibility allows mixed sources
- Old products keep their URLs
- New products use Cloudinary
