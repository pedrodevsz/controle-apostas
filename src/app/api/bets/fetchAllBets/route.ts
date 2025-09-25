import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/apiError"

export async function GET() {
    try {
        const allBets = await prisma.bet.findMany({
            orderBy: { createdAt: "desc" },
        })

        console.log(allBets)
        return NextResponse.json({ success: true, data: allBets }, { status: 200 })
    } catch (error) {
        return handleApiError(error)
    }
}
