import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatViews, formatCurrency } from "@/lib/utils"

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    include: {
      user: true,
      campaign: true,
      page: true,
    },
    orderBy: { submittedAt: "desc" },
    take: 100,
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">Submissions</h1>
        <p className="text-[#9ca3af]">Review and approve/deny submissions</p>
      </div>

      {/* Table */}
      <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium text-white">
                    {submission.user.username}
                  </TableCell>
                  <TableCell className="text-[#9ca3af]">
                    {submission.campaign.title}
                  </TableCell>
                  <TableCell className="text-[#9ca3af]">
                    {submission.page.platform}
                  </TableCell>
                  <TableCell className="text-right text-[#84cc16]">
                    {formatViews(submission.viewCount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        submission.status === "APPROVED"
                          ? "success"
                          : submission.status === "PENDING"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {submission.status === "PENDING" && (
                        <>
                          <Button size="sm" variant="outline">
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            Deny
                          </Button>
                        </>
                      )}
                    </div>
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
