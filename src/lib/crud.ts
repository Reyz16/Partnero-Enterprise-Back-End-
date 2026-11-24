import { Router } from "express";
import type { ZodObject, ZodRawShape } from "zod";
import { HttpError } from "./errors.js";
import { type Entity, MemoryStore } from "./store.js";

export function createCrudRouter<T extends Entity>(
  store: MemoryStore<T>,
  schema: ZodObject<ZodRawShape>,
  name: string,
) {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json({ data: store.list() });
  });

  router.get("/:id", (req, res) => {
    const item = store.get(req.params.id);
    if (!item) throw new HttpError(404, `${name} not found`);
    res.json({ data: item });
  });

  router.post("/", (req, res) => {
    const body = schema.parse(req.body) as Omit<T, keyof Entity>;
    res.status(201).json({ data: store.create(body) });
  });

  router.patch("/:id", (req, res) => {
    const body = schema.partial().parse(req.body) as Partial<Omit<T, keyof Entity>>;
    const item = store.update(req.params.id, body);
    if (!item) throw new HttpError(404, `${name} not found`);
    res.json({ data: item });
  });

  router.delete("/:id", (req, res) => {
    if (!store.remove(req.params.id)) throw new HttpError(404, `${name} not found`);
    res.status(204).end();
  });

  return router;
}
