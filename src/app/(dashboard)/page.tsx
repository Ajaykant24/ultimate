import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatViews, formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/shared/StatCard"
import { CampaignCard } from "@/components/campaigns/CampaignCard"
import { Eye, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await auth()

  // The home dashboard is personal; send signed-out visitors to public browsing.
  if (!(session as any)?.user?.id) {
    redirect("/campaigns")
  }

  const [user, userCampaigns, activeCampaigns, userEarnings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: ((session as any)?.user)?.id },
      include: {
        pages: true,
        campaignJoins: true,
      },
    }),
    prisma.campaignMember.findMany({
      where: { userId: (session as any)?.user?.id },
      include: {
        campaign: {
          include: { platforms: true },
        },
      },
    }),
    prisma.campaign.findMany({
      where: { status: "ACTIVE" },
      take: 10,
      include: { platforms: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.earning.findMany({
      where: { userId: (session as any)?.user?.id },
    }),
  ])

  const totalViews = 0 // Would need submission data
  const totalEarnings = userEarnings.reduce((sum, e) => sum + e.amount, 0)
  const pendingEarnings = userEarnings
    .filter((e) => e.status === "PENDING")
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="p-6 space-y-8">
      {/* Profile Card */}
      <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#84cc16] flex items-center justify-center text-black font-bold text-2xl">
                {user?.username[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {user?.username}
                  <button className="ml-2 text-[#9ca3af] hover:text-white">
                    ✎
                  </button>
                </h1>
                <p className="text-sm text-[#9ca3af]">
                  Member since {user?.memberSince?.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </p>
                <Badge variant="outline" className="mt-2">
                  Approval Rate: N/A
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-right mb-6">
                <p className="text-xs text-[#9ca3af] mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-[#84cc16]">
                  {formatCurrency(totalEarnings)}
                </p>
                <p className="text-xs text-[#9ca3af] mt-2">
                  Pending Earnings {formatCurrency(pendingEarnings)}
                </p>
              </div>
              <Link href="/my-campaigns">
                <Button size="sm">My Campaigns →</Button>
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-4 mt-6 pt-6 border-t border-[#2a2d2d]">
            <div className="text-center flex-1">
              <p className="text-xs text-[#9ca3af] mb-1">Followers</p>
              <p className="text-xl font-bold text-white">
                {user?.pages
                  .reduce((sum, p) => sum + p.followersCount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="text-xs text-[#9ca3af] mb-1">Pages</p>
              <p className="text-xl font-bold text-white">{user?.pages.length} ℹ️</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-xs text-[#9ca3af] mb-1">Campaigns</p>
              <p className="text-xl font-bold text-white">{userCampaigns.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          label="Total Views"
          value={formatViews(totalViews)}
          icon={<Eye size={24} />}
          highlight
        />
        <StatCard
          label="Submissions"
          value="0"
          icon={<BarChart3 size={24} />}
        />
      </div>

      {/* Campaigns Section */}
      {userCampaigns.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Active Campaigns</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {userCampaigns
              .filter((c) => c.campaign.status === "ACTIVE")
              .map((c) => (
                <div key={c.id} className="flex-shrink-0">
                  <CampaignCard
                    campaign={{
                      ...c.campaign,
                      isJoined: true,
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Available Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Available Campaigns</h2>
          <Link href="/campaigns">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeCampaigns.slice(0, 4).map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={{
                ...campaign,
                isJoined: userCampaigns.some(
                  (c) => c.campaignId === campaign.id
                ),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
