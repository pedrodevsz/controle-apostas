"use client"

import { useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createBetSchema, CreateBetFormData } from "./schema"
import { useBetStore } from "@/store/useBetStore"
import axios from "axios"

export function CreateBet() {
    const addBet = useBetStore((state) => state.addBet)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreateBetFormData>({
        resolver: zodResolver(createBetSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            result: "Pending",
        },
    })

    const odd = watch("odd")
    const entryValue = watch("entryValue")
    const result = watch("result")

    useEffect(() => {
        const oddNum = parseFloat(odd || "0")
        const entryNum = parseFloat(entryValue || "0")

        if (result === "Loss") {
            setValue("resultValue", "0")
        } else if (!isNaN(oddNum) && !isNaN(entryNum)) {
            setValue("resultValue", String((oddNum * entryNum).toFixed(2)))
        } else {
            setValue("resultValue", "0")
        }
    }, [odd, entryValue, result, setValue])

    const handleFormSubmit: SubmitHandler<CreateBetFormData> = async (data) => {

        try {
            await addBet(data)
        } catch (err) {
            console.error("Erro ao salvar no banco:", err)
        }

        reset()
    }
    return (
        <div className="max-w-md mx-auto bg-[#1E1E2E] p-6 rounded-2xl shadow-md text-white">
            <h2 className="title-page">Cadastro de Aposta</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <fieldset className="space-y-3">
                    <div>
                        <label className="block mb-1 text-sm">Odd</label>
                        <input
                            type="text"
                            {...register("odd")}
                            className="w-full rounded-lg p-2 bg-[#121212] border border-[#2A2A3D] focus:outline-none"
                        />
                        {errors.odd && (
                            <span className="text-red-400 text-sm">{errors.odd.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm">Valor da Entrada</label>
                        <input
                            type="text"
                            {...register("entryValue")}
                            className="w-full rounded-lg p-2 bg-[#121212] border border-[#2A2A3D] focus:outline-none"
                        />
                        {errors.entryValue && (
                            <span className="text-red-400 text-sm">
                                {errors.entryValue.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm">Data</label>
                        <input
                            type="date"
                            disabled
                            {...register("date")}
                            className="w-full rounded-lg p-2 bg-[#121212] border border-[#2A2A3D] text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm">Resultado</label>
                        <select
                            {...register("result")}
                            className="w-full rounded-lg p-2 bg-[#121212] border border-[#2A2A3D] focus:outline-none"
                        >
                            <option value="Pending">Pendente</option>
                            <option value="Gain">Ganho</option>
                            <option value="Loss">Perda</option>
                        </select>
                        {errors.result && (
                            <span className="text-red-400 text-sm">
                                {errors.result.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm">Valor do Resultado</label>
                        <input
                            type="text"
                            disabled
                            {...register("resultValue")}
                            className="w-full rounded-lg p-2 bg-[#121212] border border-[#2A2A3D] text-gray-400"
                        />
                    </div>
                </fieldset>

                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition"
                >
                    Cadastrar Aposta
                </button>
            </form>
        </div>
    )
}
