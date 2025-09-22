import { z } from "zod"

const RESULT_OPTIONS = ["Pending", "Gain", "Loss"] as const

export const createBetSchema = z.object({
    odd: z.string().min(1, { message: "Odd é obrigatória" }),
    entryValue: z.string().min(1, { message: "Valor da entrada é obrigatório" }),
    date: z.string()
        .default(() => new Date().toISOString().split("T")[0])
        .catch(() => new Date().toISOString().split("T")[0]),
    result: z.enum(RESULT_OPTIONS),
    resultValue: z.string()
        .default("0")
        .catch(() => "0")
})

export type CreateBetFormData = z.infer<typeof createBetSchema>
