import { apiBets, handleAxiosError } from "@/lib/apiBets";

export async function deleteBet(id: string): Promise<boolean> {
    try {
        const res = await apiBets.delete(`/${id}/deleteBet`);

        if (!res.data?.success) {
            console.error("[deleteBet] Resposta inesperada:", res.data);
            throw new Error("Erro ao deletar aposta");
        }

        return true;
    } catch (err) {
        throw handleAxiosError(err);
    }
}
