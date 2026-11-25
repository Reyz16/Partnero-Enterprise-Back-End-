import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../lib/errors.js";

export type AuthUser = { sub: string; email: string; role: "admin" | "manager" };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Missing token");
  try {
    req.user = jwt.verify(header.slice(7), env.jwtSecret) as AuthUser;
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
  next();
}

export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) throw new HttpError(403, "Forbidden");
    next();
  };
}
