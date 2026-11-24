import { z } from "zod";
import { createCrudRouter } from "../../lib/crud.js";
import { type Entity, MemoryStore } from "../../lib/store.js";

export type Program = Entity & {
  name: string;
  description?: string;
  commissionType: "percentage" | "fixed";
  commissionValue: number;
  cookieDays: number;
  status: "active" | "paused" | "archived";
};

export const programs = new MemoryStore<Program>();

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  commissionType: z.enum(["percentage", "fixed"]),
  commissionValue: z.number().positive(),
  cookieDays: z.number().int().positive().default(30),
  status: z.enum(["active", "paused", "archived"]).default("active"),
});

export const programsRouter = createCrudRouter(programs, schema, "Program");
