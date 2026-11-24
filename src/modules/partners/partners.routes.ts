import { z } from "zod";
import { createCrudRouter } from "../../lib/crud.js";
import { type Entity, MemoryStore } from "../../lib/store.js";

export type Partner = Entity & {
  name: string;
  email: string;
  referralCode: string;
  programId?: string;
  status: "pending" | "approved" | "rejected" | "suspended";
};

export const partners = new MemoryStore<Partner>();

const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
  referralCode: z.string().min(3),
  programId: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "suspended"]).default("pending"),
});

export const partnersRouter = createCrudRouter(partners, schema, "Partner");
