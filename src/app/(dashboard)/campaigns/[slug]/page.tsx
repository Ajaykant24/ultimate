import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlatformBadge } from "@/components/shared/PlatformBadge"
import { StatCard } from "@/components/shared/StatCard"
import { ViewsChart } from "@/components/shared/ViewsChart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, DollarSign, Users, TrendingUp } from "lucide-react"
import { formatCurrency, formatViews, budgetProgress, formatSubmissionTime } from "@/lib/utils"
import Image from "next/image"

interface CampaignPageProps {
  params: Promise<{ slug: string }>
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { slug } = await params
  const session = await auth()

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      platforms: true,
      submissions: {
        include: { user: true, page: true },
        orderBy: { submittedAt: "desc" },
      },
      analytics: {
        orderBy: { date: "desc" },
        take: 30,
      },
      _count: { select: { submissions: true, members: true } },
    },
  })

  if (!campaign) {
    return <div className="p-6 text-white">Campaign not found</div>
  }

  const chartData = [...campaign.analytics]
    .reverse()
    .map((a) => ({
      date: new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: a.totalViews,
    }))

  const approvedCount = campaign.submissions.filter((s) => s.status === "APPROVED").length
  const pendingCount = campaign.submissions.filter((s) => s.status === "PENDING").length
  const deniedCount = campaign.submissions.filter((s) => s.status === "DENIED").length

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <p className="text-sm text-[#9ca3af]">Home &gt; {campaign.title}</p>
        <h1 className="text-4xl font-bold text-white">{campaign.title}</h1>
        <p className="text-sm text-[#9ca3af]">
          Created by: Ultimate •{" "}
          <span className="text-white">
            Launch Date: {new Date(campaign.launchDate).toLocaleDateString()}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Campaign Stats */}
              <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
                <CardHeader>
                  <CardTitle>Campaign Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StatCard
                    label="Today's Views"
                    value={formatViews(
                      campaign.analytics[0]?.totalViews || 0
                    )}
                    highlight
                  />
                  <ViewsChart data={chartData} height={250} />
                  <Button className="w-full">View Full Analytics</Button>
                </CardContent>
              </Card>

              {/* Campaign Overview */}
              <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
                <CardHeader>
                  <CardTitle>Campaign Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#84cc16]">
                        {approvedCount}
                      </p>
                      <p className="text-xs text-[#22c55e]">Approved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#f59e0b]">
                        {pendingCount}
                      </p>
                      <p className="text-xs text-[#f59e0b]">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#ef4444]">
                        {deniedCount}
                      </p>
                      <p className="text-xs text-[#ef4444]">Denied</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-[#2a2d2d]">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#9ca3af]">Budget</span>
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(campaign.totalBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#9ca3af]">Paid: {formatCurrency(campaign.paidOut)}</span>
                      <span className="text-[#84cc16]">
                        {formatCurrency(campaign.totalBudget - campaign.paidOut)} Remaining
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#222424] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#84cc16]"
                        style={{
                          width: `${budgetProgress(campaign.paidOut, campaign.totalBudget)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Submissions */}
              <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#84cc16] rounded-full animate-pulse" />
                    Live Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {campaign.submissions.slice(0, 10).map((submission) => (
                      <div key={submission.id} className="flex items-center gap-3 p-2 hover:bg-[#222424] rounded">
                        <PlatformBadge platform={submission.page.platform} size="sm" />
                        <div className="w-8 h-8 rounded-full bg-[#84cc16] flex items-center justify-center text-black text-xs font-bold">
                          {submission.user.username[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-white flex-1">
                          {submission.user.username}
                        </span>
                        <span className="text-xs text-[#9ca3af]">
                          {formatSubmissionTime(submission.submittedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white">
                    <strong>{campaign.description}</strong>
                  </p>
                  <div>
                    <p className="font-semibold text-white mb-2">
                      What we're looking for:
                    </p>
                    <ul className="list-disc list-inside text-sm text-[#9ca3af] space-y-1">
                      {campaign.whatWeLookingFor.split("•").map((item, i) => (
                        <li key={i}>{item.trim()}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-white font-semibold">
                    Must use <span className="text-[#84cc16]">{campaign.requiredHashtag}</span> on all posts
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rules Tab */}
            <TabsContent value="rules">
              <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
                <CardHeader>
                  <CardTitle>Campaign Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Payout Information</h3>
                    <ul className="list-decimal list-inside space-y-1 text-sm text-[#9ca3af]">
                      <li>CPM Rate: ${campaign.cpmRate.toFixed(2)} per 1,000 views</li>
                      <li>Maximum per creator: {formatCurrency(campaign.maxPerCreator)}</li>
                      <li>Maximum per video: {formatCurrency(campaign.maxPerVideo)}</li>
                      <li>Minimum views for payout: {campaign.minViewsForPayout.toLocaleString()}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Allowed Platforms</h3>
                    <div className="flex gap-2">
                      {campaign.platforms.map((p) => (
                        <PlatformBadge key={p.platform} platform={p.platform as any} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard">
              <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
                <CardHeader>
                  <CardTitle>Top Submitters</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead className="text-right">Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaign.submissions
                        .filter((s) => s.status === "APPROVED")
                        .sort((a, b) => b.viewCount - a.viewCount)
                        .slice(0, 20)
                        .map((submission, index) => (
                          <TableRow key={submission.id}>
                            <TableCell className="text-[#9ca3af]">
                              #{index + 1}
                            </TableCell>
                            <TableCell className="text-white">
                              {submission.user.username}
                            </TableCell>
                            <TableCell>
                              <PlatformBadge platform={submission.page.platform as any} size="sm" />
                            </TableCell>
                            <TableCell className="text-right text-[#84cc16]">
                              {formatViews(submission.viewCount)}
                            </TableCell>
                            <TableCell className="text-right text-[#84cc16]">
                              {formatCurrency(submission.earnedAmount)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
                <CardHeader>
                  <CardTitle>Campaign Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ViewsChart data={chartData} height={300} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Campaign Poster */}
          {campaign.posterUrl && (
            <div className="rounded-xl overflow-hidden border border-[#2a2d2d] relative">
              <Image
                src={campaign.posterUrl}
                alt={campaign.title}
                width={400}
                height={300}
                className="w-full h-auto"
              />
              <div className="absolute bottom-3 right-3">
                <Badge variant="success" className="animate-pulse">
                  Live
                </Badge>
              </div>
            </div>
          )}

          {/* Budget Section */}
          <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#9ca3af]">💼 Budget</span>
                <span className="text-[#84cc16] font-semibold">
                  {formatCurrency(campaign.totalBudget)}
                </span>
              </div>
              <div className="w-full h-2 bg-[#222424] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#84cc16]"
                  style={{
                    width: `${budgetProgress(campaign.paidOut, campaign.totalBudget)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#9ca3af]">
                <span>Paid: {formatCurrency(campaign.paidOut)}</span>
                <span>{formatCurrency(campaign.totalBudget - campaign.paidOut)} Remaining</span>
              </div>

              <div className="pt-2 border-t border-[#2a2d2d]">
                <p className="text-xs text-[#9ca3af] mb-1">Rate per 1k views ℹ️</p>
                <p className="font-semibold text-white">
                  ${campaign.cpmRate.toFixed(2)}
                </p>
              </div>

              <div className="pt-2 border-t border-[#2a2d2d]">
                <p className="text-xs text-[#9ca3af] mb-2">Accepted Platforms</p>
                <div className="flex gap-2">
                  {campaign.platforms.map((p) => (
                    <PlatformBadge key={p.platform} platform={p.platform as any} size="sm" />
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#2a2d2d] space-y-2">
                <StatCard
                  label="Total Views"
                  value={formatViews(
                    campaign.analytics.reduce((sum, a) => sum + a.totalViews, 0)
                  )}
                  highlight
                />
                <StatCard
                  label="Total Submissions"
                  value={campaign.submissions.length}
                />
              </div>

              {session ? (
                <Button className="w-full mt-4">Submit Video</Button>
              ) : (
                <Button asChild className="w-full mt-4">
                  <Link href={`/login?callbackUrl=/campaigns/${campaign.slug}`}>
                    Sign in to join
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
