import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/shared/StatCard"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatViews, formatCurrency } from "@/lib/utils"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function MyActiveCampaignsPage() {
  const session = await auth()

  // Personal page: the shared layout no longer gates access, so guard here.
  if (!(session as any)?.user?.id) {
    redirect("/login")
  }

  const myCampaigns = await prisma.campaignMember.findMany({
    where: { userId: (session as any)?.user.id },
    include: {
      campaign: {
        include: {
          submissions: {
            where: { userId: (session as any)?.user.id },
          },
          _count: { select: { submissions: true } },
        },
      },
    },
  })

  const totalViews = myCampaigns.reduce(
    (sum, c) => sum + c.campaign.submissions.reduce((s, sub) => s + sub.viewCount, 0),
    0
  )

  const totalEarnings = myCampaigns.reduce(
    (sum, c) => sum + c.campaign.submissions.reduce((s, sub) => s + sub.earnedAmount, 0),
    0
  )

  const approvalRate = myCampaigns.length > 0
    ? (myCampaigns.reduce(
        (sum, c) => sum + c.campaign.submissions.filter((s) => s.status === "APPROVED").length,
        0
      ) / myCampaigns.reduce((sum, c) => sum + c.campaign.submissions.length, 0)) * 100
    : 0

  return (
    <div className="p-6 space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#9ca3af] mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-[#84cc16]">
                  {formatCurrency(totalEarnings)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9ca3af] mb-1">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {formatViews(totalViews)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9ca3af] mb-1">Approval Rate</p>
                <p className="text-2xl font-bold text-white">
                  {approvalRate.toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9ca3af] mb-1">Campaigns</p>
                <p className="text-2xl font-bold text-white">
                  {myCampaigns.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
          <CardHeader>
            <CardTitle className="text-base">Top Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {myCampaigns.length === 0 ? (
              <p className="text-sm text-[#9ca3af]">No campaigns joined yet</p>
            ) : (
              <div className="space-y-2 text-sm">
                {myCampaigns
                  .sort(
                    (a, b) =>
                      b.campaign.submissions.reduce((s, sub) => s + sub.earnedAmount, 0) -
                      a.campaign.submissions.reduce((s, sub) => s + sub.earnedAmount, 0)
                  )
                  .slice(0, 3)
                  .map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span className="text-white truncate">
                        {c.campaign.title}
                      </span>
                      <span className="text-[#84cc16] font-semibold">
                        {formatCurrency(
                          c.campaign.submissions.reduce(
                            (s, sub) => s + sub.earnedAmount,
                            0
                          )
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      {myCampaigns.length > 0 ? (
        <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
          <CardHeader>
            <CardTitle>Your Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Submissions</TableHead>
                  <TableHead className="text-right">Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCampaigns.map((mc) => (
                  <TableRow key={mc.id}>
                    <TableCell>
                      <Link href={`/campaigns/${mc.campaign.slug}`}>
                        <span className="text-[#84cc16] hover:underline">
                          {mc.campaign.title}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          mc.campaign.status === "ACTIVE" ? "success" : "secondary"
                        }
                      >
                        {mc.campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {mc.campaign.submissions.length}
                    </TableCell>
                    <TableCell className="text-right text-[#84cc16] font-semibold">
                      {formatCurrency(
                        mc.campaign.submissions.reduce(
                          (sum, s) => sum + s.earnedAmount,
                          0
                        )
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
          <CardContent className="p-12 text-center">
            <p className="text-[#9ca3af] mb-4">You haven't joined any campaigns yet</p>
            <Link href="/campaigns">
              <span className="text-[#84cc16] hover:underline">
                Browse campaigns →
              </span>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
