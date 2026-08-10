import { prisma } from "@/lib/prisma"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CampaignGrid } from "@/components/campaigns/CampaignGrid"
import { Search, ChevronDown } from "lucide-react"

interface CampaignsPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    platform?: string
  }>
}

export default async function CampaignsPage({
  searchParams,
}: CampaignsPageProps) {
  const params = await searchParams
  const search = params.search || ""
  const sort = params.sort || "newest"
  const platform = params.platform || "all"

  const where: any = {
    status: "ACTIVE",
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  const campaigns = await prisma.campaign.findMany({
    where,
    include: { platforms: true },
    orderBy: sort === "budget" ? { totalBudget: "desc" } : { createdAt: "desc" },
    take: 100,
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Campaigns</h1>
        <p className="text-[#9ca3af]">Browse and join active campaigns</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-[#9ca3af]" size={20} />
          <Input
            type="text"
            placeholder="Search campaigns..."
            defaultValue={search}
            className="pl-10"
          />
        </div>
        <select
          defaultValue={sort}
          className="px-4 py-2 bg-[#1a1c1c] border border-[#2a2d2d] rounded-md text-white text-sm cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="budget">Highest Budget</option>
        </select>
        <select
          defaultValue={platform}
          className="px-4 py-2 bg-[#1a1c1c] border border-[#2a2d2d] rounded-md text-white text-sm cursor-pointer"
        >
          <option value="all">All Platforms</option>
          <option value="TIKTOK">TikTok</option>
          <option value="INSTAGRAM">Instagram</option>
          <option value="FACEBOOK">Facebook</option>
        </select>
      </div>

      {/* Section Heading */}
      <h2 className="text-xl font-bold text-white pt-4">Active</h2>

      {/* Campaigns Grid */}
      <CampaignGrid campaigns={campaigns} />

      {/* Completed Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white pt-8">Completed</h2>
        <div className="text-[#9ca3af] py-12 text-center">
          <p>No completed campaigns yet</p>
        </div>
      </div>
    </div>
  )
}
