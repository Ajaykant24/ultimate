"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Megaphone, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f1010] border-t border-[#2a2d2d] flex items-center justify-around z-40">
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center gap-1 p-3 rounded-md transition-colors",
          isActive("/") && !pathname.startsWith("/campaigns")
            ? "text-[#84cc16]"
            : "text-[#9ca3af]"
        )}
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </Link>

      <Link
        href="/campaigns"
        className={cn(
          "flex flex-col items-center gap-1 p-3 rounded-md transition-colors",
          isActive("/campaigns") ? "text-[#84cc16]" : "text-[#9ca3af]"
        )}
      >
        <Megaphone size={24} />
        <span className="text-xs">Campaigns</span>
      </Link>

      <Link
        href="/leaderboard"
        className={cn(
          "flex flex-col items-center gap-1 p-3 rounded-md transition-colors",
          isActive("/leaderboard") ? "text-[#84cc16]" : "text-[#9ca3af]"
        )}
      >
        <Trophy size={24} />
        <span className="text-xs">Leaderboard</span>
      </Link>

      <Link
        href="/profile"
        className={cn(
          "flex flex-col items-center gap-1 p-3 rounded-md transition-colors",
          isActive("/profile") ? "text-[#84cc16]" : "text-[#9ca3af]"
        )}
      >
        <User size={24} />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  )
}
