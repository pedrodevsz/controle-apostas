import { create } from "zustand";
import { CreateBetFormData } from "@/types/createBet/createBetSchema";
import { fetchBetsToday } from "@/services/bets/fetchBetsToday";
import { fetchAllBetsPaginated } from "@/services/bets/fetchAllBetsPaginated";
import { createBet } from "@/services/bets/createBet";
import { deleteBet } from "@/services/bets/deleteBet";
import { updateBetStatus } from "@/services/bets/updateResult";
import { BetResult } from "@/types/listBets/type";

export type Bet = CreateBetFormData & {
    id: string;
    createdAt: string;
    result: "Pending" | "Gain" | "Loss";
    resultValue: string;
    odd: string;
    entryValue: string;
    date: string;
};

interface BetState {
    betsToday: Bet[];
    allBets: Bet[];

    loadingList: boolean;
    loadingMore: boolean;
    loadingCreate: boolean;
    loadingRemoveId: string | null;
    loadingUpdateId: string | null;

    error: string | null;

    fetchBetsToday: () => Promise<void>;
    fetchAllBetsPaginated: (page?: number, limit?: number) => Promise<void>;
    addBet: (bet: CreateBetFormData) => Promise<void>;
    removeBet: (id: string) => Promise<void>;
    updateBetStatus: (id: string, newStatus: BetResult) => Promise<void>;
}

export const useBetStore = create<BetState>((set, get) => ({
    betsToday: [],
    allBets: [],
    loadingList: false,
    loadingMore: false,
    loadingCreate: false,
    loadingRemoveId: null,
    loadingUpdateId: null,
    error: null,

    fetchBetsToday: async () => {
        set({ loadingList: true, error: null });
        try {
            const bets = (await fetchBetsToday()) || [];

            const todayUTC = new Date();
            const startOfTodayUTC = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate(), 0, 0, 0, 0));
            const endOfTodayUTC = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate(), 23, 59, 59, 999));

            const betsToday: Bet[] = bets
                .map(b => ({
                    ...b,
                    odd: String(b.odd),
                    entryValue: String(b.entryValue),
                    resultValue: String(b.resultValue),
                    result: b.result as BetResult,
                    date: new Date(b.date).toISOString(),
                    createdAt: new Date(b.createdAt).toISOString(),
                }))
                .filter(b => {
                    const betDate = new Date(b.date);
                    return betDate >= startOfTodayUTC && betDate <= endOfTodayUTC;
                });

            set({ betsToday });
        } catch (err: unknown) {
            set({ error: (err as Error).message || "Erro ao buscar apostas do dia" });
        } finally {
            set({ loadingList: false });
        }
    },

    fetchAllBetsPaginated: async (page = 1, limit = 10) => {
        set({ loadingList: page === 1, loadingMore: page > 1, error: null });
        try {
            const response = await fetchAllBetsPaginated(page, limit);
            const bets = Array.isArray(response.data) ? response.data : [];

            const normalized: Bet[] = bets.map(b => ({
                ...b,
                odd: String(b.odd),
                entryValue: String(b.entryValue),
                resultValue: String(b.resultValue),
                result: b.result as BetResult,
                date: new Date(b.date).toISOString(),
                createdAt: new Date(b.createdAt).toISOString(),
            }));

            set(state => ({
                allBets: page === 1 ? normalized : [...state.allBets, ...normalized],
            }));
        } catch (err: unknown) {
            console.error("Erro fetchAllBetsPaginated:", err);
            set({ error: (err as Error).message || "Erro ao buscar apostas paginadas" });
        } finally {
            set({ loadingList: false, loadingMore: false });
        }
    }
    ,

    addBet: async (bet) => {
        set({ loadingCreate: true, error: null });
        try {
            await createBet(bet);
            await get().fetchBetsToday();
            await get().fetchAllBetsPaginated(1, 10);
        } catch (err: unknown) {
            set({ error: (err as Error).message || "Erro ao criar aposta" });
        } finally {
            set({ loadingCreate: false });
        }
    },

    removeBet: async (id) => {
        set({ loadingRemoveId: id, error: null });
        try {
            await deleteBet(id);
            set(state => ({
                betsToday: state.betsToday.filter(b => b.id !== id),
                allBets: state.allBets.filter(b => b.id !== id),
            }));
        } catch (err: unknown) {
            set({ error: (err as Error).message || "Erro ao deletar aposta" });
        } finally {
            set({ loadingRemoveId: null });
        }
    },

    updateBetStatus: async (id, newStatus) => {
        set({ loadingUpdateId: id, error: null });
        try {
            const updated = await updateBetStatus(id, newStatus);

            const updatedBet: Bet = {
                ...updated,
                odd: String(updated.odd),
                entryValue: String(updated.entryValue),
                resultValue: String(updated.resultValue),
                result: updated.result as BetResult,
                date: new Date(updated.date).toISOString(),
                createdAt: new Date(updated.createdAt).toISOString(),
            };

            set(state => ({
                betsToday: state.betsToday.map(b => (b.id === id ? updatedBet : b)),
                allBets: state.allBets.map(b => (b.id === id ? updatedBet : b)),
            }));
        } catch (err: unknown) {
            set({ error: (err as Error).message || "Erro ao atualizar status" });
        } finally {
            set({ loadingUpdateId: null });
        }
    },
}));
