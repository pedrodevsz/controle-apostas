"use client"

import { useEffect, useState } from "react"
import { useBetStore } from "@/store/useBetStore"
import { ErrorMessage } from "../errorMessage/ErrorMessage"
import { MdCheckCircleOutline, MdOutlineClose, MdRadioButtonUnchecked } from "react-icons/md"
import { FiTrash } from "react-icons/fi"
import { StatusModal } from "@/components/statusModal/StatusModal"
import { BetResult } from "@/types/listBets/type"
import { formatDate } from "@/hooks/formatDate/formatDate"
import { LoadingPageSkeleton } from "../loadings/loadingPageSkeleton/LoadingPageSkeleton"

export function ListAllBets() {
    const {
        allBets,
        loadingList,
        loadingMore,
        loadingRemoveId,
        loadingUpdateId,
        error,
        fetchAllBetsPaginated,
        removeBet,
        updateBetStatus,
    } = useBetStore()

    const [selectedBetId, setSelectedBetId] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [page, setPage] = useState(1)

    useEffect(() => {
        fetchAllBetsPaginated(page, 10)
    }, [fetchAllBetsPaginated, page])

    const openModal = (betId: string) => {
        setSelectedBetId(betId)
        setIsModalOpen(true)
    }

    const changeStatus = async (newStatus: BetResult) => {
        if (!selectedBetId) return
        await updateBetStatus(selectedBetId, newStatus)
        setIsModalOpen(false)
    }

    const loadMore = () => setPage((prev) => prev + 1)

    if (loadingList && page === 1) return <LoadingPageSkeleton />
    if (error) return <ErrorMessage message="Erro ao buscar apostas" classContainer="text-center" />
    if (allBets.length === 0) return <p className="text-center text-gray-400 mt-6">Nenhuma aposta cadastrada ainda.</p>

    return (
        <div className="my-6 max-w-md mx-auto">
            <h2 className="title-page">Todas as Apostas</h2>
            <div className="relative max-h-[500px] overflow-y-auto">
                {allBets.map((bet, index) => (
                    <div key={bet.id} className="relative flex gap-4 items-stretch my-4">
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => openModal(bet.id)}
                        >
                            {bet.result === "Gain" && <MdCheckCircleOutline className="text-green-500 text-2xl" />}
                            {bet.result === "Loss" && <MdOutlineClose className="text-red-500 text-2xl" />}
                            {bet.result === "Pending" && <MdRadioButtonUnchecked className="text-blue-500 text-2xl" />}
                            {index < allBets.length - 1 && (
                                <div className="w-0.5 bg-gray-600 flex-grow mt-1 -mb-1"></div>
                            )}
                        </div>

                        <div className="bg-[#1E1E2E] p-4 rounded-xl shadow-md text-white flex-1 flex justify-between items-center relative">
                            <div>
                                <p className="text-sm text-gray-400">{formatDate(bet.date)}</p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-300">
                                    <p>
                                        <span className="font-bold text-white">Odd:</span> {bet.odd}
                                    </p>
                                    <p>
                                        <span className="font-bold text-white">Entrada:</span> R$ {bet.entryValue}
                                    </p>
                                </div>
                            </div>

                            <p
                                className={`font-bold text-right ${bet.result === "Gain"
                                    ? "text-green-400"
                                    : bet.result === "Loss"
                                        ? "text-red-400"
                                        : "text-blue-400"
                                    }`}
                            >
                                R$ {bet.result === "Loss" ? `-${bet.entryValue}` : bet.resultValue}
                            </p>

                            <button
                                type="button"
                                disabled={loadingRemoveId === bet.id}
                                className={`absolute top-1 right-3 text-red-600 ${loadingRemoveId === bet.id ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                onClick={() => removeBet(bet.id)}
                            >
                                {loadingRemoveId === bet.id ? (
                                    <span className="animate-spin border-2 border-red-600 border-t-transparent rounded-full w-4 h-4 block"></span>
                                ) : (
                                    <FiTrash size={14} />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-4">
                <button
                    className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    onClick={loadMore}
                    disabled={loadingMore}
                >
                    {loadingMore && (
                        <span className="animate-spin border-2 border-black border-t-transparent rounded-full w-4 h-4"></span>
                    )}
                    {loadingMore ? "Carregando..." : "Carregar mais"}
                </button>
            </div>

            {selectedBetId && (
                <StatusModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentStatus={
                        allBets.find((b) => b.id === selectedBetId)?.result || "Pending"
                    }
                    onChangeStatus={changeStatus}
                    loading={loadingUpdateId === selectedBetId}
                />
            )}
        </div>
    )
}
