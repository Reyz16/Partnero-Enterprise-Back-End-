import { type Prisma, type Program } from "@prisma/client";
import { z } from "zod";
import { createCrudRouter, type Repo } from "../../lib/crud.js";
import { prisma } from "../../lib/prisma.js";

const repo: Repo<Program, Prisma.ProgramCreateInput> = {
  list: () => prisma.program.findMany({ orderBy: { createdAt: "asc" } }),
  findById: (id) => prisma.program.findUnique({ where: { id } }),
  create: (data) => prisma.program.create({ data }),
  update: (id, data) => prisma.program.update({ where: { id }, data }),
  remove: async (id) => {
    await prisma.program.delete({ where: { id } });
  },
};

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  commissionType: z.enum(["percentage", "fixed"]),
  commissionValue: z.number().positive(),
  cookieDays: z.number().int().positive().default(30),
  status: z.enum(["active", "paused", "archived"]).default("active"),
});

export const programsRouter = createCrudRouter(repo, schema, "Program");
