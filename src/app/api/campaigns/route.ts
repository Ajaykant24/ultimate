import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get("status") as any
    const platform = searchParams.get("platform") as any
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const sort = searchParams.get("sort") || "newest"

    const skip = (page - 1) * limit

    let where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const orderBy: any = {}
    if (sort === "budget") {
      orderBy.totalBudget = "desc"
    } else if (sort === "views") {
      orderBy.analytics = { _count: "desc" }
    } else {
      orderBy.createdAt = "desc"
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          platforms: true,
          submissions: { select: { id: true, status: true } },
          _count: { select: { submissions: true, members: true } },
        },
      }),
      prisma.campaign.count({ where }),
    ])

    return NextResponse.json({
      campaigns,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session || (session as any)?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        whatWeLookingFor: data.whatWeLookingFor,
        requiredHashtag: data.requiredHashtag,
        posterUrl: data.posterUrl,
        totalBudget: data.totalBudget,
        cpmRate: data.cpmRate,
        maxPerCreator: data.maxPerCreator,
        maxPerVideo: data.maxPerVideo,
        minViewsForPayout: data.minViewsForPayout,
        launchDate: data.launchDate ? new Date(data.launchDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status || "DRAFT",
        createdById: (session as any)?.user.id!,
        platforms: {
          create: data.platforms?.map((p: string) => ({ platform: p })) || [],
        },
      },
      include: { platforms: true },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error: any) {
    console.error("Error creating campaign:", error)
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    )
  }
}
