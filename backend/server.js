import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, notFound } from "./src/middlewares/errorMiddleware.js";

// Routers
import authRoutes from "./src/routes/authRoutes.js";
// import userRoutes from "./src/routes/userRoutes.js";
// import venueRoutes from "./src/routes/venueRoutes.js";
// import bookingRoutes from "./src/routes/bookingRoutes.js";
// import ratingRoutes from "./src/routes/ratingRoutes.js";
// import postRoutes from "./src/routes/postRoutes.js";
// import commentRoutes from "./src/routes/commentRoutes.js";

import pool from "./config/db.js";

dotenv.config();
pool();

const app = express();
const PORT = process.env.PORT || 5000;

// ESM uchun path sozlash
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware’lar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload papkasini static qilish
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Route’lar
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/venues", venueRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/ratings", ratingRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);

// Xatoliklarni tutuvchi middleware’lar
app.use(notFound);
app.use(errorHandler);

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlayapti...`);
});
