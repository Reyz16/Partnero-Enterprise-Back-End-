import { type User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../config/env.js";
import { HttpError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/auth.js";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});
const loginSchema = z.object({ email: z.email(), password: z.string() });

function signToken(user: Pick<User, "id" | "email" | "role">) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

const publicUser = ({ passwordHash: _p, ...rest }: User) => rest;

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const body = registerSchema.parse(req.body);
  if (await prisma.user.findUnique({ where: { email: body.email } })) {
    throw new HttpError(409, "Email already registered");
  }
  const isFirstUser = (await prisma.user.count()) === 0;
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: await bcrypt.hash(body.password, 10),
      role: isFirstUser ? "admin" : "manager",
    },
  });
  res.status(201).json({ data: { user: publicUser(user), token: signToken(user) } });
});

authRouter.post("/login", async (req, res) => {
  const body = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    throw new HttpError(401, "Invalid credentials");
  }
  res.json({ data: { user: publicUser(user), token: signToken(user) } });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) throw new HttpError(404, "User not found");
  res.json({ data: publicUser(user) });
});
