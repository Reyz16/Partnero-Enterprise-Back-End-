import { z } from "zod";
import { createCrudRouter } from "../../lib/crud.js";
import { type Entity, MemoryStore } from "../../lib/store.js";

export type Payout = Entity & {
  partnerId: string;
  amount: number;
  currency: string;
  method: "bank_transfer" | "paypal" | "other";
  status: "pending" | "processing" | "completed" | "failed";
};

export const payouts = new MemoryStore<Payout>();

const schema = z.object({
  partnerId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  method: z.enum(["bank_transfer", "paypal", "other"]),
  status: z.enum(["pending", "processing", "completed", "failed"]).default("pending"),
});

export const payoutsRouter = createCrudRouter(payouts, schema, "Payout");
