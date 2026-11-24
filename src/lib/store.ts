import { randomUUID } from "node:crypto";

export type Entity = { id: string; createdAt: string; updatedAt: string };

// In-memory placeholder; replace with a database-backed repository.
export class MemoryStore<T extends Entity> {
  private items = new Map<string, T>();

  list(): T[] {
    return [...this.items.values()];
  }
  get(id: string): T | undefined {
    return this.items.get(id);
  }
  create(data: Omit<T, keyof Entity>): T {
    const now = new Date().toISOString();
    const item = { ...data, id: randomUUID(), createdAt: now, updatedAt: now } as T;
    this.items.set(item.id, item);
    return item;
  }
  update(id: string, data: Partial<Omit<T, keyof Entity>>): T | undefined {
    const current = this.items.get(id);
    if (!current) return undefined;
    const next = { ...current, ...data, updatedAt: new Date().toISOString() };
    this.items.set(id, next);
    return next;
  }
  remove(id: string): boolean {
    return this.items.delete(id);
  }
}
