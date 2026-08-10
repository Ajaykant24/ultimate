"use client"

import { useEffect, useState } from "react"
import { Users, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatViews } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface User {
  id: string
  username: string
  avatarUrl?: string
  followers: number
  views: number
  pageCount: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const query = search ? `?search=${search}` : ""
        const res = await fetch(`/api/users${query}`)
        const data = await res.json()
        setUsers(data.users)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchUsers()
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="p-6 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1a1c1c] to-[#0f1010] border border-[#2a2d2d] rounded-xl p-8 text-center">
        <Badge variant="outline" className="mb-4">
          Community Directory
        </Badge>
        <h1 className="text-4xl font-bold text-white mb-2">
          Meet the <span className="text-[#84cc16]">Community</span>
        </h1>
        <p className="text-[#9ca3af] mb-6">
          Browse all users on the platform and explore their profiles.
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 py-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#84cc16]">74,174</p>
            <p className="text-sm text-[#9ca3af]">👥 Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#84cc16]">89.6K</p>
            <p className="text-sm text-[#9ca3af]">📱 Pages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#84cc16]">2.3B</p>
            <p className="text-sm text-[#9ca3af]">⭐ Followers</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md mx-auto px-4 py-2 bg-[#1a1c1c] border border-[#2a2d2d] rounded-md text-white placeholder-[#9ca3af] focus:border-[#84cc16] outline-none"
        />
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-[#9ca3af] mb-4">
          Showing {users.length} users
        </p>

        {loading ? (
          <div className="text-center text-[#9ca3af]">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-[#9ca3af] py-12">
            No users found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Link key={user.id} href={`/users/${user.username}`}>
                <Card className="border-[#2a2d2d] bg-[#1a1c1c] hover:border-[#84cc16] transition-colors h-full cursor-pointer">
                  {/* Banner */}
                  <div className="h-24 bg-gradient-to-r from-[#84cc16]/20 to-[#222424] rounded-t-xl" />

                  <CardContent className="p-6 relative">
                    {/* Avatar */}
                    <div className="absolute -top-8 left-6">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.username}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full border-4 border-[#1a1c1c]"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[#84cc16] flex items-center justify-center text-black font-bold text-2xl border-4 border-[#1a1c1c]">
                          {user.username[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{user.username}</h3>
                        <Badge variant="default" className="text-xs">
                          {user.followers.toLocaleString()} followers
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4 text-sm text-[#9ca3af]">
                        <div>
                          <p className="text-[#84cc16] font-semibold">
                            {formatViews(user.views)}
                          </p>
                          <p className="text-xs">Views</p>
                        </div>
                        <div>
                          <p className="text-[#84cc16] font-semibold">
                            {user.pageCount}
                          </p>
                          <p className="text-xs">Pages</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
