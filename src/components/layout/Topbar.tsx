"use client"

import { useSession, signOut } from "next-auth/react"
import { HelpCircle, Wallet, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import Image from "next/image"

export function Topbar() {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="hidden md:flex items-center justify-between h-16 px-6 bg-[#0f1010] border-b border-[#2a2d2d] fixed top-0 right-0 left-56 z-30">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* ALPHA Badge */}
        <Badge variant="warning">ALPHA</Badge>

        {/* Help Icon */}
        <button className="p-2 hover:bg-[#1a1c1c] rounded-md transition-colors text-[#9ca3af]">
          <HelpCircle size={20} />
        </button>

        {/* Wallet Chip */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1c1c] border border-[#2a2d2d]">
          <Wallet size={16} className="text-[#84cc16]" />
          <span className="text-[#84cc16] font-semibold">{formatCurrency(0)}</span>
        </div>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-[#1a1c1c] rounded-md transition-colors"
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#84cc16] flex items-center justify-center text-black font-bold text-sm">
                {session?.user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <ChevronDown size={16} className="text-[#9ca3af]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1c1c] border border-[#2a2d2d] rounded-lg shadow-lg z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-[#222424] text-white text-sm"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 hover:bg-[#222424] text-white text-sm"
              >
                Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2 hover:bg-[#222424] text-white text-sm border-t border-[#2a2d2d]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function Link({ href, children, className }: any) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
