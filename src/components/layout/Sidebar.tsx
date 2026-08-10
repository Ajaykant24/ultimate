"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Trophy,
  Megaphone,
  BarChart3,
  LogOut,
  Settings,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  const isAdminActive = pathname.startsWith("/admin")

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-56 bg-[#0f1010] border-r border-[#2a2d2d] z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-[#2a2d2d]">
        <div className="w-8 h-8 bg-[#84cc16] rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-sm">P</span>
        </div>
        <span className="text-white font-bold text-lg">Ultimate</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs text-[#9ca3af] uppercase font-semibold px-3 py-2">
          General
        </div>

        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors border-l-2",
            isActive("/") && !isAdminActive
              ? "border-[#84cc16] bg-[#1a1c1c] text-white"
              : "border-transparent text-[#9ca3af] hover:text-white hover:bg-[#1a1c1c]"
          )}
        >
          <Home size={18} />
          <span>Home</span>
        </Link>

        <Link
          href="/users"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors border-l-2",
            isActive("/users")
              ? "border-[#84cc16] bg-[#1a1c1c] text-white"
              : "border-transparent text-[#9ca3af] hover:text-white hover:bg-[#1a1c1c]"
          )}
        >
          <Users size={18} />
          <span>Users</span>
        </Link>

        <Link
          href="/leaderboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors border-l-2",
            isActive("/leaderboard")
              ? "border-[#84cc16] bg-[#1a1c1c] text-white"
              : "border-transparent text-[#9ca3af] hover:text-white hover:bg-[#1a1c1c]"
          )}
        >
          <Trophy size={18} />
          <span>Leaderboard</span>
        </Link>

        <div className="text-xs text-[#9ca3af] uppercase font-semibold px-3 py-2 mt-6">
          Activity
        </div>

        <Link
          href="/campaigns"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors border-l-2",
            isActive("/campaigns")
              ? "border-[#84cc16] bg-[#1a1c1c] text-white"
              : "border-transparent text-[#9ca3af] hover:text-white hover:bg-[#1a1c1c]"
          )}
        >
          <Megaphone size={18} />
          <span>Campaigns</span>
        </Link>

        <Link
          href="/my-campaigns"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors border-l-2",
            isActive("/my-campaigns")
              ? "border-[#84cc16] bg-[#1a1c1c] text-white"
              : "border-transparent text-[#9ca3af] hover:text-white hover:bg-[#1a1c1c]"
          )}
        >
          <BarChart3 size={18} />
          <span>My Campaigns</span>
        </Link>

        {(session?.user as any)?.role === "ADMIN" && (
          <>
            <div className="text-xs text-[#9ca3af] uppercase font-semibold px-3 py-2 mt-6">
              Admin
            </div>

            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors border-l-2",
                isAdminActive
                  ? "border-[#84cc16] bg-[#1a1c1c] text-white"
                  : "border-transparent text-[#9ca3af] hover:text-white hover:bg-[#1a1c1c]"
              )}
            >
              <Settings size={18} />
              <span>Admin Panel</span>
            </Link>
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-[#2a2d2d] p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#9ca3af] hover:text-white hover:bg-[#1a1c1c] transition-colors"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}
