import { CampaignCard } from "./CampaignCard"

interface CampaignGridProps {
  campaigns: Array<{
    id: string
    slug: string
    title: string
    posterUrl?: string | null
    totalBudget: number
    cpmRate: number
    platforms: Array<{ platform: any }>
    isJoined?: boolean
  }>
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#9ca3af]">No campaigns found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  )
}
