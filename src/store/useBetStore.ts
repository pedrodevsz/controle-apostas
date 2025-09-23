import { create } from "zustand";
import { CreateBetFormData } from "@/components/createBet/schema";
import { getBets } from "@/services/bets/fetchBets"
import { createBet } from "@/services/bets/createBet";
import { deleteBet } from "@/services/bets/deleteBet";
import { updateBetStatus } from "@/services/bets/updateResult";
import { BetResult } from "@/types/listBets/type";

type Bet = CreateBetFormData & { id: string; createdAt: string };

interface BetState {
    bets: Bet[];
    loading: boolean;
    error: string | null;
    fetchBets: () => Promise<void>;
    addBet: (bet: CreateBetFormData) => Promise<void>;
    removeBet: (id: string) => Promise<void>;
    updateBetStatus: (id: string, newStatus: BetResult) => Promise<void>
}

export const useBetStore = create<BetState>((set) => ({
    bets: [],
    loading: false,
    error: null,

    fetchBets: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getBets();
            set({ bets: data });
        } catch (err: any) {
            set({ error: err.message || "Erro ao buscar apostas" });
        } finally {
            set({ loading: false });
        }
    },

    addBet: async (bet) => {
        set({ loading: true, error: null });
        try {
            const savedBet = await createBet(bet);
            set((state) => ({ bets: [...state.bets, savedBet] }));
        } catch (err: any) {
            set({ error: err.message || "Erro ao criar aposta" });
        } finally {
            set({ loading: false });
        }
    },

    removeBet: async (id) => {
        set({ loading: true, error: null });
        try {
            await deleteBet(id);
            set((state) => ({ bets: state.bets.filter((b) => b.id !== id) }));
        } catch (err: any) {
            set({ error: err.message || "Erro ao deletar aposta" });
        } finally {
            set({ loading: false });
        }
    },

    updateBetStatus: async (id: string, newStatus: BetResult) => {
        set({ loading: true, error: null });
        try {
            await updateBetStatus(id, newStatus);
            set((state) => ({
                bets: state.bets.map(b =>
                    b.id === id ? { ...b, result: newStatus } : b
                ),
            }));
        } catch (err: any) {
            set({ error: err.message || "Erro ao atualizar status" });
        } finally {
            set({ loading: false });
        }
    },

}));
