import { type Partner, type Prisma } from "@prisma/client";
import { z } from "zod";
import { createCrudRouter, type Repo } from "../../lib/crud.js";
import { prisma } from "../../lib/prisma.js";

const repo: Repo<Partner, Prisma.PartnerUncheckedCreateInput> = {
  list: () => prisma.partner.findMany({ orderBy: { createdAt: "asc" } }),
  findById: (id) => prisma.partner.findUnique({ where: { id } }),
  create: (data) => prisma.partner.create({ data }),
  update: (id, data) => prisma.partner.update({ where: { id }, data }),
  remove: async (id) => {
    await prisma.partner.delete({ where: { id } });
  },
};

const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
  referralCode: z.string().min(3),
  programId: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "suspended"]).default("pending"),
});

export const partnersRouter = createCrudRouter(repo, schema, "Partner");
