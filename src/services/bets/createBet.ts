import { CreateBetFormData } from "@/types/createBet/createBetSchema";
import { apiBets, handleAxiosError } from "@/lib/apiBets";
import { Bet } from "@prisma/client";

export async function createBet(data: CreateBetFormData): Promise<Bet> {
    try {
        const res = await apiBets.post("/createBet", data);

        if (!res.data?.success) {
            console.error("[createBet] Resposta inesperada:", res.data);
            throw new Error("Erro ao criar aposta");
        }

        return res.data.data as Bet;
    } catch (err) {
        throw handleAxiosError(err);
    }
}
