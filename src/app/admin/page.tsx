import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/shared/StatCard"
import { formatCurrency, formatViews } from "@/lib/utils"
import { Users, Megaphone, FileText, DollarSign } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const [totalUsers, totalCampaigns, totalSubmissions, totalPaidOut] = await Promise.all([
    prisma.user.count(),
    prisma.campaign.count(),
    prisma.submission.count(),
    prisma.earning.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
  ])

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-[#9ca3af]">Manage campaigns, users, and submissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={totalUsers.toLocaleString()}
          icon={<Users className="text-[#84cc16]" size={24} />}
        />
        <StatCard
          label="Total Campaigns"
          value={totalCampaigns.toLocaleString()}
          icon={<Megaphone className="text-[#84cc16]" size={24} />}
        />
        <StatCard
          label="Total Submissions"
          value={totalSubmissions.toLocaleString()}
          icon={<FileText className="text-[#84cc16]" size={24} />}
        />
        <StatCard
          label="Total Paid Out"
          value={formatCurrency(totalPaidOut._sum.amount || 0)}
          icon={<DollarSign className="text-[#84cc16]" size={24} />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/campaigns/new">
          <Button className="w-full">Create Campaign</Button>
        </Link>
        <Link href="/admin/campaigns">
          <Button variant="outline" className="w-full">
            Manage Campaigns
          </Button>
        </Link>
        <Link href="/admin/submissions">
          <Button variant="outline" className="w-full">
            Review Submissions
          </Button>
        </Link>
      </div>
    </div>
  )
}
