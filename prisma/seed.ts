import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcryptjs from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await prisma.viewSnapshot.deleteMany()
  await prisma.campaignAnalytic.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.campaignMember.deleteMany()
  await prisma.campaignPlatform.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.page.deleteMany()
  await prisma.earning.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcryptjs.hash("24kantajay", 10)
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "kantajay381@gmail.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Create creator users
  const creators = []
  for (let i = 1; i <= 5; i++) {
    const creatorPassword = await bcryptjs.hash("password123", 10)
    const creator = await prisma.user.create({
      data: {
        username: `creator${i}`,
        email: `creator${i}@ultimate.com`,
        password: creatorPassword,
        role: "CREATOR",
        bio: `Content creator focused on trending videos`,
        avatarUrl: `https://i.pravatar.cc/150?img=${i}`,
      },
    })
    creators.push(creator)
  }

  // Create pages for creators
  const pages = []
  for (let i = 0; i < creators.length; i++) {
    const tiktokPage = await prisma.page.create({
      data: {
        userId: creators[i].id,
        platform: "TIKTOK",
        handle: `@creator${i + 1}`,
        followersCount: Math.floor(Math.random() * 500000) + 50000,
      },
    })
    pages.push(tiktokPage)

    if (i < 3) {
      const instagramPage = await prisma.page.create({
        data: {
          userId: creators[i].id,
          platform: "INSTAGRAM",
          handle: `creator${i + 1}`,
          followersCount: Math.floor(Math.random() * 300000) + 30000,
        },
      })
      pages.push(instagramPage)
    }
  }

  // Create campaigns
  const campaigns = []
  const campaignTitles = [
    "Summer Vibes 2024",
    "Tech Gadget Review Challenge",
    "Fitness Transformation",
    "Gaming Spotlight",
    "Food & Recipe Videos",
    "Fashion Trends",
    "DIY Project Series",
    "Music & Talent Showcase",
  ]

  for (let i = 0; i < campaignTitles.length; i++) {
    const campaign = await prisma.campaign.create({
      data: {
        title: campaignTitles[i],
        slug: campaignTitles[i]
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        description: `Join our ${campaignTitles[i]} campaign and showcase your creative content. We're looking for authentic and engaging videos that resonate with our audience.`,
        whatWeLookingFor: "Authentic content • High engagement • Creative approach • Original ideas",
        requiredHashtag: `#${campaignTitles[i].replace(/\s+/g, "")}`,
        posterUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?w=500&h=300&fit=crop`,
        totalBudget: Math.floor(Math.random() * 9000) + 1000,
        cpmRate: Math.random() * 1.25 + 1.25,
        maxPerCreator: Math.floor(Math.random() * 2000) + 1000,
        maxPerVideo: Math.floor(Math.random() * 300) + 100,
        minViewsForPayout: 1000,
        status: i % 3 === 0 ? "COMPLETED" : "ACTIVE",
        launchDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        endDate: i % 3 === 0 ? new Date() : null,
        createdById: admin.id,
        platforms: {
          create: [
            { platform: "TIKTOK" as const },
            { platform: "INSTAGRAM" as const },
            ...(Math.random() > 0.5 ? [{ platform: "FACEBOOK" as const }] : []),
          ],
        },
      },
    })
    campaigns.push(campaign)
  }

  // Create campaign members and submissions
  for (let i = 0; i < campaigns.length; i++) {
    const creatorSubset = creators.slice(0, Math.floor(Math.random() * 3) + 2)

    for (const creator of creatorSubset) {
      await prisma.campaignMember.create({
        data: {
          campaignId: campaigns[i].id,
          userId: creator.id,
        },
      })

      // Create 2-3 submissions per creator per campaign
      const submissionCount = Math.floor(Math.random() * 2) + 2
      for (let j = 0; j < submissionCount; j++) {
        const creatorPages = pages.filter((p) => p.userId === creator.id)
        const randomPage = creatorPages[Math.floor(Math.random() * creatorPages.length)]

        const viewCount = Math.floor(Math.random() * 500000) + 1000
        const earnedAmount = (viewCount / 1000) * campaigns[i].cpmRate
        const cappedEarning = Math.min(earnedAmount, campaigns[i].maxPerVideo)

        const submission = await prisma.submission.create({
          data: {
            campaignId: campaigns[i].id,
            userId: creator.id,
            pageId: randomPage.id,
            videoUrl: `https://tiktok.com/video/${Math.random().toString(36).slice(2)}`,
            status: ["APPROVED", "PENDING", "DENIED"][Math.floor(Math.random() * 3)] as "APPROVED" | "PENDING" | "DENIED",
            viewCount,
            earnedAmount: cappedEarning,
            submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          },
        })

        // Create view snapshots for last 7 days
        for (let d = 7; d >= 1; d--) {
          const snapshotDate = new Date()
          snapshotDate.setDate(snapshotDate.getDate() - d)

          const dailyViews = Math.floor(Math.random() * (viewCount / 7) * 1.5)

          await prisma.viewSnapshot.create({
            data: {
              submissionId: submission.id,
              viewCount: dailyViews,
              recordedAt: snapshotDate,
            },
          })
        }
      }
    }

    // Create daily analytics
    for (let d = 30; d >= 1; d--) {
      const analyticsDate = new Date()
      analyticsDate.setDate(analyticsDate.getDate() - d)

      const totalViews = Math.floor(Math.random() * 100000) + 10000

      await prisma.campaignAnalytic.create({
        data: {
          campaignId: campaigns[i].id,
          date: analyticsDate,
          totalViews,
        },
      })
    }
  }

  // Create earnings
  for (const creator of creators) {
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      await prisma.earning.create({
        data: {
          userId: creator.id,
          amount: Math.floor(Math.random() * 500) + 100,
          status: Math.random() > 0.3 ? "PAID" : "PENDING",
          description: `Earnings from campaign submission`,
        },
      })
    }
  }

  console.log("✅ Seeding completed successfully!")
  console.log("\n📝 Test Credentials:")
  console.log("   Admin: kantajay381@gmail.com / 24kantajay")
  console.log("   Creator: creator1@ultimate.com / password123")
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
