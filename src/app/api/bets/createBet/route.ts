import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { createBetSchemaServer } from "@/types/createBet/createBetSchema"
import { handleApiError } from "@/lib/apiError"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = createBetSchemaServer.parse(body)

        const bet = await prisma.bet.create({
            data: parsed,
        })

        return NextResponse.json({ success: true, data: bet }, { status: 201 })
    } catch (error) {
        return handleApiError(error)
    }
}
