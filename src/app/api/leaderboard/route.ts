import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const sortBy = searchParams.get("sortBy") || "views"

    let orderBy: any = {}

    if (sortBy === "followers") {
      orderBy = {
        pages: {
          _count: "desc",
        },
      }
    } else if (sortBy === "paid") {
      orderBy = {
        earnings: {
          _sum: {
            amount: "desc",
          },
        },
      }
    } else {
      // views
      orderBy = {
        submissions: {
          _sum: {
            viewCount: "desc",
          },
        },
      }
    }

    const users = await prisma.user.findMany({
      where: {
        role: "CREATOR",
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        memberSince: true,
        pages: {
          select: {
            followersCount: true,
          },
        },
        submissions: {
          select: {
            viewCount: true,
          },
        },
        earnings: {
          select: {
            amount: true,
          },
        },
      },
      orderBy,
      take: 50,
    })

    const leaderboard = users.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      username: u.username,
      avatarUrl: u.avatarUrl,
      memberSince: u.memberSince,
      followers: u.pages.reduce((sum, p) => sum + p.followersCount, 0),
      views: u.submissions.reduce((sum, s) => sum + s.viewCount, 0),
      earned: u.earnings.reduce((sum, e) => sum + e.amount, 0),
      pageCount: u.pages.length,
    }))

    return NextResponse.json(leaderboard)
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}
