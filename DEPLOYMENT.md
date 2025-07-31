# 🚀 KIIK 69 Deployment Guide

## 🌐 **Cloud Database Setup (Railway - FREE)**

### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (free)
3. Create a new project

### **Step 2: Add PostgreSQL Database**
1. Click "New Service" → "Database" → "PostgreSQL"
2. Railway will create a PostgreSQL database
3. Copy the connection string (looks like: `postgresql://...`)

### **Step 3: Set Environment Variables**
Add these to your Railway project:
```
DATABASE_URL=postgresql://your-connection-string
NODE_ENV=production
JWT_SECRET=your-super-secret-key-here
FRONTEND_URL=https://yourdomain.com
```

## 🎯 **Deployment Options**

### **Option 1: Railway (Recommended - FREE)**
**Backend + Database:**
1. Connect your GitHub repo to Railway
2. Railway will auto-deploy your backend
3. Add PostgreSQL database service
4. Set environment variables

**Frontend:**
1. Build: `npm run build`
2. Deploy to Vercel/Netlify (free)

### **Option 2: Render (FREE)**
**Backend:**
1. Go to [render.com](https://render.com)
2. Connect GitHub repo
3. Create Web Service
4. Add PostgreSQL database

**Frontend:**
1. Create Static Site
2. Connect to your repo
3. Build command: `npm run build`
4. Publish directory: `dist`

### **Option 3: DigitalOcean (PAID)**
1. Create Droplet ($5/month)
2. Install Node.js, PostgreSQL
3. Deploy backend and frontend
4. Set up domain and SSL

## 🔧 **Local Testing with Cloud DB**

To test with cloud database locally:

1. **Get Railway PostgreSQL URL**
2. **Create `.env` file:**
```env
DATABASE_URL=postgresql://your-railway-connection-string
NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

3. **Restart backend:**
```bash
cd backend
npm run dev
```

## 📊 **Database Migration**

### **From SQLite to PostgreSQL:**
The backend automatically detects and uses:
- **SQLite** when `DATABASE_URL` is not set (development)
- **PostgreSQL** when `DATABASE_URL` is set (production)

### **Data Transfer:**
1. Export SQLite data:
```bash
sqlite3 backend/data/kiik69.db ".dump" > backup.sql
```

2. Import to PostgreSQL (if needed):
```bash
psql $DATABASE_URL < backup.sql
```

## 🌍 **Domain Setup**

### **1. Buy Domain** (Namecheap, GoDaddy, etc.)
### **2. Configure DNS:**
- Point to your hosting provider
- Add SSL certificate

### **3. Update Frontend API URL:**
```javascript
// In src/services/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://yourdomain.com/api'  // Your domain
  : 'http://localhost:5001/api';  // Local development
```

## 💰 **Cost Breakdown**

### **FREE Tier (Recommended):**
- **Railway:** Backend + Database (free tier)
- **Vercel:** Frontend hosting (free)
- **Domain:** $10-15/year
- **Total:** ~$15/year

### **PAID Options:**
- **DigitalOcean:** $5-10/month
- **AWS:** Pay per use
- **Google Cloud:** Pay per use

## 🔒 **Security Checklist**

### **Production Environment:**
- [ ] Strong JWT_SECRET
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Environment variables set
- [ ] Database backups enabled
- [ ] SSL certificate installed

### **Admin Security:**
- [ ] Change default admin password
- [ ] Use strong passwords
- [ ] Enable 2FA (if available)
- [ ] Regular security updates

## 📱 **Testing Your Deployment**

### **1. Health Check:**
```bash
curl https://yourdomain.com/api/health
```

### **2. Admin Login:**
- Go to your website
- Use admin panel
- Login with: `admin` / `admin123`

### **3. API Endpoints:**
- Menu: `https://yourdomain.com/api/menu`
- Events: `https://yourdomain.com/api/events`
- Gallery: `https://yourdomain.com/api/gallery`

## 🚨 **Troubleshooting**

### **Database Connection Issues:**
1. Check `DATABASE_URL` format
2. Verify SSL settings
3. Test connection locally first

### **CORS Errors:**
1. Update `FRONTEND_URL` in environment
2. Check domain configuration
3. Verify API endpoints

### **File Upload Issues:**
1. Check upload directory permissions
2. Verify file size limits
3. Test with smaller files first

## 📞 **Support**

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **PostgreSQL Docs:** [postgresql.org/docs](https://postgresql.org/docs)

---

**🎉 Your KIIK 69 website will be live on the internet with a reliable cloud database!** 