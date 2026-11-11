import type { FastifyPluginAsync } from "fastify";
import { login, logout, registerOwner } from "../services/auth.service.js";
import { registerOwnerValidator } from "../validators/auth.validator.js";
import { loginValidator } from "../validators/login.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export const authController: FastifyPluginAsync = async (fastify) => {
  fastify.post("/auth/register-owner", async (request, reply) => {
    try {
    const validatedData = registerOwnerValidator.safeParse(request.body);
    if (!validatedData.success) {
        return reply.status(400).send({
          message: "Invalid registration details",
          errors: validatedData.error.flatten(),
        });
      }
    const result = await registerOwner(validatedData.data);
    return reply.status(201).send({
      status: 201,
        message: "Owner registered successfully",
        data: result,
        errors: [],
    });
    } catch (error) {
        if (error instanceof Error && error.message === "User already exists") {
            return reply.status(409).send({
              message: "User already exists",
              code: "USER_ALREADY_EXISTS",
            });
          }
        
          throw error;
    }
  });

  fastify.post("/auth/login", async (request, reply) => {
    const validationResult = loginValidator.safeParse(request.body);
  
    if (!validationResult.success) {
      return reply.status(400).send({
        message: "Invalid login details",
        errors: validationResult.error.flatten(),
      });
    }
  
    try {
      const result = await login(validationResult.data);
  
      reply.setCookie("session", result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
  
      return reply.status(200).send({
        status: 200,
        message: "Login successful",
        data: result.user,
        errors: [],
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Invalid credentials") {
          return reply.status(401).send({
            message: "Invalid email or password",
            code: "INVALID_EMAIL_OR_PASSWORD",
          });
        }
  
        if (error.message === "Account is inactive") {
          return reply.status(403).send({
            message: "Your account is inactive",
            code: "ACCOUNT_IS_INACTIVE",
          });
        }
      }
  
      throw error;
    }
  });

  fastify.get("/auth/me",{preHandler:authenticate},async (request,reply) => {
    return reply.status(200).send({
        status: 200,
        message: "User fetched successfully",
        data: request.user,
        errors: [],
      });
  })
  
  fastify.post(
    "/auth/logout",
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      const sessionToken = request.cookies.session;
  
      if (!sessionToken) {
        return reply.status(401).send({
          message: "Authentication required",
          code: "UNAUTHENTICATED",
        });
      }
  
      await logout(sessionToken);
  
      reply.clearCookie("session", {
        path: "/",
      });
  
      return reply.status(200).send({
        status: 200,
        message: "Logged out successfully",
        data: null,
        errors: [],
      });
    },
  );
};   

