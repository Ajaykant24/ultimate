"use client"

import { useEffect, useState } from "react"
import { Trophy, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatViews, formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface LeaderboardUser {
  rank: number
  id: string
  username: string
  avatarUrl?: string
  followers: number
  views: number
  earned: number
  pageCount: number
}

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<"views" | "followers" | "paid">("views")
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/leaderboard?sortBy=${sortBy}`)
        const data = await res.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [sortBy])

  const topThree = users.slice(0, 3)
  const remaining = users.slice(3)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="text-[#84cc16]" size={32} />
          <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
        </div>
        <p className="text-[#9ca3af]">Top creators across the platform</p>

        {/* Sort Tabs */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {(["views", "followers", "paid"] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                sortBy === sort
                  ? "bg-[#84cc16] text-black"
                  : "bg-[#1a1c1c] text-white hover:bg-[#222424]"
              }`}
            >
              {sort === "views" && "Views"}
              {sort === "followers" && "Followers"}
              {sort === "paid" && "Paid"}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* 2nd Place */}
          {topThree[1] && (
            <PodiumCard user={topThree[1]} rank={2} height="h-64" />
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <PodiumCard user={topThree[0]} rank={1} height="h-80" highlight />
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <PodiumCard user={topThree[2]} rank={3} height="h-56" />
          )}
        </div>
      )}

      {/* Rankings Table */}
      {remaining.length > 0 && (
        <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#2a2d2d]">
                  <TableHead>Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">
                    {sortBy === "views" && "Views"}
                    {sortBy === "followers" && "Followers"}
                    {sortBy === "paid" && "Earned"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {remaining.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-[#222424] cursor-pointer"
                  >
                    <TableCell className="text-[#9ca3af]">#{user.rank}</TableCell>
                    <TableCell>
                      <Link href={`/users/${user.username}`}>
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <Image
                              src={user.avatarUrl}
                              alt={user.username}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#84cc16] flex items-center justify-center text-black font-bold text-xs">
                              {user.username[0]?.toUpperCase()}
                            </div>
                          )}
                          <span className="text-white">{user.username}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right text-[#84cc16] font-semibold">
                      {sortBy === "views" && formatViews(user.views)}
                      {sortBy === "followers" && formatViews(user.followers)}
                      {sortBy === "paid" && formatCurrency(user.earned)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {loading && <div className="text-center text-[#9ca3af]">Loading...</div>}
    </div>
  )
}

interface PodiumCardProps {
  user: LeaderboardUser
  rank: 1 | 2 | 3
  height: string
  highlight?: boolean
}

function PodiumCard({ user, rank, height, highlight }: PodiumCardProps) {
  const medalColors = {
    1: "bg-[#84cc16]",
    2: "#64748b",
    3: "#a78bfa",
  }

  return (
    <div className={`flex flex-col items-center ${height}`}>
      {highlight && (
        <div className="w-32 h-32 mb-4 rounded-full border-4 border-[#84cc16] shadow-lg shadow-[#84cc16]/50 overflow-hidden">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.username}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#84cc16] flex items-center justify-center text-black font-bold text-4xl">
              {user.username[0]?.toUpperCase()}
            </div>
          )}
        </div>
      )}

      <Card className={`w-full border-[#2a2d2d] flex-1 flex flex-col ${highlight ? "bg-[#1a1c1c] border-[#84cc16]" : "bg-[#1a1c1c]"}`}>
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="text-center mb-auto">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto ${
                rank === 1
                  ? "bg-[#84cc16] text-black"
                  : rank === 2
                    ? "bg-[#64748b]"
                    : "bg-[#a78bfa]"
              }`}
            >
              {rank}
            </div>

            {!highlight && (
              <div className="mb-3">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.username}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#84cc16] flex items-center justify-center text-black font-bold text-2xl mx-auto mb-2">
                    {user.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            )}

            <h3 className="text-white font-bold text-sm mb-2">{user.username}</h3>

            <div className="space-y-1 text-xs text-[#9ca3af]">
              <p>
                <span className="text-[#84cc16]">{formatViews(user.views)}</span> Views
              </p>
              <p>
                <span className="text-[#84cc16]">{formatViews(user.followers)}</span> Followers
              </p>
              <p>
                <span className="text-[#84cc16]">{formatCurrency(user.earned)}</span> Earned
              </p>
              <p className="text-[#9ca3af] text-xs">{user.pageCount} Pages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
