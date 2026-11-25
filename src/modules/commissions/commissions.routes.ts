import { type Commission, type Prisma } from "@prisma/client";
import { z } from "zod";
import { createCrudRouter, type Repo } from "../../lib/crud.js";
import { prisma } from "../../lib/prisma.js";

const repo: Repo<Commission, Prisma.CommissionUncheckedCreateInput> = {
  list: () => prisma.commission.findMany({ orderBy: { createdAt: "asc" } }),
  findById: (id) => prisma.commission.findUnique({ where: { id } }),
  create: (data) => prisma.commission.create({ data }),
  update: (id, data) => prisma.commission.update({ where: { id }, data }),
  remove: async (id) => {
    await prisma.commission.delete({ where: { id } });
  },
};

const schema = z.object({
  partnerId: z.string(),
  referralId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  status: z.enum(["pending", "approved", "paid", "rejected"]).default("pending"),
});

export const commissionsRouter = createCrudRouter(repo, schema, "Commission");
