import Fastify from "fastify";
import { authController } from "./controllers/auth.controller.js";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";

export const app = Fastify({
  logger: true,
});
const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:3000";


await app.register(cors, {
  origin: frontendUrl,
  credentials: true,
});
// Health check route
app.get("/health", async (request, reply) => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "rent-api is running",
  };
});
app.decorateRequest("user", null);
await app.register(cookie);
await app.register(authController);