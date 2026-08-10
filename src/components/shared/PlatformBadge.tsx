import { Music, Camera, Globe } from "lucide-react"
import { Platform } from "@/types"

interface PlatformBadgeProps {
  platform: Platform
  size?: "sm" | "md"
}

export function PlatformBadge({ platform, size = "md" }: PlatformBadgeProps) {
  const sizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8"
  const iconSize = size === "sm" ? 14 : 16

  return (
    <div className={`${sizeClass} rounded-full bg-white flex items-center justify-center`}>
      {platform === "TIKTOK" && (
        <Music size={iconSize} className="text-black" />
      )}
      {platform === "INSTAGRAM" && (
        <Camera size={iconSize} className="text-black" />
      )}
      {platform === "FACEBOOK" && (
        <Globe size={iconSize} className="text-black" />
      )}
    </div>
  )
}
