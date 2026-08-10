"use client"

import Image from "next/image"
import Link from "next/link"
import { Bookmark, DollarSign, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { formatCurrency, formatViews } from "@/lib/utils"
import { PlatformBadge } from "@/components/shared/PlatformBadge"
import { Platform } from "@/types"

interface CampaignCardProps {
  campaign: {
    id: string
    slug: string
    title: string
    posterUrl?: string | null
    totalBudget: number
    cpmRate: number
    platforms: Array<{ platform: any }>
    isJoined?: boolean
  }
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/campaigns/${campaign.slug}`}>
        <div className="w-[220px] h-[280px] rounded-xl overflow-hidden relative group cursor-pointer">
          {/* Background Image */}
          {campaign.posterUrl ? (
            <Image
              src={campaign.posterUrl}
              alt={campaign.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-[#222424] to-[#1a1c1c]" />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

          {/* Bookmark (if joined) */}
          {campaign.isJoined && (
            <div className="absolute top-3 left-3">
              <Bookmark
                size={24}
                className="fill-[#84cc16] text-[#84cc16]"
              />
            </div>
          )}

          {/* Platform Badges (top right) */}
          <div className="absolute top-3 right-3 flex gap-1">
            {campaign.platforms.map((p) => (
              <PlatformBadge key={p.platform} platform={p.platform} size="sm" />
            ))}
          </div>

          {/* Title (center) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white font-bold text-center px-4 text-sm uppercase">
              {campaign.title}
            </h3>
          </div>

          {/* Budget (bottom left) */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs">
            <DollarSign size={14} />
            <span>{formatCurrency(campaign.totalBudget)}</span>
          </div>

          {/* CPM Rate (bottom right) */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-xs">
            <Eye size={14} />
            <span>${campaign.cpmRate.toFixed(2)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
