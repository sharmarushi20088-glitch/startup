import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS so your HTML page (Live Server) can call the API.[web:73]
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*"
  })
);

// Serve uploaded ID card images publicly.[web:72]
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;

await connectDB();
app.listen(port, () => console.log(`API running on ${port}`));
