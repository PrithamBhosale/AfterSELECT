# AfterSELECT Deployment Guide

This guide will walk you through deploying AfterSELECT to GitHub, Vercel, and connecting your Hostinger domain.

## 📋 Pre-Deployment Checklist

- [x] Build passes without errors
- [x] All pages functional (Landing, Explore, Practice)
- [x] SEO meta tags configured
- [x] robots.txt and sitemap.xml ready
- [x] vercel.json configured for SPA routing
- [x] Favicon and logo assets included

---

## 🚀 Step 1: Push to GitHub (Public Repository)

### 1.1 Create a New GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `afterselect`
3. Description: `Interactive SQL learning platform - Practice SQL with 200+ hands-on challenges`
4. Set to **Public** (people can view but not edit/commit)
5. Do NOT initialize with README (we already have one)
6. Click **Create repository**

### 1.2 Push Your Code

Open terminal in your project directory and run:

```bash
# Make sure you're in the project directory
cd c:\Users\prith\Downloads\AfterSELECT

# Add remote (replace with your GitHub username)
git remote set-url origin https://github.com/PrithamBhosale/afterselect.git

# Add all files
git add .

# Commit
git commit -m "Initial release: AfterSELECT v1.0.0"

# Push to main branch
git push -u origin main
```

### ⚠️ Important: Repository Protection

Since it's a **public** repository:
- ✅ Anyone can **view** your code
- ❌ Only you can **edit/commit** (they would need to fork)
- Your live site will NOT be affected by others viewing

---

## 🔺 Step 2: Deploy to Vercel

### 2.1 Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your `afterselect` repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install`
5. Click **Deploy**

### 2.2 Verify Deployment

After deployment (~1-2 minutes):
- You'll get a URL like: `afterselect-yourname.vercel.app`
- Test all pages work correctly

---

## 🌐 Step 3: Connect Hostinger Domain

### 3.1 In Vercel: Add Custom Domain

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your domain: `afterselect.com` (or your chosen domain)
4. Vercel will show you DNS records to configure

### 3.2 In Hostinger: Configure DNS

1. Log in to [Hostinger](https://hpanel.hostinger.com)
2. Go to **Domains** → Select your domain
3. Click **DNS / Nameservers**
4. Choose one of these options:

**Option A: Use Vercel Nameservers (Recommended)**
- Set nameservers to:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`

**Option B: Keep Hostinger Nameservers**
- Add these DNS records:

| Type  | Name | Value                    | TTL   |
|-------|------|--------------------------|-------|
| A     | @    | 76.76.21.21             | 3600  |
| CNAME | www  | cname.vercel-dns.com.   | 3600  |

### 3.3 Wait for Propagation

DNS changes take **1-48 hours** to propagate globally.

---

## 🔍 Step 4: Google Search Console Setup

To make your site searchable on Google:

### 4.1 Verify Domain Ownership

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"**
3. Enter your domain: `afterselect.com`
4. Choose verification method:
   - **HTML file** (download and add to `public/` folder)
   - **or DNS record** (add TXT record in Hostinger)

### 4.2 Submit Sitemap

1. In Search Console, go to **"Sitemaps"**
2. Enter: `https://afterselect.com/sitemap.xml`
3. Click **Submit**

### 4.3 Request Indexing

1. Go to **"URL Inspection"**
2. Enter your homepage URL
3. Click **"Request Indexing"**

---

## 📊 SEO Tips for Better Google Visibility

1. **Share your site** on social media
2. **Create backlinks** from other sites (LinkedIn, Twitter, dev communities)
3. **Keep content fresh** - Google loves updated content
4. **Monitor performance** in Search Console

---

## 🔄 Automatic Deployments

Once set up:
- Every push to `main` branch triggers automatic deployment
- Changes go live within ~1 minute
- No manual deployment needed

---

## 📞 Support

If you encounter issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Hostinger: [hostinger.com/tutorials](https://www.hostinger.com/tutorials)
- GitHub: [docs.github.com](https://docs.github.com)

---

**Your AfterSELECT site is ready for the world! 🎉**
