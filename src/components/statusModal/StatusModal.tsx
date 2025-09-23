"use client";

import React from "react";
import { BetResult } from "@/types/listBets/type";

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStatus: BetResult;
    onChangeStatus: (newStatus: BetResult) => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, currentStatus, onChangeStatus }) => {
    if (!isOpen) return null;

    const statuses: BetResult[] = ["Gain", "Loss", "Pending"];

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[#1E1E2E] p-6 rounded-xl shadow-lg w-80">
                <h3 className="text-white text-lg mb-4">Alterar status</h3>
                <div className="flex flex-col gap-3">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            className={`p-2 rounded ${status === currentStatus ? "bg-gray-700 text-white font-bold" : "bg-gray-800 text-gray-300"}`}
                            onClick={() => {
                                onChangeStatus(status);
                                onClose();
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <button className="mt-4 text-red-500" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};
