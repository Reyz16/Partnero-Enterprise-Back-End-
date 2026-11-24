import { z } from "zod";
import { createCrudRouter } from "../../lib/crud.js";
import { type Entity, MemoryStore } from "../../lib/store.js";

export type Commission = Entity & {
  partnerId: string;
  referralId?: string;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "paid" | "rejected";
};

export const commissions = new MemoryStore<Commission>();

const schema = z.object({
  partnerId: z.string(),
  referralId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  status: z.enum(["pending", "approved", "paid", "rejected"]).default("pending"),
});

export const commissionsRouter = createCrudRouter(commissions, schema, "Commission");
