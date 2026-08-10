import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      _count: { select: { submissions: true, members: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Campaigns</h1>
          <p className="text-[#9ca3af]">Manage all campaigns</p>
        </div>
        <Link href="/admin/campaigns/new">
          <Button>Create Campaign</Button>
        </Link>
      </div>

      {/* Table */}
      <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>CPM</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium text-white">
                    {campaign.title}
                  </TableCell>
                  <TableCell className="text-[#9ca3af]">
                    {formatCurrency(campaign.totalBudget)}
                  </TableCell>
                  <TableCell className="text-[#9ca3af]">
                    ${campaign.cpmRate.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === "ACTIVE" ? "success" : "secondary"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-white">
                    {campaign._count.submissions}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/campaigns/${campaign.id}`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
