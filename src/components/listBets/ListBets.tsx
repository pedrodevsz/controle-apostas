"use client";

import { useState, useEffect } from "react";
import { useBetStore } from "@/store/useBetStore";
import { LoadingComponentSkeleton } from "../loadings/loadingComponentSkeleton/LoadingComponentSkeleton";
import { ErrorMessage } from "../errorMessage/ErrorMessage";
import { MdCheckCircleOutline, MdOutlineClose, MdRadioButtonUnchecked } from "react-icons/md";
import { FiTrash } from "react-icons/fi";
import { StatusModal } from "@/components/statusModal/StatusModal";
import { BetResult } from "@/types/listBets/type";
import { formatDate } from "@/hooks/formatDate/formatDate";

export function BetList() {
    const { bets, fetchBets, removeBet, updateBetStatus, loading, error } = useBetStore();
    const [selectedBetId, setSelectedBetId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchBets();
    }, [fetchBets]);

    const openModal = (betId: string) => {
        setSelectedBetId(betId);
        setIsModalOpen(true);
    };

    const changeStatus = async (newStatus: BetResult) => {
        if (!selectedBetId) return;

        await updateBetStatus(selectedBetId, newStatus);
        setIsModalOpen(false);
    };

    if (loading) return <LoadingComponentSkeleton />;
    if (error) return <ErrorMessage message="Houve um erro ao buscar apostas" classContainer="text-center" />;
    if (bets.length === 0) return <p className="text-center text-gray-400 mt-6">Nenhuma aposta cadastrada.</p>;

    return (
        <div className="my-6">
            <h2 className="title-page">Apostas recentes</h2>
            <div className="relative max-h-[400px] overflow-y-auto">
                {bets.map((bet, index) => (
                    <div key={bet.id} className="relative flex gap-4 items-stretch my-4">
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => openModal(bet.id)}
                        >
                            {bet.result === "Gain" && (
                                <MdCheckCircleOutline className="text-green-500 text-2xl" />
                            )}
                            {bet.result === "Loss" && (
                                <MdOutlineClose className="text-red-500 text-2xl" />
                            )}
                            {bet.result === "Pending" && (
                                <MdRadioButtonUnchecked className="text-blue-500 text-2xl" />
                            )}
                            {index < bets.length - 1 && (
                                <div className="w-0.5 bg-gray-600 flex-grow mt-1 -mb-1"></div>
                            )}
                        </div>

                        {/* Card da aposta */}
                        <div className="bg-[#1E1E2E] p-4 rounded-xl shadow-md text-white flex-1 flex justify-between items-center relative">
                            <div>
                                <p className="text-sm text-gray-400">{formatDate(bet.date)}</p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-300">
                                    <p>
                                        <span className="font-bold text-white">Odd:</span> {bet.odd}
                                    </p>
                                    <p>
                                        <span className="font-bold text-white">Entrada:</span> R${" "}
                                        {bet.entryValue}
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
                                R${" "}
                                {bet.result === "Loss"
                                    ? `-${bet.entryValue}`
                                    : bet.resultValue}
                            </p>
                            <button
                                type="button"
                                className="absolute top-1 right-3 text-red-600"
                                onClick={() => removeBet(bet.id)}
                            >
                                <FiTrash size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedBetId && (
                <StatusModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentStatus={
                        bets.find((b) => b.id === selectedBetId)?.result || "Pending"
                    }
                    onChangeStatus={changeStatus}
                />
            )}
        </div>
    );
}
