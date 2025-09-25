import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { handleApiError } from "@/lib/apiError"

const updateResultSchema = z.object({
    result: z.enum(["Pending", "Gain", "Loss"]),
})

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params

    try {
        const body = await req.json()
        const parsed = updateResultSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    code: "VALIDATION_ERROR",
                    message: "Status inválido. Use Pending, Gain ou Loss.",
                    details: parsed.error.issues,
                },
                { status: 400 }
            )
        }

        const { result } = parsed.data

        const bet = await prisma.bet.findUnique({ where: { id } })
        if (!bet) {
            return NextResponse.json(
                {
                    success: false,
                    code: "NOT_FOUND",
                    message: "Aposta não encontrada",
                },
                { status: 404 }
            )
        }

        let resultValue = 0
        if (result === "Gain") resultValue = bet.entryValue * bet.odd
        if (result === "Loss") resultValue = -bet.entryValue

        const updatedBet = await prisma.bet.update({
            where: { id },
            data: { result, resultValue },
        })

        return NextResponse.json({ success: true, data: updatedBet }, { status: 200 })
    } catch (error) {
        return handleApiError(error)
    }
}
