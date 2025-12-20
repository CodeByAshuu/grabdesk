# Complete Integration Test Guide

## Prerequisites

✅ Backend dependencies installed (`socket.io`)
✅ Frontend dependencies installed (`socket.io-client`)
✅ MongoDB running
✅ CSV file ready: `server/products-bulk-upload.csv`

---

## Step 1: Start Backend Server

```bash
cd server
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Socket.IO ready at /activity namespace
MongoDB connected
```

---

## Step 2: Start Frontend Client

```bash
cd client
npm run dev
```

**Expected:** Frontend runs on `http://localhost:3000`

---

## Step 3: Test Product Bulk Upload

1. **Open Admin Dashboard** → Navigate to Product Management
2. **Click "Upload CSV"** or "Bulk Upload" button
3. **Select file**: `server/products-bulk-upload.csv`
4. **Submit**

**Expected Results:**
- ✅ 50 products imported successfully
- ✅ Activity log appears: "Bulk upload: 50 products added to inventory"
- ✅ Products display in product list with Unsplash images
- ✅ No 404 errors in console

---

## Step 4: Test Activity Logs Real-Time

1. **Open Admin Dashboard** → Activity Logs section
2. **Keep Activity Logs visible**
3. **Perform actions in different tabs/windows:**

### Test Actions:
```bash
# Option A: Use test script
cd server
node test-activity-logs.js
```

### Test Actions (Manual):
- **Add a product** → Should show: "Product '[name]' added to inventory"
- **Update order status** → Should show: "Order #[id] status updated to [status]"
- **Login** → Should show: "User logged in: [email]"
- **Register new user** → Should show: "New user registered: [email]"

**Expected:**
- ✅ Logs appear **instantly** in Activity Logs section
- ✅ Smooth auto-scroll to bottom
- ✅ Timestamp format: "HH:MM:SS AM/PM"
- ✅ No page refresh needed

---

## Step 5: Test WebSocket Fallback

1. **Stop backend server** (Ctrl+C)
2. **Wait 15 seconds**
3. **Restart server**: `npm run dev`

**Expected:**
- ✅ Polling kicks in automatically
- ✅ Latest logs sync every 15 seconds
- ✅ WebSocket reconnects when server restarts
- ✅ Console shows: "Connected to activity logs via Socket.IO"

---

## Step 6: Verify Product Display

1. **Navigate to Products page** (user-facing)
2. **Check images load correctly**

**Expected:**
- ✅ All 50 products visible
- ✅ Unsplash images load perfectly
- ✅ No broken image icons
- ✅ Product details display correctly (name, price, category, tags)

---

## Step 7: Test CSV Import Edge Cases

### Test 1: Empty CSV
**Create**: `test-empty.csv` with header only
**Expected**: Error message "No products provided"

### Test 2: Invalid Data
**Create**: CSV with missing required fields
**Expected**: Partial import with failures reported

### Test 3: Duplicate Products
**Upload** same CSV twice
**Expected**: SKU conflict errors for duplicates

---

## Troubleshooting

### Error: "Failed to load resource: 404 (Not Found)"
**Solution**: Ensure backend is running and route exists in `admin.routes.js`

### Error: "401 Unauthorized" on wishlist
**Solution**: This is expected if user not logged in. Ignore or implement auth.

### Images Not Loading
**Check**: Network tab → Verify Unsplash URLs return 200
**Solution**: If blocked, check CORS or firewall

### Activity Logs Not Updating
**Check**: 
1. WebSocket connection: Console should show "Connected to activity logs"
2. Backend logs: Should show "Client connected to activity logs"
3. Socket.IO working: Visit `http://localhost:5000` should not 404

---

## Success Criteria Checklist

### Bulk Upload ✅
- [ ] CSV file uploads successfully
- [ ] 50 products imported
- [ ] Tags transformed correctly  
- [ ] Images are valid Unsplash URLs
- [ ] Activity log emitted

### Activity Logs ✅
- [ ] Real-time updates working
- [ ] Auto-scroll functioning
- [ ] Dummy logs visible initially
- [ ] Backend logs append after dummy
- [ ] WebSocket fallback works
- [ ] Polling works when offline

### Product Display ✅
- [ ] Products display with images
- [ ] Unsplash images load
- [ ] Product data accurate
- [ ] Filtering/search works

---

## Next Steps After Testing

1. **Deploy to production**
2. **Add bulk delete/update** (optional)
3. **Enable authentication** in admin routes
4. **Restrict CORS origins** for Socket.IO in production
5. **Add activity log filtering** by type/date

---

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:5000/api/health

# Test activity logs endpoint
curl http://localhost:5000/api/admin/activity-logs

# Test product count
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGO_URI).then(() => { const Product = require('./models/Product.model'); Product.countDocuments().then(count => { console.log('Products:', count); process.exit(0); }); });"
```

**Expected Product Count:** 50+ (after bulk upload)

---

## Demo Flow (For Presentation)

1. **Start servers** (backend + frontend)
2. **Open two browser windows side by side**:
   - Window 1: Admin Dashboard → Activity Logs
   - Window 2: Admin Dashboard → Product Management
3. **Upload CSV** in Window 2
4. **Watch Activity Logs** update in Window 1 (instant!)
5. **Add a manual product** in Window 2
6. **See log appear** instantly in Window 1
7. **Navigate to Products page** → Show 50+ products with images

🎉 **Success!** Real-time activity logging is fully functional!
