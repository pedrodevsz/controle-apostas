import { apiBets, handleAxiosError } from "@/lib/apiBets";
import { Bet } from "@prisma/client";


export async function fetchBetsToday(): Promise<Bet[]> {
    try {
        const res = await apiBets.get("/fetchBetsToday");

        if (!res.data?.success) {
            console.error("[fetchBetsToday] Resposta inesperada:", res.data);
            return [];
        }
        return res.data.data as Bet[];
    } catch (err) {
        throw handleAxiosError(err);
    }
}
