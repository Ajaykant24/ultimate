import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "followers"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "25"), 100)

    const skip = (page - 1) * limit

    let where: any = {}
    if (search) {
      where.username = { contains: search, mode: "insensitive" }
    }

    const orderBy: any = {}
    if (sort === "views") {
      orderBy.submissions = { _count: "desc" }
    } else if (sort === "earned") {
      orderBy.earnings = { _count: "desc" }
    } else {
      orderBy.username = "asc"
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          bannerUrl: true,
          createdAt: true,
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
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    const formattedUsers = users.map((u) => ({
      ...u,
      followers: u.pages.reduce((sum, p) => sum + p.followersCount, 0),
      views: u.submissions.reduce((sum, s) => sum + s.viewCount, 0),
      earned: u.earnings.reduce((sum, e) => sum + e.amount, 0),
    }))

    return NextResponse.json({
      users: formattedUsers,
      total,
      page,
      limit,
    })
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
