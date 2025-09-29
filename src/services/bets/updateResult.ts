import { apiBets, handleAxiosError } from "@/lib/apiBets";
import { BetResult } from "@/types/listBets/type";
import { Bet } from "@prisma/client";

export async function updateBetStatus(
    betId: string,
    newStatus: BetResult
): Promise<Bet> {
    try {
        const res = await apiBets.patch(`/updateResult/${betId}`, {
            result: newStatus,
        });

        if (!res.data?.success) {
            console.error("[updateBetStatus] Resposta inesperada:", res.data);
            throw new Error("Erro ao atualizar status da aposta");
        }

        return res.data.data as Bet;
    } catch (err) {
        throw handleAxiosError(err);
    }
}
