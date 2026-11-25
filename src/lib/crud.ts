import { Router } from "express";
import type { ZodObject, ZodRawShape } from "zod";
import { HttpError } from "./errors.js";

export type Repo<T, I> = {
  list: () => Promise<T[]>;
  findById: (id: string) => Promise<T | null>;
  create: (data: I) => Promise<T>;
  update: (id: string, data: Partial<I>) => Promise<T>;
  remove: (id: string) => Promise<void>;
};

export function createCrudRouter<T, I>(repo: Repo<T, I>, schema: ZodObject<ZodRawShape>, name: string) {
  const router = Router();

  router.get("/", async (_req, res) => {
    res.json({ data: await repo.list() });
  });

  router.get("/:id", async (req, res) => {
    const item = await repo.findById(req.params.id);
    if (!item) throw new HttpError(404, `${name} not found`);
    res.json({ data: item });
  });

  router.post("/", async (req, res) => {
    const body = schema.parse(req.body) as I;
    res.status(201).json({ data: await repo.create(body) });
  });

  router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const body = schema.partial().parse(req.body) as Partial<I>;
    if (!(await repo.findById(id))) throw new HttpError(404, `${name} not found`);
    res.json({ data: await repo.update(id, body) });
  });

  router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    if (!(await repo.findById(id))) throw new HttpError(404, `${name} not found`);
    await repo.remove(id);
    res.status(204).end();
  });

  return router;
}
