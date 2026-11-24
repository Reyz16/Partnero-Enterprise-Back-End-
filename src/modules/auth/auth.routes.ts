import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../config/env.js";
import { HttpError } from "../../lib/errors.js";
import { type Entity, MemoryStore } from "../../lib/store.js";
import { requireAuth } from "../../middleware/auth.js";

type User = Entity & {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "manager";
};

const users = new MemoryStore<User>();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});
const loginSchema = z.object({ email: z.email(), password: z.string() });

function signToken(user: User) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

const publicUser = ({ passwordHash: _p, ...rest }: User) => rest;

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const body = registerSchema.parse(req.body);
  if (users.list().some((u) => u.email === body.email)) {
    throw new HttpError(409, "Email already registered");
  }
  const user = users.create({
    name: body.name,
    email: body.email,
    passwordHash: await bcrypt.hash(body.password, 10),
    role: users.list().length === 0 ? "admin" : "manager",
  });
  res.status(201).json({ data: { user: publicUser(user), token: signToken(user) } });
});

authRouter.post("/login", async (req, res) => {
  const body = loginSchema.parse(req.body);
  const user = users.list().find((u) => u.email === body.email);
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    throw new HttpError(401, "Invalid credentials");
  }
  res.json({ data: { user: publicUser(user), token: signToken(user) } });
});

authRouter.get("/me", requireAuth, (req, res) => {
  const user = users.get(req.user!.sub);
  if (!user) throw new HttpError(404, "User not found");
  res.json({ data: publicUser(user) });
});
