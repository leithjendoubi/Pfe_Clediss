import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { Productrouter } from "./routes/productsRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderrouter from "./routes/orderRoute.js";
import livreurRouter from "./routes/livreurRoutes.js";
import administrationrouter from "./routes/administrationRouter.js";
import { initializeAdministration } from './controllers/administrationController.js';
import marcheRouter from "./routes/marcheRouter.js";
import producteurRouter from "./routes/producteurRouter.js";
import vendeurRouter from "./routes/vendeurRouter.js";




const app = express();
const port = process.env.PORT || 4000;

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", Productrouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderrouter);
app.use("/api/livreur", livreurRouter);
app.use("/api/administration", administrationrouter);
app.use("/api/marche",marcheRouter);
app.use("/api/producteur",producteurRouter);
app.use("/api/vendeur",vendeurRouter);

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB first
    await initializeAdministration(); // Then initialize administration data
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();