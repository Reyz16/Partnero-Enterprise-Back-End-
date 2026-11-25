import { type Payout, type Prisma } from "@prisma/client";
import { z } from "zod";
import { createCrudRouter, type Repo } from "../../lib/crud.js";
import { prisma } from "../../lib/prisma.js";

const repo: Repo<Payout, Prisma.PayoutUncheckedCreateInput> = {
  list: () => prisma.payout.findMany({ orderBy: { createdAt: "asc" } }),
  findById: (id) => prisma.payout.findUnique({ where: { id } }),
  create: (data) => prisma.payout.create({ data }),
  update: (id, data) => prisma.payout.update({ where: { id }, data }),
  remove: async (id) => {
    await prisma.payout.delete({ where: { id } });
  },
};

const schema = z.object({
  partnerId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  method: z.enum(["bank_transfer", "paypal", "other"]),
  status: z.enum(["pending", "processing", "completed", "failed"]).default("pending"),
});

export const payoutsRouter = createCrudRouter(repo, schema, "Payout");
