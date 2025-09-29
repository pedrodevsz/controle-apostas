import { apiBets, handleAxiosError } from "@/lib/apiBets";
import { Bet } from "@prisma/client";

export async function fetchAllBets(): Promise<Bet[]> {
    try {
        const res = await apiBets.get("/fetchAllBets");

        // Verificando se o retorno está no formato correto
        if (!res.data?.success) {
            console.error("[fetchAllBets] Resposta inesperada da API:", res.data);
            return [];
        }

        // Retornando apenas o array de bets
        return res.data.data ?? [];
    } catch (err) {
        throw handleAxiosError(err);
    }
}
