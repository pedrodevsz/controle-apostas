import { create } from "zustand"
import { CreateBetFormData } from "@/types/createBet/createBetSchema"
import { fetchBetsToday } from "@/services/bets/fetchBetsToday"
import { fetchAllBetsPaginated } from "@/services/bets/fetchAllBetsPaginated"
import { createBet } from "@/services/bets/createBet"
import { deleteBet } from "@/services/bets/deleteBet"
import { updateBetStatus } from "@/services/bets/updateResult"
import { BetResult } from "@/types/listBets/type"

export type Bet = CreateBetFormData & { id: string; createdAt: string; result: BetResult; resultValue: number; odd: number; entryValue: number; date: string }

interface BetState {
    betsToday: Bet[]
    allBets: Bet[]
    loading: boolean
    error: string | null
    fetchBetsToday: () => Promise<void>
    fetchAllBetsPaginated: (page: number, limit: number) => Promise<void>
    addBet: (bet: CreateBetFormData) => Promise<void>
    removeBet: (id: string) => Promise<void>
    updateBetStatus: (id: string, newStatus: BetResult) => Promise<void>
}

export const useBetStore = create<BetState>((set) => ({
    betsToday: [],
    allBets: [],
    loading: false,
    error: null,

    fetchBetsToday: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetchBetsToday()
            const bets: Bet[] = response?.data || []

            const todayUTC = new Date()
            const startOfTodayUTC = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate(), 0, 0, 0, 0))
            const endOfTodayUTC = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate(), 23, 59, 59, 999))

            const betsToday = bets.filter((bet) => {
                const betDate = new Date(bet.date)
                return betDate >= startOfTodayUTC && betDate <= endOfTodayUTC
            })

            set({ betsToday })
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erro ao buscar apostas do dia"
            set({ error: message })
        } finally {
            set({ loading: false })
        }
    },

    fetchAllBetsPaginated: async (page = 1, limit = 10) => {
        set({ loading: true, error: null })
        try {
            const response = await fetchAllBetsPaginated(page, limit)
            const bets: Bet[] = response?.data || []
            set((state) => ({
                allBets: page === 1 ? bets : [...state.allBets, ...bets],
            }))
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erro ao buscar apostas paginadas"
            set({ error: message })
        } finally {
            set({ loading: false })
        }
    },

    addBet: async (bet) => {
        set({ loading: true, error: null })
        try {
            const savedBet: Bet = await createBet(bet)
            set((state) => ({
                betsToday: [...state.betsToday, savedBet],
                allBets: [...state.allBets, savedBet],
            }))
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erro ao criar aposta"
            set({ error: message })
        } finally {
            set({ loading: false })
        }
    },

    removeBet: async (id) => {
        set({ loading: true, error: null })
        try {
            await deleteBet(id)
            set((state) => ({
                betsToday: state.betsToday.filter((b) => b.id !== id),
                allBets: state.allBets.filter((b) => b.id !== id),
            }))
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erro ao deletar aposta"
            set({ error: message })
        } finally {
            set({ loading: false })
        }
    },

    updateBetStatus: async (id: string, newStatus: BetResult) => {
        set({ loading: true, error: null })
        try {
            const updatedBet: Bet = await updateBetStatus(id, newStatus)
            set((state) => ({
                betsToday: state.betsToday.map((b) => b.id === id ? { ...b, result: newStatus, resultValue: updatedBet.resultValue } : b),
                allBets: state.allBets.map((b) => b.id === id ? { ...b, result: newStatus, resultValue: updatedBet.resultValue } : b),
            }))
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erro ao atualizar status"
            set({ error: message })
        } finally {
            set({ loading: false })
        }
    },
}))
