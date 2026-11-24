import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler, notFound } from "./middleware/error.js";
import { api } from "./routes.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/v1", api);
app.use(notFound);
app.use(errorHandler);
