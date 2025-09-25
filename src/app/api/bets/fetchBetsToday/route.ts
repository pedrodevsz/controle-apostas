import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/apiError"

function getTodayUTCRange() {
    const today = new Date()

    const start = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        0, 0, 0, 0
    ))

    const end = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        23, 59, 59, 999
    ))

    return { start, end }
}

export async function GET() {
    try {
        const { start, end } = getTodayUTCRange()

        const bets = await prisma.bet.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: { createdAt: "desc" },
        })

        console.log(bets)
        return NextResponse.json({ success: true, data: bets }, { status: 200 })
    } catch (error) {
        return handleApiError(error)
    }
}
