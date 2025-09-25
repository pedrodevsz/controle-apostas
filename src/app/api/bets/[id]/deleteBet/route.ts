import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { handleApiError } from "@/lib/apiError"

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params

    try {
        const bet = await prisma.bet.findUnique({ where: { id } })
        if (!bet) {
            return NextResponse.json(
                { success: false, code: "NOT_FOUND", message: "Aposta não encontrada" },
                { status: 404 }
            )
        }

        await prisma.bet.delete({ where: { id } })

        return NextResponse.json({ success: true, message: "Aposta deletada com sucesso" }, { status: 200 })
    } catch (error) {
        return handleApiError(error)
    }
}
