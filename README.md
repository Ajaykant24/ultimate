# Ultimate - Performance-Based Influencer Marketing Platform

A complete full-stack SaaS application for influencer marketing where brands run video promotion campaigns and content creators earn money per verified view.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v3, shadcn/ui
- **Backend:** Next.js API Routes, NextAuth.js v4
- **Database:** PostgreSQL with Prisma ORM v7
- **Authentication:** NextAuth.js with Credentials provider
- **Charts:** Recharts for analytics visualization
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand + React Context
- **File Uploads:** UploadThing (configured, not yet integrated)
- **Icons:** Lucide React
- **Animations:** Framer Motion

## Features

### For Creators
- Browse available campaigns
- Join campaigns and submit videos
- Track earnings and view counts
- View detailed campaign statistics
- Personal dashboard with stats
- Join multiple campaigns simultaneously

### For Brands/Admins
- Create and manage campaigns with budget control
- Set CPM rates and submission requirements
- Review and approve/deny creator submissions
- Real-time analytics and campaign performance
- Payout management system
- User management

### Admin Dashboard
- User management and analytics
- Campaign creation and management
- Submission review and approval workflow
- Earnings and payout tracking
- Platform statistics

## Local Development

### Prerequisites
- Node.js 22+
- PostgreSQL 16+
- npm or yarn

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Ajaykant24/ultimate.git
cd ultimate
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ultimate"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# File Upload (UploadThing)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@email.com"
SMTP_PASS="your-app-password"
```

4. **Set up PostgreSQL:**
```bash
# Create database
createdb ultimate

# Run migrations
npx prisma migrate dev --name init

# Seed with test data
npx prisma db seed
```

5. **Start the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials

After seeding:
- **Admin:** the email and password set in `prisma/seed.ts`
- **Creator:** creator1@ultimate.com / password123

## Deployment on Vercel

### Prerequisites
- Vercel account (free or paid)
- GitHub repository linked to Vercel
- PostgreSQL database (Vercel Postgres recommended)

### Step 1: Create PostgreSQL Database

Use **Vercel Postgres** for easiest integration:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create** → **Postgres**
3. Follow the setup wizard and note the connection string

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to [Vercel New Project](https://vercel.com/new)
2. Import your GitHub repository
3. Select the `claude/ultimate-saas-build-i7vli3` branch
4. In Environment Variables, add:

```
DATABASE_URL=your-vercel-postgres-connection-string
NEXTAUTH_SECRET=generate-with: openssl rand -base64 32
NEXTAUTH_URL=https://your-app-name.vercel.app
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

5. Click **Deploy**

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add environment variables when prompted
```

### Step 3: Run Database Migrations

After deployment, run migrations on the production database:

```bash
DATABASE_URL="your-vercel-postgres-url" npx prisma migrate deploy
```

### Step 4: Seed Production Database (Optional)

To populate test data on production:

```bash
DATABASE_URL="your-vercel-postgres-url" npx tsx ./prisma/seed.ts
```

## Environment Variables

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | JWT signing secret (generate: `openssl rand -base64 32`) | Auto-generated 32-char string |
| `NEXTAUTH_URL` | Your app's URL | `https://ultimate-saas.vercel.app` |

### Optional (Currently Unused)

| Variable | Description |
|----------|-------------|
| `UPLOADTHING_SECRET` | File upload service secret |
| `UPLOADTHING_APP_ID` | File upload service app ID |
| `SMTP_HOST` | Email service hostname |
| `SMTP_PORT` | Email service port |
| `SMTP_USER` | Email service username |
| `SMTP_PASS` | Email service password |

## Project Structure

```
ultimate/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── (auth)/       # Login/register pages
│   │   ├── (dashboard)/  # Protected dashboard routes
│   │   ├── api/          # API routes
│   │   └── admin/        # Admin routes
│   ├── components/       # React components
│   │   ├── ui/          # shadcn components
│   │   ├── layout/      # Layout components
│   │   ├── campaigns/   # Campaign components
│   │   └── shared/      # Shared components
│   ├── lib/             # Utilities and helpers
│   └── types/           # TypeScript types
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Seed script
│   └── migrations/      # Database migrations
└── public/              # Static files
```

## Database Schema

### Key Models

- **User:** Creators and brands with roles (CREATOR, BRAND, ADMIN)
- **Campaign:** Video promotion campaigns with budget and CPM rates
- **CampaignMember:** Tracks which creators joined which campaigns
- **Submission:** Video submissions with view counts and approval status
- **Earning:** Payment tracking for approved submissions
- **Page:** Creator's social media accounts (TikTok, Instagram, Facebook)

## Available Routes

### Public
- `/login` - Login page
- `/register` - Registration page
- `/api/campaigns` - Campaign listing API

### Protected (Authenticated Users)
- `/` - Dashboard home
- `/campaigns` - Browse all campaigns
- `/campaigns/[slug]` - Campaign details with stats
- `/my-campaigns` - User's joined campaigns
- `/users` - Creator directory
- `/leaderboard` - Top creators by views/followers/earnings

### Admin Only
- `/admin` - Admin dashboard
- `/admin/campaigns` - Campaign management
- `/admin/submissions` - Submission review queue

## API Endpoints

### Public
- `GET /api/campaigns?status=ACTIVE&page=1&limit=20` - List campaigns
- `GET /api/campaigns/[slug]` - Get campaign details
- `GET /api/leaderboard?sortBy=views` - Get leaderboard
- `GET /api/users?search=term&page=1` - Search users

### Protected
- `POST /api/auth/register` - User registration
- `POST /api/campaigns/[id]/join` - Join campaign
- `POST /api/submissions` - Submit video

### Admin
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/[id]` - Update campaign
- `POST /api/submissions/[id]/approve` - Approve submission

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running (local) or accessible (remote)
- Check firewall rules for Vercel IP ranges

### NEXTAUTH_SECRET Not Set
```bash
# Generate a new secret
openssl rand -base64 32
```

### Migration Errors
```bash
# Check migration status
npx prisma migrate status

# Reset database (local only)
npx prisma migrate reset
```

## Performance Notes

- All dashboard pages use `export const dynamic = "force-dynamic"` to ensure fresh data for authenticated users
- API routes support pagination (default 20 items per page, max 100)
- Images are optimized via Next.js Image component
- Charts use client-side rendering to reduce server load

## License

MIT - Use freely for commercial or personal projects

## Support

For issues or questions, create an issue on the GitHub repository.
