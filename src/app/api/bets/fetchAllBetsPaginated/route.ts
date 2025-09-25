import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/apiError"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        const page = parseInt(searchParams.get("page") || "1", 10)
        const limit = parseInt(searchParams.get("limit") || "10", 10)
        const skip = (page - 1) * limit

        const allBets = await prisma.bet.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        })

        const totalCount = await prisma.bet.count()

        return NextResponse.json(
            {
                success: true,
                data: allBets,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                },
            },
            { status: 200 }
        )
    } catch (error) {
        return handleApiError(error)
    }
}
