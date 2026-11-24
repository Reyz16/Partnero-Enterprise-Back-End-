import { z } from "zod";
import { createCrudRouter } from "../../lib/crud.js";
import { type Entity, MemoryStore } from "../../lib/store.js";

export type Referral = Entity & {
  partnerId: string;
  customerEmail: string;
  status: "lead" | "customer" | "cancelled";
};

export const referrals = new MemoryStore<Referral>();

const schema = z.object({
  partnerId: z.string(),
  customerEmail: z.email(),
  status: z.enum(["lead", "customer", "cancelled"]).default("lead"),
});

export const referralsRouter = createCrudRouter(referrals, schema, "Referral");
