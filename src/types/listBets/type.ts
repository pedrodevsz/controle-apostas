import { z } from "zod";
import { createBetSchema } from "@/components/createBet/schema";

export type Bet = z.infer<typeof createBetSchema>;
export type BetResult = Bet["result"]; 
