# 413 Payload Too Large - FIXED

## Problem
When uploading product images, the server returned:
```
413 Payload Too Large
```

## Root Cause
- Frontend converts images to **base64** strings for upload
- Base64 encoding increases file size by ~33%
- 3 images × ~2MB each = ~6MB base64 payload
- Express default limit: **100kb**
- Result: Request rejected

## Solution
Increased Express body parser limits in `server.js`:

```javascript
// Before (default 100kb)
app.use(express.json());

// After (50MB limit)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

## How to Apply
**⚠️ CRITICAL: Restart the backend server!**

```bash
# Terminal 1: Stop server (Ctrl+C) then restart
cd server
npm run dev
```

## Expected Result
- ✅ Product images upload successfully
- ✅ Base64 images accepted (up to 50MB)
- ✅ Cloudinary processes and compresses images
- ✅ Product saves with Cloudinary URLs

## About the 401 Errors
```
401 Unauthorized on /api/users/wishlist
```
- **This is EXPECTED** - requires authentication
- **NOT a bug** - wishlist is user-specific
- **Ignore it** - doesn't affect product uploads

## Test Steps
1. **Restart backend** (see above)
2. Open Admin Dashboard → Add Product
3. Upload 3 images
4. Click "Add Product"
5. **Expected**: Product added successfully! ✅
6. **Check**: Cloudinary dashboard → Media Library → "products" folder

## Why 50MB?
- Base64 encoding adds ~33% overhead
- 3 images × 5MB original = 15MB
- 15MB × 1.33 = ~20MB base64
- 50MB gives safe headroom
- Cloudinary compresses to much smaller size before saving

## Production Note
In production, consider:
- Client-side image compression before upload
- Direct browser → Cloudinary upload (no base64)
- Or keep 50MB limit (Cloudinary handles compression)
