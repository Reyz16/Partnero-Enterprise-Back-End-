import { type Prisma, type Referral } from "@prisma/client";
import { z } from "zod";
import { createCrudRouter, type Repo } from "../../lib/crud.js";
import { prisma } from "../../lib/prisma.js";

const repo: Repo<Referral, Prisma.ReferralUncheckedCreateInput> = {
  list: () => prisma.referral.findMany({ orderBy: { createdAt: "asc" } }),
  findById: (id) => prisma.referral.findUnique({ where: { id } }),
  create: (data) => prisma.referral.create({ data }),
  update: (id, data) => prisma.referral.update({ where: { id }, data }),
  remove: async (id) => {
    await prisma.referral.delete({ where: { id } });
  },
};

const schema = z.object({
  partnerId: z.string(),
  customerEmail: z.email(),
  status: z.enum(["lead", "customer", "cancelled"]).default("lead"),
});

export const referralsRouter = createCrudRouter(repo, schema, "Referral");
