import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const campaign = await prisma.campaign.findUnique({
      where: { slug },
      include: {
        platforms: true,
        submissions: {
          take: 10,
          orderBy: { submittedAt: "desc" },
          include: { user: true, page: true },
        },
        analytics: {
          orderBy: { date: "desc" },
          take: 30,
        },
        _count: {
          select: {
            submissions: true,
            members: true,
          },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(campaign)
  } catch (error: any) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    )
  }
}
