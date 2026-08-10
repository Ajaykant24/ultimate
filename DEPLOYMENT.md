# Deployment Guide - Ultimate SaaS Platform

This guide will walk you through deploying Ultimate to Vercel with a PostgreSQL database.

## Prerequisites

- GitHub account with the repository linked
- Vercel account (free tier is sufficient)
- Vercel Postgres or external PostgreSQL database

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure all your code is committed and pushed to the `main` or your feature branch:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Set Up Database on Vercel

**Option A: Vercel Postgres (Recommended)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** → **Create** → **Postgres**
3. Name your database (e.g., "ultimate-db")
4. Select a region close to your users
5. Click **Create**
6. Copy the connection string (save it for later)

**Option B: External PostgreSQL**

If using your own PostgreSQL instance:
- Ensure it's accessible from the internet
- Note the connection string
- Whitelist Vercel's IP ranges if needed

### 3. Deploy to Vercel

#### Method A: Via Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Find and select your `ultimate` repository
5. Click **Import**

**Configure Project:**

- **Framework:** Next.js (auto-detected)
- **Root Directory:** ./ (leave as default)
- **Build Command:** `npm run build` (auto-filled)
- **Install Command:** `npm install` (auto-filled)

**Add Environment Variables:**

Click **Environment Variables** and add the following:

```
DATABASE_URL = postgresql://...  (your Vercel Postgres or external DB URL)
NEXTAUTH_SECRET = (generate below)
NEXTAUTH_URL = https://your-project-name.vercel.app
UPLOADTHING_SECRET = (leave empty for now)
UPLOADTHING_APP_ID = (leave empty for now)
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-gmail-app-password
```

**Generate NEXTAUTH_SECRET:**

Run this in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it in the `NEXTAUTH_SECRET` field.

**Save & Deploy:**

1. Click **Deploy**
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll see the URL in the success message

#### Method B: Via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to production:
```bash
vercel --prod
```

4. When prompted, add environment variables:
```
DATABASE_URL=your-database-url
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-deployed-url.vercel.app
```

### 4. Run Database Migrations

After deployment, you need to run Prisma migrations on your production database:

**Option A: Via Vercel Dashboard**

1. Click your project
2. Go to **Deployments** → latest deployment
3. Click the **Functions** tab to access the deployment environment
4. Or use the CLI method below

**Option B: Via CLI**

```bash
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

Replace `your-production-database-url` with your actual connection string.

### 5. Seed Production Database (Optional)

To populate test data on your production database:

```bash
DATABASE_URL="your-production-database-url" npx tsx ./prisma/seed.ts
```

This will create:
- 1 admin user: admin@ultimate.com / admin123
- 5 test creator accounts
- 8 sample campaigns with real data

⚠️ **Note:** Only do this on staging/test databases. For production, you may want to skip this.

### 6. Verify Deployment

Once deployed:

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Try logging in with test credentials:
   - Email: admin@ultimate.com
   - Password: admin123
3. Check that campaigns load on `/campaigns`
4. Test API: `https://your-project-name.vercel.app/api/campaigns`

## Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | ✅ Yes | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | ✅ Yes | `eB7k2mN5xQ9pL8wR3vJ6hF4` |
| `NEXTAUTH_URL` | ✅ Yes | `https://ultimate.vercel.app` |
| `UPLOADTHING_SECRET` | ❌ No | (optional, for file uploads) |
| `UPLOADTHING_APP_ID` | ❌ No | (optional, for file uploads) |
| `SMTP_HOST` | ❌ No | `smtp.gmail.com` |
| `SMTP_PORT` | ❌ No | `587` |
| `SMTP_USER` | ❌ No | `your-email@gmail.com` |
| `SMTP_PASS` | ❌ No | (Gmail app-specific password) |

## Troubleshooting

### Build Fails with "Cannot find module"

**Solution:** Make sure all dependencies are installed:
```bash
npm install
git add package-lock.json
git commit -m "Update lockfile"
git push
```

### Database Connection Error

**Check these:**
1. DATABASE_URL is copied correctly (no spaces)
2. Database is accessible from the internet
3. Firewall rules allow Vercel IPs
4. PostgreSQL is running and accepting connections

**Test connection:**
```bash
DATABASE_URL="your-url" npx prisma db execute --stdin < /dev/null
```

### NEXTAUTH_SECRET Not Set

**Solution:** Generate and set a new secret:
```bash
openssl rand -base64 32
```

Then update the environment variable in Vercel dashboard.

### Migration Errors

**Check status:**
```bash
DATABASE_URL="your-url" npx prisma migrate status
```

**View migration details:**
```bash
DATABASE_URL="your-url" npx prisma migrate resolve
```

### Page Loads But No Data Shows

**Solutions:**
1. Verify database migrations ran: `npx prisma migrate status`
2. Check API response: `curl https://your-app.vercel.app/api/campaigns`
3. View Vercel logs: Dashboard → Deployments → Functions

## After Deployment

### Monitor Performance

1. Go to Vercel Dashboard
2. Click your project
3. Check **Analytics** for performance metrics
4. Monitor **Function Logs** for API errors

### Update Environment Variables

To update env vars after deployment:

1. Go to Vercel Dashboard → Project Settings
2. Click **Environment Variables**
3. Edit or add variables
4. Click **Save**
5. Redeploy by pushing a commit to your branch

### Database Backups

For Vercel Postgres:
1. Go to Dashboard → Storage → your database
2. Click **Backups**
3. Create manual backups before major changes

## Custom Domain Setup

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to match your domain

## Performance Optimization

Current optimizations included:
- ✅ Protected routes use dynamic rendering (fresh data for each user)
- ✅ API pagination (default 20, max 100 items)
- ✅ Image optimization via Next.js
- ✅ CSS minification and tree-shaking
- ✅ Client-side charts for reduced server load

## Rollback

If deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find the previous stable deployment
3. Click **Promote to Production**

## Support & Troubleshooting

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/app/building-your-application/deploying
- **Prisma Docs:** https://www.prisma.io/docs/
- **NextAuth.js:** https://next-auth.js.org/

## Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Set strong NEXTAUTH_SECRET (32+ characters)
- [ ] Enable database backups
- [ ] Set up rate limiting on API routes
- [ ] Review environment variables (no secrets in code)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up monitoring and alerting

---

**Deployment complete!** Your Ultimate SaaS platform is now live. 🚀
