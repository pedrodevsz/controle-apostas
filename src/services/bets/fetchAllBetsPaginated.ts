import { apiBets, handleAxiosError } from "@/lib/apiBets";
import { Bet } from "@prisma/client";

interface PaginatedBetsResponse {
    data: Bet[];
    total?: number; // att futura mostrar total de bilhetes feitos
}


export async function fetchAllBetsPaginated(
    page: number = 1,
    limit: number = 10
): Promise<PaginatedBetsResponse> {
    try {
        const res = await apiBets.get("/fetchAllBetsPaginated", {
            params: { page, limit },
        });

        if (!res.data?.success) {
            console.error("[fetchAllBetsPaginated] Resposta inesperada:", res.data);
            return { data: [] };
        }

        return {
            data: res.data.data as Bet[],
            //total: res.data.total, // caso a API retorne total de registros
        };
    } catch (err) {
        throw handleAxiosError(err);
    }
}
