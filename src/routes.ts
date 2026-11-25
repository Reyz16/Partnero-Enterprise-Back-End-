import { Router } from "express";
import { requireAuth } from "./middleware/auth.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { commissionsRouter } from "./modules/commissions/commissions.routes.js";
import { partnersRouter } from "./modules/partners/partners.routes.js";
import { payoutsRouter } from "./modules/payouts/payouts.routes.js";
import { programsRouter } from "./modules/programs/programs.routes.js";
import { referralsRouter } from "./modules/referrals/referrals.routes.js";

export const api = Router();

api.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

api.use("/auth", authRouter);
api.use("/programs", requireAuth, programsRouter);
api.use("/partners", requireAuth, partnersRouter);
api.use("/referrals", requireAuth, referralsRouter);
api.use("/commissions", requireAuth, commissionsRouter);
api.use("/payouts", requireAuth, payoutsRouter);
