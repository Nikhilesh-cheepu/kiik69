# 🚀 Railway Deployment Guide for KIIK 69

## 📋 **Prerequisites**
- GitHub account
- KIIK 69 repository pushed to GitHub
- Railway account (free)

## 🎯 **Step-by-Step Railway Setup**

### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign in with GitHub
4. Authorize Railway to access your repositories

### **Step 2: Create New Project**
1. Click "Deploy from GitHub repo"
2. Select your `kiik69` repository
3. Railway will automatically detect the project structure

### **Step 3: Configure Backend Service**
1. **Service Name:** `kiik69-backend`
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`

### **Step 4: Add PostgreSQL Database**
1. Click "New Service" in your project
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL database
4. **Copy the connection string** (looks like: `postgresql://...`)

### **Step 5: Set Environment Variables**
In your Railway project settings, add these variables:

```
DATABASE_URL=postgresql://your-connection-string-from-step-4
NODE_ENV=production
JWT_SECRET=kiik69-super-secret-production-key-2024
FRONTEND_URL=https://yourdomain.com
PORT=5001
```

### **Step 6: Deploy**
1. Railway will automatically deploy when you push to GitHub
2. Or click "Deploy" manually
3. Wait for build to complete (2-3 minutes)

## 🔧 **Railway Configuration**

### **Automatic Deployment:**
- Railway watches your GitHub repository
- Deploys automatically on every push to `main` branch
- You can also deploy manually from Railway dashboard

### **Environment Variables:**
Railway will automatically provide:
- `PORT` - Railway assigns this
- `DATABASE_URL` - PostgreSQL connection string
- `RAILWAY_STATIC_URL` - Your service URL

### **Custom Domain:**
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Configure DNS records

## 📊 **Database Migration**

### **From Local SQLite to Railway PostgreSQL:**
1. **Export current data:**
```bash
sqlite3 backend/data/kiik69.db ".dump" > backup.sql
```

2. **Import to Railway PostgreSQL:**
```bash
# Get your Railway PostgreSQL URL from dashboard
psql "your-railway-postgresql-url" < backup.sql
```

3. **Or start fresh:**
- Railway will automatically create tables
- Sample data will be inserted automatically

## 🌐 **Testing Your Railway Deployment**

### **1. Health Check:**
```bash
curl https://your-railway-url.railway.app/api/health
```

### **2. API Endpoints:**
- Menu: `https://your-railway-url.railway.app/api/menu`
- Events: `https://your-railway-url.railway.app/api/events`
- Gallery: `https://your-railway-url.railway.app/api/gallery`

### **3. Admin Login:**
- Use admin panel on your website
- Credentials: `admin` / `admin123`

## 🔍 **Railway Dashboard Features**

### **Monitoring:**
- Real-time logs
- Performance metrics
- Error tracking
- Resource usage

### **Database Management:**
- PostgreSQL admin interface
- Data browser
- Query editor
- Backup management

### **Environment Management:**
- Environment variables
- Secrets management
- Service configuration

## 🚨 **Troubleshooting**

### **Build Failures:**
1. Check Railway logs
2. Verify `package.json` in backend directory
3. Ensure all dependencies are listed
4. Check Node.js version compatibility

### **Database Connection Issues:**
1. Verify `DATABASE_URL` format
2. Check SSL settings
3. Ensure database service is running
4. Test connection locally first

### **Environment Variables:**
1. Check all required variables are set
2. Verify `NODE_ENV=production`
3. Ensure `JWT_SECRET` is strong
4. Update `FRONTEND_URL` to your domain

## 💰 **Railway Pricing**

### **Free Tier:**
- ✅ 500 hours/month
- ✅ 1GB RAM
- ✅ 1GB storage
- ✅ PostgreSQL database
- ✅ Custom domains
- ✅ SSL certificates

### **Pro Plan ($5/month):**
- ✅ Unlimited hours
- ✅ 2GB RAM
- ✅ 10GB storage
- ✅ Priority support

## 🔗 **Useful Links**

- **Railway Dashboard:** [railway.app/dashboard](https://railway.app/dashboard)
- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **PostgreSQL Docs:** [postgresql.org/docs](https://postgresql.org/docs)

## 🎉 **Success Checklist**

- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Backend service deployed
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] Health check passes
- [ ] Admin login works
- [ ] API endpoints respond
- [ ] Custom domain configured (optional)

---

**🚀 Your KIIK 69 backend will be live on Railway with a reliable cloud database!** 