import express from "express";
import cors from "cors";

import routes from "./routes";

const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];

const app = express();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true
}));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", routes);

export default app;
